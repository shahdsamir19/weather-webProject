const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon img");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const humidityElement = document.querySelector(".humidity");
const windElement = document.querySelector(".wind-speed");
const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");

const weather = {};
weather.temperature = {
    unit: "celsius"
};

const KELVIN = 273;
const API_KEY = "82005d27a116c2880c8f0fcb866998a0";

function displayWeather() {
    iconElement.src = `http://openweathermap.org/img/wn/${weather.iconId}@2x.png`;
    tempElement.innerHTML = `${weather.temperature.value}° <span>${weather.temperature.unit === "celsius" ? "C" : "F"}</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    humidityElement.innerHTML = weather.humidity;
    windElement.innerHTML = weather.windSpeed;
}

function celsiusToFahrenheit(temperature) {
    return (temperature * 9/5) + 32;
}

tempElement.addEventListener("click", function() {
    if (weather.temperature.value === undefined) return;

    if (weather.temperature.unit === "celsius") {
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        tempElement.innerHTML = `${fahrenheit}° <span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    } else {
        tempElement.innerHTML = `${weather.temperature.value}° <span>C</span>`;
        weather.temperature.unit = "celsius";
    }
});

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't support geolocation.</p>";
}

function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude);
}

function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p>${error.message}</p>`;
}

function getWeather(latitude, longitude) {
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
    fetch(api)
        .then(response => response.json())
        .then(data => {
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
            weather.humidity = data.main.humidity;
            weather.windSpeed = data.wind.speed;
        })
        .then(() => {
            displayWeather();
        });
}

searchBtn.addEventListener("click", function() {
    const city = searchInput.value;
    if (city) {
        getWeatherByCity(city);
    }
});

function getWeatherByCity(city) {
    let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
    fetch(api)
        .then(response => response.json())
        .then(data => {
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
            weather.humidity = data.main.humidity;
            weather.windSpeed = data.wind.speed;
        })
        .then(() => {
            displayWeather();
        });
}
