// Funktion zum Abrufen der UV-Daten
let aktuellerUV = 0; // global für den UV-Index

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

                    const uvNow = json.now.uvi;  // aktuellen UV-Index abrufen
                    aktuellerUV = uvNow;  // den aktuellen UV-Index speichern

                    // UV-Prognose für die nächsten Stunden abrufen
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

// Funktion zur Bestimmung der UV-Farbklasse (z.B. grün, gelb, rot)
function getUVColorClass(uvi) {
    if (uvi <= 2) return "uv-low";  // grünlich
    if (uvi <= 5) return "uv-moderate";  // gelb
    if (uvi <= 7) return "uv-high";  // hellrot
    if (uvi <= 10) return "uv-veryhigh";  // rot
    return "uv-extreme";  // dunkelrot
}

// UV-Index und Prognose auf der Seite anzeigen
document.addEventListener("DOMContentLoaded", () => {
    loadData().then(data => {
        if (data) {
            // Aktuellen UV-Index anzeigen
            const uvElement = document.getElementById("uv-index");
            uvElement.innerHTML = `<span class="uv-label"> UV </span> ${data.uvNow}`;

            // Die entsprechende Farbe für den UV-Index anwenden
            const uvClass = getUVColorClass(data.uvNow);
            uvElement.classList.add(uvClass); // Farbe durch CSS-Klasse anwenden

            // Prognose anzeigen
            const forecastEl = document.getElementById("uv-forecast");
            forecastEl.innerHTML = "";  // Vorherige Prognose entfernen

            // Für jede Vorhersage die Zeit und den UV-Wert anzeigen
            data.uvForecast.forEach(entry => {
                const box = document.createElement("div");
                box.className = "uv-box";
                box.innerHTML = `
                    <div class="uv-wert">UV ${entry.uvi}</div>
                    <div class="uv-zeit">${entry.time}</div>
                `;
                forecastEl.appendChild(box);
            });
        } else {
            console.error("UV-Index und Prognose konnten nicht geladen werden.");
            document.getElementById("uv-index").innerText = "Daten konnten nicht geladen werden.";
        }
    });
});
