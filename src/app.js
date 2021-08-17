let apiKey = "2af1ff2de81cdd8d67552da7d4b4331d";

function formatDate(timestamp) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
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

  // This hack means this isn't a general function anymore.
  currentDay = day;
  return `${days[day]} ${hours}:${minutes}`;
}

function formatShortDay(day) {
  let shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return shortDays[day];
}
function buildUnitString() {
  if (weatherUnits[currentUnits]) {
    return `&units=${weatherUnits[currentUnits]}`;
  } else {
    return "";
  }
}
function formatWind(wind) {
  // Wind directions
  let windDirections = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  // mapping of wind speed display units
  let windSpeedUnits = {
    C: "m/s",
    K: "m/s",
    F: "mph",
  };
  let windDirection = windDirections[Math.round(wind.deg / 22.5) % 16];
  let windSpeed = Math.round(wind.speed);
  return `${windDirection}&nbsp;${windSpeed}&nbsp;${windSpeedUnits[currentUnits]}`;
}
function displayForecast(weather) {
  let forecast = weather.data.daily;
  let days = ["Thu", "Fri", "Sat"];
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  // The first day of forecast can often be 'today'.  So
  // I've put in more than a bit of a hack to detect that and
  // only print days that are not today.  'printed' keeps
  // track of how many days we've actually printed so we don't
  // go overboard!
  let printed = 0;
  forecast.forEach(function (forecastDay) {
    let minimum = Math.round(forecastDay.temp.min);
    let maximum = Math.round(forecastDay.temp.max);
    let date = new Date(forecastDay.dt * 1000);
    let day = date.getDay();
    if (printed < 6 && day !== currentDay) {
      let shortDay = formatShortDay(day);
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
                  <div class="weather-forecast-date" id="forecast-date">
                    ${shortDay}
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
      printed = printed + 1;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let excludes = "minutely,hourly,current,alerts";
  let unitString = buildUnitString();
  let url = `https://api.openweathermap.org/data/2.5/onecall?appid=${apiKey}&lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=${excludes}${unitString}`;
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
  windspeedField.innerHTML = formatWind(weather.data.wind);
  currentTimeField.innerHTML = formatDate(weather.data.dt * 1000);
  currentIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`
  );
  currentIcon.setAttribute("alt", weather.data.weather[0].description);
  getForecast(weather.data.coord);
}

function search(city) {
  let unitString = buildUnitString();
  let url = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&q=${city}${unitString}`;
  axios.get(url).then(displayWeather);
  currentCity = city;
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function changeUnits(event) {
  event.preventDefault();
  let newUnits = event.target.id.replace("change-units-", "").toUpperCase();
  if (newUnits === currentUnits) {
    return;
  }
  if (currentUnits === "K") {
    kelvinSelect.classList.remove("active");
  } else if (currentUnits === "C") {
    celciusSelect.classList.remove("active");
  } else {
    farenheitSelect.classList.remove("active");
  }
  currentUnits = newUnits;
  if (currentUnits === "K") {
    kelvinSelect.classList.add("active");
  } else if (currentUnits === "C") {
    celciusSelect.classList.add("active");
  } else {
    farenheitSelect.classList.add("active");
  }
  search(currentCity);
}
// Map from internal units to display units
let displayUnits = {
  C: "°C",
  F: "°F",
  K: " K",
};
// What we send to openweathermap to get a specific unit of temperature
let weatherUnits = {
  C: "metric",
  F: "imperial",
  K: "",
};

let currentUnits = "C";
let celciusTemperature = null;
let currentCity = null;
currentDay = null;
search("New York");
let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let farenheitSelect = document.querySelector("#change-units-f");
farenheitSelect.addEventListener("click", changeUnits);
let kelvinSelect = document.querySelector("#change-units-k");
kelvinSelect.addEventListener("click", changeUnits);
let celciusSelect = document.querySelector("#change-units-c");
celciusSelect.addEventListener("click", changeUnits);
