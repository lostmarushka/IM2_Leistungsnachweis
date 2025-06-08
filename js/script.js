// Funktion zum Laden der UV-Daten
let aktuellerUV = 0; // global für SPF-Berechnung

// UV-Klasse basierend auf dem UV-Index
function getUVColorClass(uvi) {
    if (uvi <= 2) return "uv-low";       
    if (uvi <= 5) return "uv-moderate";  
    if (uvi <= 7) return "uv-high";      
    if (uvi <= 10) return "uv-veryhigh"; 
    return "uv-extreme";               
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

        berechneBtn.classList.remove('selected'); 
    });
});

// Sonnenzeit auswählen
document.querySelectorAll('.Sonnenzeit_options span').forEach(span => {
    span.addEventListener('click', () => {
        gewaehlteSonnenzeit = parseInt(span.textContent);

        document.querySelectorAll('.Sonnenzeit_options span').forEach(s => s.classList.remove('selected'));
        span.classList.add('selected');

        berechneBtn.classList.remove('selected'); 
    });
});

// SPF berechnen
berechneBtn.addEventListener('click', () => {
    if (!gewaehlterHauttyp || !gewaehlteSonnenzeit || !aktuellerUV) {
        document.getElementById("spf-ergebnis").innerText = "Bitte alles auswählen.";
        berechneBtn.classList.remove('selected');
        return;
    }

    // Hauttyp in Eigenschutzzeit (in Minuten)
    const hauttypMinuten = [10, 15, 25, 35]; 
    const eigenschutzzeit = hauttypMinuten[gewaehlterHauttyp - 1];

    // UV-Anpassung (UV 8 als Standard = 100%)
    const uvFaktor = 8 / aktuellerUV;
    const angepassteSchutzzeit = eigenschutzzeit * uvFaktor;

    // Sonnenzeit in Minuten
    const geplanteSonnenzeit = gewaehlteSonnenzeit * 60;

    // Benötigter SPF
    const spfRoh = geplanteSonnenzeit / angepassteSchutzzeit;
    const spfEmpfohlen = Math.ceil(spfRoh);

    // Effektive Schutzdauer (2/3-Regel)
    const effektiveDauer = Math.floor((spfEmpfohlen * angepassteSchutzzeit) * 2 / 3);

    let spf = "";
    if (spfEmpfohlen <= 20) {
        spf = "SPF 20";
    } else if (spfEmpfohlen <= 30) {
        spf = "SPF 30";
    } else {
        spf = "SPF 50+";
    }

    const stunden = Math.floor(effektiveDauer / 60);
    const minuten = effektiveDauer % 60;
    const zeitText = stunden > 0 ? `${stunden}h ${minuten}min` : `${minuten}min`;

    const tipp = `Nacheschmiäre i ca. ${zeitText}.`;

    document.getElementById("spf-ergebnis").innerHTML = `Du bruchsch <strong>${spf}</strong>. ${tipp}`;
    berechneBtn.classList.add('selected');
});

// Starte nur, wenn DOM geladen ist
document.addEventListener("DOMContentLoaded", () => {
    loadForecast();
});
