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

// Funktion zum Abrufen eines passenden Spruchs basierend auf dem UV-Index
function getUvSpruch(uv) {
    if (uv <= 2) {
        return "Chasch ganz locker blibe – d’Sunne macht grad Pause. Aber vergiss dä Huet nöd, slaye goht immer!";
    } else if (uv <= 5) {
        return "Halt vellecht mal usschau nach schatte und check s’Schmiär-O-Meter för din Sonnecremebedarf.";
    } else if (uv <= 7) {
        return "Jetzt wird’s ernst mit dr Sunne. Alli met commitment issues - schmiäred eu guet ih.";
    } else if (uv <= 10) {
        return "Dr Grill lauft und du besch zmitzt drin. Schatte, Crème und Huet – s’isch ned verhandlungsfähig.";
    } else {
        return "Alarmstufe rot! D’Sunne isch im Overdrive. Ohni Schutz goht nüüt meh. Am beschte: Sünnele miedä – oder min. 50er-Crème met Spachtel uffträge.";
    }
}

// Verwendung
loadData().then(data => {
    if (data) {
        document.getElementById("uv-index").innerText = `UV ${data.uvNow}`;

        const forecastEl = document.getElementById("uv-forecast");
        forecastEl.innerHTML = ""; // Leeren, falls schon Daten drin sind

        data.uvForecast.forEach(entry => {
            const box = document.createElement("div");
            box.className = "uv-box";
            box.innerHTML = `<span>UV ${entry.uvi}</span><span>${entry.time}</span>`;
            forecastEl.appendChild(box);
        });

        // UV-Spruch anzeigen
        const spruch = getUvSpruch(data.uvNow);
        document.getElementById("uv-spruch").innerText = spruch;

    } else {
        document.getElementById("uv-index").innerText = "UV-Daten konnten nicht geladen werden.";
    }
});

// Hauttyp-Beschreibung beim Hover anzeigen
document.querySelectorAll('.hauttyp_options span').forEach(span => {
    span.addEventListener('mouseenter', () => {
        const desc = span.getAttribute('data-description');
        document.getElementById('hauttyp-info').textContent = desc;
    });

    span.addEventListener('mouseleave', () => {
        document.getElementById('hauttyp-info').textContent = '';
    });
});
