var currentWeather = document.querySelector('#current-weather');
var fiveDaysForecastWeather = document.querySelector('#five-days-forecast-weather');
var currentWeatherCity = document.querySelector('#current-weather-city');
var currentWeatherIcon=document.querySelector('#current-weather-icon')
var currentWeatherTemp = document.querySelector('#current-weather-temp');
var currentWeatherWind = document.querySelector('#current-weather-wind');
var currentWeatherHumidity = document.querySelector('#current-weather-humidity');
var forecastWeather = document.querySelectorAll('.forecast-weather-card')
var currentDate = dayjs().format("DD/MM/YYYY");;
var inputCity = $('#input-city');
var btn = document.querySelector('#search-button');
var searchList = document.querySelector('#search-list');
var cityArray;
var lat;
var lon;
var input;

//get search history cities from local storage and show with buttons when loading the page
function renderSearchHistory() {
  cityArray = JSON.parse(localStorage.getItem("cityArray"));
  if (cityArray) {
    for (var i = 0; i < cityArray.length; i++) {
      createSearchResultBtn(cityArray[i]);
    }
  }
}

//create html buttons for search history
function createSearchResultBtn(input) {
  var cityBtnContainer = document.createElement("div");
  cityBtnContainer.classList.add("d-grid", "col-12", "mx-auto");
  var cityBtn = document.createElement("button");
  cityBtn.classList.add("btn", "btn-secondary", "city-button");
  cityBtn.setAttribute("type", "button");
  cityBtn.textContent = input;
  searchList.appendChild(cityBtnContainer);
  cityBtnContainer.appendChild(cityBtn);
}

//function of rendering the page when clicking the search button by showing current and forecast weather and add search history
function render() {  
    input = inputCity.val();
    if (!input) {
        window.alert("City name can't be empty");
    } else { 
        addSearchHistory();
        var locationUrl = getLocationUrl(input);
        weather(locationUrl);
    } 
}

//add search history into local storage and add button on the page if it is not duplicate
function addSearchHistory() { 
    cityArray = JSON.parse(localStorage.getItem("cityArray"));
    input = inputCity.val();
    var isDuplicate = false;
    if (cityArray == null) {
      cityArray = [];
      saveToLocalStorage(input);
      createSearchResultBtn(input);
    } else {
      for (var i = 0; i < cityArray.length; i++) {
        if (cityArray[i] == input) {
          isDuplicate = true;
        }
      }
      if (!isDuplicate) {
        saveToLocalStorage(input);
        createSearchResultBtn(input);
      }
    }
}

//save search history into local storage
function saveToLocalStorage(input) { 
    cityArray.push(input);
    localStorage.setItem("cityArray", JSON.stringify(cityArray));
}

//create the location url with input city name for using the geocoding api
var getLocationUrl = (input) => { return "http://api.openweathermap.org/geo/1.0/direct?q=" + input + "&limit=1&appid=d1b67a2c29e2519a2b26b7d05d8c9464"; }

//get current and forecast weather information from weather api
function weather(locationUrl) { 
    fetch(locationUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var url = [];
        lat = data[0].lat;
        lon = data[0].lon;
        var currentWeatherUrl ="https://api.openweathermap.org/data/2.5/weather?lat=" +lat +"&lon=" + lon +"&appid=d1b67a2c29e2519a2b26b7d05d8c9464&units=metric";
        var forecastWeatherUrl ="https://api.openweathermap.org/data/2.5/forecast?lat=" +lat +"&lon=" +lon +"&appid=d1b67a2c29e2519a2b26b7d05d8c9464&units=metric";
        url.push(currentWeatherUrl);
        url.push(forecastWeatherUrl);
        return url;
      })
      .then(function (data) {
        fetch(data[0])
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            var city = data.name;
            var date = currentDate;
            var icon = data.weather[0].icon;
            var temp = data.main.temp;
            var wind = data.wind.speed;
            var humidity = data.main.humidity;
            currentWeatherRender(city, date, icon, temp, wind, humidity);
          });
        fetch(data[1])
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            fiveDaysForecastWeather.style.visibility = "visible";
            for (var i = 0; i < 5; i++) {
              var icon = data.list[8 * i].weather[0].icon;
              var temp = data.list[8 * i].main.temp;
              var wind = data.list[8 * i].wind.speed;
              var humidity = data.list[8 * i].main.humidity;
              forecastWeatherRender(icon, temp, wind, humidity, i);
            }
          });
      });
}

//generate html tags to show current weather information
function currentWeatherRender(city, date, icon, temp, wind, humidity) { 
    var iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";
    currentWeatherIcon.setAttribute("src", iconUrl);  
    currentWeatherCity.textContent = city + ' (' + date + ')'+' ';
    currentWeatherTemp.textContent = "Temp: " +temp + "℃";
    currentWeatherWind.textContent = 'Wind: '+wind+' MPH';
    currentWeatherHumidity.textContent ='Humidity: '+ humidity+'%';
}

//generate html tags to show 5 days forecast weather information
function forecastWeatherRender(icon, temp, wind, humidity, i) {
    forecastWeather[i].innerHTML = "";
    var dateEl = document.createElement("h6");
    dateEl.setAttribute("class", "forecast-weather-date");
    dateEl.textContent = dayjs().add(i + 1, "day").format("DD/MM/YYYY");
    forecastWeather[i].appendChild(dateEl);
    var iconEl = document.createElement("img");
    var iconUrl ="http://openweathermap.org/img/w/" +icon +".png";
    iconEl.setAttribute("src", iconUrl);
    iconEl.classList.add("forecast-weather-icon", "forecastInfo");
    forecastWeather[i].appendChild(iconEl);
    var tempEl = document.createElement("p");
    tempEl.classList.add("forecast-weather-temp", "forecastInfo");
    tempEl.textContent = "Temp: " + temp + " ℃";
    forecastWeather[i].appendChild(tempEl);
    var windEl = document.createElement("p");
    windEl.classList.add("forecast-weather-wind", "forecastInfo");
    windEl.textContent = "Wind: " + wind + " MPH";
    forecastWeather[i].appendChild(windEl);
    var humidityEl = document.createElement("p");
    humidityEl.classList.add("forecast-weather-humidity", "forecastInfo");
    humidityEl.textContent = "Humidity: " + humidity + "%";
    forecastWeather[i].appendChild(humidityEl);
}


renderSearchHistory();
btn.addEventListener("click", render);
searchList.addEventListener('click', function (event) { 
    input = event.target.textContent;
    inputCity.val(input);
    var locationUrl = getLocationUrl(input);
    weather(locationUrl);
})