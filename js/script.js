// Funktion zum Laden der UV-Daten
async function loadData() {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                const url = `https://currentuvindex.com/api/v1/uvi?latitude=${lat}&longitude=${lon}`;

                try {
                    const response = await fetch(url);
                    const json = await response.json();

                    // Aktuellen UV-Index und die nächsten 6 Stunden extrahieren
                    const uvNow = json.now.uvi;
                    const uvForecast = json.forecast.slice(0, 6).map(f => ({
                        time: new Date(f.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        uvi: f.uvi
                    }));

                    resolve({ uvNow, uvForecast });
                } catch (error) {
                    console.error("API-Fehler:", error);
                    resolve(false);
                }
            }, (geoError) => {
                console.error("Geolocation-Fehler:", geoError);
                resolve(false);
            });
        } else {
            console.error("Geolocation wird nicht unterstützt.");
            resolve(false);
        }
    });
}

// Verwendung
loadData().then(data => {
    if (data) {
        document.getElementById("uv-index").innerText = `Aktueller UV-Index: ${data.uvNow}`;

        const forecastEl = document.getElementById("uv-forecast");
        forecastEl.innerHTML = "<strong>UV-Vorhersage (nächste 6 Std.):</strong><br>";
        data.uvForecast.forEach(entry => {
            forecastEl.innerHTML += `${entry.time}: UV-Index ${entry.uvi}<br>`;
        });
    } else {
        document.getElementById("uv-index").innerText = "UV-Daten konnten nicht geladen werden.";
    }
});

