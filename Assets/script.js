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

renderSearchHistory();

function render() {   
    searchHistory();
    var locationUrl = getLocationUrl(inputCity.val());
    weather(locationUrl);
}

var getLocationUrl = (input) => { return "http://api.openweathermap.org/geo/1.0/direct?q=" + input + "&limit=1&appid=d1b67a2c29e2519a2b26b7d05d8c9464"; }

function currentWeatherRender(city, date, icon, temp, wind, humidity) { 
    var iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";
    currentWeatherIcon.setAttribute("src", iconUrl);  
    currentWeatherCity.textContent = city + ' (' + date + ')'+' ';
    currentWeatherTemp.textContent = "Temp: " +temp + "℃";
    currentWeatherWind.textContent = 'Wind: '+wind+' MPH';
    currentWeatherHumidity.textContent ='Humidity: '+ humidity+'%';
}

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

function saveToLocalStorage(input) { 
    cityArray.push(input);
    localStorage.setItem("cityArray", JSON.stringify(cityArray));
    console.log(333);
}

function renderSearchHistory() {
    cityArray = JSON.parse(localStorage.getItem("cityArray"));
    if (cityArray) {
        console.log(111);
        for (var i = 0; i < cityArray.length; i++) {
            createSearchResultBtn(cityArray[i]);
        }
    } 
}

function createSearchResultBtn(input) { 
    console.log(666);
    var cityBtnContainer = document.createElement("div");
    cityBtnContainer.classList.add("d-grid", "col-12", "mx-auto");
    var cityBtn = document.createElement("button");
    cityBtn.classList.add("btn", "btn-secondary","city-button");
    cityBtn.setAttribute("type", "button");
    cityBtn.textContent = input;
    searchList.appendChild(cityBtnContainer);
    cityBtnContainer.appendChild(cityBtn);
}

function searchHistory() { 
    cityArray = JSON.parse(localStorage.getItem("cityArray"));
    input = inputCity.val();
    var isDuplicate = false;
    if (cityArray == null) {
      cityArray = [];
      saveToLocalStorage(input);
      createSearchResultBtn(input);
    } else {
      console.log(789);
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
            console.log(data);
            var city = data.name;
            var date = currentDate;
            var icon = data.weather[0].icon;
            var temp = data.main.temp;
            console.log(temp);
            var wind = data.wind.speed;
            var humidity = data.main.humidity;
            currentWeatherRender(city, date, icon, temp, wind, humidity);
          });
        fetch(data[1])
          .then(function (response) {
            console.log(111);
            return response.json();
          })
          .then(function (data) {
            console.log(data);
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

function weatherBySearchHistory() { 
    var cityBtnList = document.querySelectorAll('.city-button');
    for (i = 0; i < cityBtnList.length;i++) { 
    }
}

btn.addEventListener("click", render);
searchList.addEventListener('click', function (event) { 
    input = event.target.textContent;
    inputCity.val(input);
    var locationUrl = getLocationUrl(input);
    weather(locationUrl);
})