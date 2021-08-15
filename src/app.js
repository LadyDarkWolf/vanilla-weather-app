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
  return `${days[day]} ${hours}:${minutes}`;
}
function displayWeather(weather) {
  let currentTempField = document.querySelector("#current-temperature");
  let locationField = document.querySelector("#location");
  let conditionsField = document.querySelector("#conditions");
  let humidityField = document.querySelector("#humidity");
  let windspeedField = document.querySelector("#windspeed");
  let currentTimeField = document.querySelector("#current-time");
  let currentIcon = document.querySelector("#current-icon");
  currentTempField.innerHTML = Math.round(weather.data.main.temp);
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
search("New York");
let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);
