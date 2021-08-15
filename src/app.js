let apiKey = "2af1ff2de81cdd8d67552da7d4b4331d";

let baseUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&q=Sydney,AU&units=metric`;

function displayWeather(weather) {
  let currentTempField = document.querySelector("#current-temperature");
  currentTempField.innerHTML = Math.round(weather.data.main.temp);
  let locationField = document.querySelector("#location");
  locationField.innerHTML = `${weather.data.name},&nbsp;${weather.data.sys.country}`;
  let conditionsField = document.querySelector("#conditions");
  conditionsField.innerHTML = weather.data.weather[0].description;
  let humidityField = document.querySelector("#humidity");
  humidityField.innerHTML = weather.data.main.humidity;
  let windspeedField = document.querySelector("#windspeed");
  windspeedField.innerHTML = Math.round(weather.data.wind.speed);
}
axios.get(baseUrl).then(displayWeather);
