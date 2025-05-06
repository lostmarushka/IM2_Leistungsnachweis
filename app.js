const uvDisplay = document.querySelector('.uv-display h1');
const forecastList = document.getElementById('forecast-list');

function getUVData(lat, lon) {
  const url = `https://currentuvindex.com/api/v1/uvi?latitude=${lat}&longitude=${lon}`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("API call failed.");
      return response.json();
    })
    .then(data => {
      const currentUV = data.result.uv;
      const forecast = data.result.uv_max;

      // Update current UV
      uvDisplay.textContent = currentUV.toFixed(1);

      // Update forecast list
      if (forecastList && forecast) {
        forecastList.innerHTML = '';
        forecast.forEach(item => {
          const li = document.createElement('li');
          li.innerHTML = `uv <strong>${item.uv}</strong><br>${item.time}`;
          forecastList.appendChild(li);
        });
      }
    })
    .catch(err => {
      console.error("UV API error:", err);
      uvDisplay.textContent = "N/A";
    });
}

function fetchLocationAndUV() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        getUVData(latitude, longitude);
      },
      err => {
        console.error("Geolocation error:", err);
        // Fallback coordinates (e.g., NYC)
        getUVData(40.6943, -73.9249);
      }
    );
  } else {
    console.error("Geolocation not supported.");
    getUVData(40.6943, -73.9249);
  }
}

// Start on load
fetchLocationAndUV();
