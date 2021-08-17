let apiKey = "2af1ff2de81cdd8d67552da7d4b4331d";

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (hours < 10) {
    hours = "0" + hours;
  }
  let day = date.getDay();
  return `${days[day]} ${hours}:${minutes}`;
}

function formatShortDay(timestamp) {
  let date = new Date(timestamp * 1000);
  return shortDays[date.getDay()];
}
function displayForecast(weather) {
  let forecast = weather.data.daily;
  let days = ["Thu", "Fri", "Sat"];
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      let minimum = Math.round(forecastDay.temp.min);
      let maximum = Math.round(forecastDay.temp.max);
      let day = formatShortDay(forecastDay.dt);
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
                  <div class="weather-forecast-date" id="forecast-date">
                    ${day}
                  </div>
                  <img
                    src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
                    alt="sunny"
                    id="forecast-icon"
                    width="60px"
                  />
                  <div class="weather-forecast-temperatures">
                    <span class="weather-forecast-temperature-maximum">
                      ${maximum}°
                    </span>
                    <span class="weather-forecast-temperature-minimum">
                      ${minimum}°
                    </span>
                  </div>
                </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let excludes = "minutely,hourly,current,alerts";
  let url = `https://api.openweathermap.org/data/2.5/onecall?appid=${apiKey}&lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=${excludes}&units=metric`;
  axios.get(url).then(displayForecast);
}
function displayWeather(weather) {
  let currentTempField = document.querySelector("#current-temperature");
  let locationField = document.querySelector("#location");
  let conditionsField = document.querySelector("#conditions");
  let humidityField = document.querySelector("#humidity");
  let windspeedField = document.querySelector("#windspeed");
  let currentTimeField = document.querySelector("#current-time");
  let currentIcon = document.querySelector("#current-icon");

  celciusTemperature = weather.data.main.temp;
  currentTempField.innerHTML = Math.round(celciusTemperature);
  locationField.innerHTML = `${weather.data.name},&nbsp;${weather.data.sys.country}`;
  conditionsField.innerHTML = weather.data.weather[0].description;
  humidityField.innerHTML = weather.data.main.humidity;
  windspeedField.innerHTML = Math.round(weather.data.wind.speed);
  currentTimeField.innerHTML = formatDate(weather.data.dt * 1000);
  currentIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`
  );
  currentIcon.setAttribute("alt", weather.data.weather[0].description);
  getForecast(weather.data.coord);
}

function search(city) {
  let url = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&q=${city}&units=metric`;
  axios.get(url).then(displayWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}
function displayFarenheit(event) {
  event.preventDefault();
  let currentTempField = document.querySelector("#current-temperature");
  let farenheitTemperature = (celciusTemperature * 9) / 5 + 32;
  currentTempField.innerHTML = Math.round(farenheitTemperature);
  kelvinSelect.classList.remove("active");
  celciusSelect.classList.remove("active");
  farenheitSelect.classList.add("active");
}

function displayKelvin(event) {
  event.preventDefault();
  let currentTempField = document.querySelector("#current-temperature");
  let kelvinTemperature = celciusTemperature + 273.15;
  currentTempField.innerHTML = Math.round(kelvinTemperature);
  kelvinSelect.classList.add("active");
  celciusSelect.classList.remove("active");
  farenheitSelect.classList.remove("active");
}

function displayCelcius(event) {
  event.preventDefault();
  let currentTempField = document.querySelector("#current-temperature");
  currentTempField.innerHTML = Math.round(celciusTemperature);
  kelvinSelect.classList.remove("active");
  celciusSelect.classList.add("active");
  farenheitSelect.classList.remove("active");
}
let celciusTemperature = null;
search("New York");
let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let farenheitSelect = document.querySelector("#change-units-f");
farenheitSelect.addEventListener("click", displayFarenheit);
let kelvinSelect = document.querySelector("#change-units-k");
kelvinSelect.addEventListener("click", displayKelvin);
let celciusSelect = document.querySelector("#change-units-c");
celciusSelect.addEventListener("click", displayCelcius);
