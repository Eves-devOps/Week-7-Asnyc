// DOM elements
const form = document.querySelector('#search-form');
const input = document.querySelector('#city-input');
const statusDiv = document.querySelector('#status');
const errorDiv = document.querySelector('#error-msg');
const spinner = document.querySelector('#spinner');
const weatherCard = document.querySelector('#weather-card');
const cityNameEl = document.querySelector('#city-name');
const tempEl = document.querySelector('#temp');
const windEl = document.querySelector('#wind');
const conditionEl = document.querySelector('#condition');
const toggleBtn = document.querySelector('#toggle-temp');
const forecastDiv = document.querySelector('#forecast');

let currentTempC = null;

// Spinner helpers
const showSpinner = () => spinner.style.display = 'block';
const hideSpinner = () => spinner.style.display = 'none';

// Weather condition lookup
const getCondition = (code) => {
  if (code === 0) return "☀️ Clear sky";
  if (code <= 3) return "⛅ Partly cloudy";
  if (code <= 48) return "🌫️ Foggy";
  if (code <= 55) return "🌦️ Drizzle";
  if (code <= 65) return "🌧️ Rain";
  if (code <= 75) return "❄️ Snow";
  if (code <= 82) return "🌧️ Showers";
  if (code === 95) return "⛈️ Thunderstorm";
  return `Code ${code}`;
};

// Get coordinates
const getCoordinates = async (city) => {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  const data = await response.json();
  if (!data.results || data.results.length === 0) throw new Error(`City not found: '${city}'`);
  const result = data.results[0];
  return { lat: result.latitude, lon: result.longitude, name: result.name, country: result.country };
};

// Get weather (current + 5-day forecast)
const getWeather = async (lat, lon) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Weather request failed: ${response.status}`);
  const data = await response.json();
  return { current: data.current_weather, daily: data.daily };
};

// Display weather + forecast
const displayWeather = (location, weather) => {
  cityNameEl.textContent = `${location.name}, ${location.country}`;
  currentTempC = weather.current.temperature;
  tempEl.textContent = `${currentTempC}℃`;
  windEl.textContent = `${weather.current.windspeed} km/h`;
  conditionEl.textContent = getCondition(weather.current.weathercode);
  weatherCard.style.display = 'block';
  // Change background theme based on weather code
const body = document.body;
body.className = ""; // reset

const code = weather.current.weathercode;
if (code === 0) body.classList.add("clear-sky");
else if (code <= 3) body.classList.add("cloudy");
else if (code <= 65) body.classList.add("rainy");
else if (code <= 82) body.classList.add("rainy");
else if (code === 95) body.classList.add("stormy");
else if (code <= 75) body.classList.add("snowy");


  // Forecast (5 days)
  forecastDiv.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    const day = document.createElement('div');
    day.className = "forecast-day";
    day.innerHTML = `
      <h4>Day ${i+1}</h4>
      <p>${getCondition(weather.daily.weathercode[i])}</p>
      <p>Max: ${weather.daily.temperature_2m_max[i]}℃</p>
      <p>Min: ${weather.daily.temperature_2m_min[i]}℃</p>
    `;
    forecastDiv.appendChild(day);
  }
};

let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
const recentDiv = document.querySelector('#recent-searches');

const addRecentSearch = (city) => {
  if (!recentSearches.includes(city)) {
    recentSearches.unshift(city);
    if (recentSearches.length > 3) recentSearches.pop();
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }
  renderRecentSearches();
};

const renderRecentSearches = () => {
  recentDiv.innerHTML = "";
  recentSearches.forEach(city => {
    const btn = document.createElement('button');
    btn.textContent = city;
    btn.className = "recent-btn";
    btn.addEventListener('click', () => searchWeather(city));
    recentDiv.appendChild(btn);
  });
};

// Search weather
const searchWeather = async (city) => {
  statusDiv.textContent = "Searching...";
  errorDiv.textContent = "";
  weatherCard.style.display = "none";
  forecastDiv.innerHTML = "";
  showSpinner();

  try {
    const location = await getCoordinates(city);
    statusDiv.textContent = `Found: ${location.name}, fetching weather...`;
    const weather = await getWeather(location.lat, location.lon);
    statusDiv.textContent = "Done!";
    displayWeather(location, weather);
  } catch (error) {
    errorDiv.textContent = error.message;
    statusDiv.textContent = "";
  } finally {
    hideSpinner();
  }
};

// Form submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = input.value.trim();
  if (!city) {
    errorDiv.textContent = "Please enter a city name.";
    return;
  }
  searchWeather(city);
});

// Toggle temperature
toggleBtn.addEventListener('click', () => {
  if (currentTempC === null) return;
  if (toggleBtn.textContent.includes("°F")) {
    const tempF = (currentTempC * 9/5 + 32).toFixed(1);
    tempEl.textContent = `${tempF}℉`;
    toggleBtn.textContent = "Switch to ℃";
  } else {
    tempEl.textContent = `${currentTempC}℃`;
    toggleBtn.textContent = "Switch to °F";
  }
});

// Auto-load Johannesburg
searchWeather("Johannesburg");

// Load recent searches from localStorage
loadRecentSearches();

// Load recent searches from localStorage
function loadRecentSearches() {
  const searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
  recentSearchesDiv.innerHTML = '';
  searches.forEach(city => {
    const btn = document.createElement('button');
    btn.className = 'recent-btn';
    btn.textContent = city;
    btn.addEventListener('click', () => searchWeather(city));
    recentSearchesDiv.appendChild(btn);
  });
}

// Save search to localStorage
function saveSearch(city) {
  let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
  if (!searches.includes(city)) {
    searches.unshift(city);
    if (searches.length > 5) searches.pop();
    localStorage.setItem('recentSearches', JSON.stringify(searches));
    loadRecentSearches();
  }
}

// Load recent searches on page load
loadRecentSearches();


// Clear recent searches
clearSearchesBtn.addEventListener('click', () => {
  localStorage.removeItem('recentSearches');
  loadRecentSearches();
});