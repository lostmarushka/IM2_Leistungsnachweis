// Funktion zum Laden der UV-Daten
let aktuellerUV = 0; // global für SPF-Berechnung

// UV-Klasse basierend auf dem UV-Index
function getUVColorClass(uvi) {
    if (uvi <= 2) return "uv-low";       // grünlich
    if (uvi <= 5) return "uv-moderate";  // gelb
    if (uvi <= 7) return "uv-high";      // hellrot
    if (uvi <= 10) return "uv-veryhigh"; // rot
    return "uv-extreme";                 // dunkelrot
}

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

                    const uvNow = json.now.uvi;
                    aktuellerUV = uvNow;

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

// Funktion für UV-Sprüche
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

// Initial laden
loadData().then(data => {
    if (data) {
        document.getElementById("uv-index").innerHTML = `<span class="uv-label"> UV </span> ${data.uvNow}`;

        // Füge die Klasse basierend auf dem UV-Index hinzu
        const uvClass = getUVColorClass(data.uvNow);
        document.getElementById("uv-index").classList.add(uvClass);

        const forecastEl = document.getElementById("uv-forecast");
        forecastEl.innerHTML = "";

        data.uvForecast.forEach(entry => {
            const box = document.createElement("div");
            box.className = "uv-box";
            box.innerHTML = `
                <div class="uv-wert">UV ${entry.uvi}</div>
                <div class="uv-zeit">${entry.time}</div>
            `;
            forecastEl.appendChild(box);
        });
        
        const spruch = getUvSpruch(data.uvNow);
        document.getElementById("uv-spruch").innerText = spruch;
    } else {
        document.getElementById("uv-index").innerText = "UV-Daten konnten nicht geladen werden.";
    }
});

// SPF-Rechner-Logik
let gewaehlterHauttyp = null;
let gewaehlteSonnenzeit = null;
const berechneBtn = document.getElementById("berechne-spf");

// Hauttyp auswählen
document.querySelectorAll('.hauttyp_options span').forEach((span, index) => {
    const desc = span.getAttribute('data-description');

    span.addEventListener('mouseenter', () => {
        if (!gewaehlterHauttyp) {
            document.getElementById('hauttyp-info').textContent = desc;
        }
    });

    span.addEventListener('mouseleave', () => {
        if (!gewaehlterHauttyp) {
            document.getElementById('hauttyp-info').textContent = '';
        }
    });

    span.addEventListener('click', () => {
        gewaehlterHauttyp = index + 1;

        document.querySelectorAll('.hauttyp_options span').forEach(s => s.classList.remove('selected'));
        span.classList.add('selected');

        document.getElementById('hauttyp-info').textContent = desc;

        berechneBtn.classList.remove('selected'); // Button zurücksetzen
    });
});

// Sonnenzeit auswählen
document.querySelectorAll('.Sonnenzeit_options span').forEach(span => {
    span.addEventListener('click', () => {
        gewaehlteSonnenzeit = parseInt(span.textContent);

        document.querySelectorAll('.Sonnenzeit_options span').forEach(s => s.classList.remove('selected'));
        span.classList.add('selected');

        berechneBtn.classList.remove('selected'); // Button zurücksetzen
    });
});

// SPF berechnen
berechneBtn.addEventListener('click', () => {
    if (!gewaehlterHauttyp || !gewaehlteSonnenzeit || !aktuellerUV) {
        document.getElementById("spf-ergebnis").innerText = "Bitte alles auswählen.";
        berechneBtn.classList.remove('selected'); // Kein Ergebnis -> kein Button-Styling
        return;
    }

    const risiko = gewaehlterHauttyp * aktuellerUV * gewaehlteSonnenzeit;

    let spf = "";
    let tipp = "";

    if (risiko < 10) {
        spf = "LSF 20";
        tipp = ", eher entspannt.";
    } else if (risiko <= 20) {
        spf = "LSF 30";
        tipp = ", nach 1.5 stond nachcreme.";
    } else {
        spf = "LSF 50+";
        tipp = ", schötz dech guet!";
    }

    document.getElementById("spf-ergebnis").innerText = `Du bruchsch ${spf} ${tipp}`;
    berechneBtn.classList.add('selected'); // Button markieren
});

// Starte nur, wenn DOM geladen ist
document.addEventListener("DOMContentLoaded", () => {
    loadForecast();
});
