function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];

  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${day.toUpperCase()} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        ` 
             <div class="col-sm">
              <div class="card days">
                <div class="card-body">
                  <h6 class="card-title"><div class="weather-forecast-date">${formatDay(
                    forecastDay.dt
                  )}</div></h6>
                  <img src="http://openweathermap.org/img/wn/${
                    forecastDay.weather[0].icon
                  }@2x.png" alt="" width="42" />
                   <div class="weather-forecast-temperatures"><span class="card-text temperature max-temp">${Math.round(
                     forecastDay.temp.max
                   )}°C</span>
                  <span class="card-text temperature">${Math.round(
                    forecastDay.temp.min
                  )}°C</span></div>
                </div>
              </div>
            </div>
            
            `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;

  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);

  let apiKey = "bd915d97f51d3c0651893d85326bd29d";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

function showWeather(response) {
  console.log(response);
  let temperatureElement = document.querySelector("#temp");
  let descriptionElement = document.querySelector("#description");
  let cityElement = document.querySelector("#city");
  let humidityElement = document.querySelector("#humidity");
  let feelElement = document.querySelector("#feels-like");
  let windElement = document.querySelector("#wind");
  let iconElement = document.querySelector("#icon");
  let background = document.querySelector("#weather-app");

  let iconElementAttribute = response.data.weather[0].icon;

  celsiusTemperature = response.data.main.temp;
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  descriptionElement.innerHTML =
    response.data.weather[0].description.toUpperCase();
  cityElement.innerHTML = response.data.name.toUpperCase();
  humidityElement.innerHTML = response.data.main.humidity;
  feelElement.innerHTML = Math.round(response.data.main.feels_like);
  windElement.innerHTML = Math.round(response.data.wind.speed);

  document.querySelector("#temp").innerHTML = Math.round(
    response.data.main.temp
  );

  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${iconElementAttribute}@2x.png`
  );

  getForecast(response.data.coord);

  if (iconElementAttribute === "02d") {
    background.classList.add("clouds");
  } else if (iconElementAttribute === "11d") {
    background.classList.ass("thunderstorm");
  }
}

function searchCity(city) {
  let apiKey = "bd915d97f51d3c0651893d85326bd29d";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showWeather);
}

function showCity(event) {
  event.preventDefault();
  let city = document.querySelector("#search-type-form").value;

  searchCity(city);
}

function searchLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "bd915d97f51d3c0651893d85326bd29d";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showWeather);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

searchCity("Amsterdam");

let dateElement = document.querySelector("#time");
let now = new Date();
dateElement.innerHTML = formatDate(now);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", showCity);

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentPosition);
