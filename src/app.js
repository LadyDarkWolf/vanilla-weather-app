let apiKey = "2af1ff2de81cdd8d67552da7d4b4331d";

let baseUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&q=Sydney,AU&units=metric`;

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
  currentTempField.innerHTML = Math.round(weather.data.main.temp);
  locationField.innerHTML = `${weather.data.name},&nbsp;${weather.data.sys.country}`;
  conditionsField.innerHTML = weather.data.weather[0].description;
  humidityField.innerHTML = weather.data.main.humidity;
  windspeedField.innerHTML = Math.round(weather.data.wind.speed);
  currentTimeField.innerHTML = formatDate(weather.data.dt * 1000);
}
axios.get(baseUrl).then(displayWeather);
