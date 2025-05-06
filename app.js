// Funktion, um UV-Daten von der API zu holen
async function fetchUVData() {
  const lat = 40.7128; // Beispiel: New York City
  const lon = -74.0060; // Beispiel: New York City

  const apiUrl = `https://currentuvindex.com/api/v1/uvi?latitude=${lat}&longitude=${lon}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("API-Fehler");
    const data = await response.json();
    
    // Hier kannst du nun die UV-Daten anzeigen
    console.log("Aktueller UV-Index:", data.current.uvi);
    
    // Aktualisiere dein HTML mit den UV-Daten
    document.querySelector('.uv-header h1').innerText = data.current.uvi.toFixed(1);
    
    // Zeige eine entsprechende Empfehlung basierend auf dem UV-Index an
    const advice = getUVAdvice(data.current.uvi);
    document.querySelector('.advice').innerText = advice;

    // Prognose anzeigen (z.B. die nächsten 6 Stunden)
    const forecastList = document.querySelector('.forecast ul');
    forecastList.innerHTML = ''; // Clear existing

    data.forecast.slice(0, 6).forEach(entry => {
      const li = document.createElement('li');
      li.innerHTML = `uv <strong>${entry.uvi.toFixed(1)}</strong><br>${formatTime(entry.time)}`;
      forecastList.appendChild(li);
    });

  } catch (error) {
    console.error("Fehler beim Abrufen der UV-Daten:", error);
    document.querySelector('.advice').innerText = "Fehler beim Abrufen der UV-Daten.";
  }
}

// Hilfsfunktionen
function getUVAdvice(uvi) {
  if (uvi < 3) return "Low - kein Stress 😎";
  if (uvi < 6) return "Moderat - Schatte wär guet ☂️";
  if (uvi < 8) return "H
