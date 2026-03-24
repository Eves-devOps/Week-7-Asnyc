Author: Eva Tsatsi

# Weather Dashboard

A real-time weather dashboard built with **vanilla JavaScript**.  
It fetches live weather data using the **Open-Meteo API** and demonstrates practical use of **Async JavaScript** concepts such as Promises, async/await, and error handling.

---

## Features
- 🔍 Search any city in the world
- 🌡️ Displays temperature (with toggle between ℃ and ℉)
- 💨 Shows wind speed
- ☁️ Displays weather condition with icons
- ⏳ Loading state messages while fetching data
- ❌ Error handling for invalid city names
- 📍 Auto-loads Johannesburg weather on startup
- 🕒 Recent searches stored in localStorage and displayed as clickable buttons

---

## Tech Used
- **HTML & CSS** for structure and styling
- **Vanilla JavaScript (ES6+)**
- **Async/Await** for cleaner asynchronous code
- **Fetch API** for making HTTP requests
- **Open-Meteo Geocoding API** (city → coordinates)
- **Open-Meteo Weather API** (coordinates → current weather)

---

## What I Learned
- The difference between **synchronous** and **asynchronous** JavaScript
- How to use **Promises** and chain them for sequential tasks
- How **async/await** simplifies asynchronous code compared to callbacks
- The **two-await pattern** with Fetch API (response → JSON)
- Error handling with `try/catch` and user-friendly messages
- DOM manipulation to dynamically update the UI
- How to chain **two API calls** in sequence (geocoding → weather)
- Using **localStorage** to persist recent searches across page reloads

---

## Bonus Features
- 🌡️ Temperature toggle between Celsius and Fahrenheit
- 🕒 Recent searches (last 3 cities) displayed as quick buttons
- 💾 LocalStorage integration so searches survive page refresh
- 🎨 Responsive layout with centered card and styled buttons

---

## ScreenShot

![Weatherapp ScreenShot](assets/image/weatherapp.png)
## Live Demo Deployment
This project is live at Github pages
![Weather Dashboard](https://eves-devops.github.io/Week-7-Asnyc/)
