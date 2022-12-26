var currentWeather = document.querySelector('#current-weather');
var fiveDaysForecastWeather = document.querySelector('#five-days-forecast-weather');
var currentWeatherCity = document.querySelector('#current-weather-city');
var currentWeatherTemp = document.querySelector('#current-weather-temp');
var currentWeatherWind = document.querySelector('#current-weather-wind');
var currentWeatherHumidity = document.querySelector('#current-weather-humidity');
var forecastWeather = document.querySelectorAll('.forecast-weather-card')
var currentDate = dayjs().format("DD/MM/YYYY");;
var inputCity = $('#input-city');
var btn = document.querySelector('#search-button');
var lat;
var lon;

function render() {    
    fetch(
      getLocationUrl()
    )
        .then(function (response) { 
            return response.json();
        })
        .then(function (data) { 
            var url = [];
            lat = data[0].lat;
            lon = data[0].lon;
            var currentWeatherUrl ="https://api.openweathermap.org/data/2.5/weather?lat=" +lat +"&lon=" +lon +"&appid=d1b67a2c29e2519a2b26b7d05d8c9464&units=metric";
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
                })
            fetch(data[1])
                .then(function (response) {
                    console.log(111);
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                    fiveDaysForecastWeather.style.visibility = 'visible';
                    for (var i = 0; i < 5; i++) {
                        var icon = data.list[8 * i].weather[0].icon;
                        var temp = data.list[8 * i].main.temp;
                        var wind = data.list[8 * i].wind.speed;
                        var humidity = data.list[8 * i].main.humidity;
                        forecastWeatherRender(icon, temp, wind, humidity,i);
                    }    
                });
        })
}

var getLocationUrl=() => "http://api.openweathermap.org/geo/1.0/direct?q=" + inputCity.val() + "&limit=1&appid=d1b67a2c29e2519a2b26b7d05d8c9464";

function currentWeatherRender(city, date, icon, temp, wind, humidity) { 
    var currentWeatherIcon = document.createElement('img');
    var iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";
    currentWeatherIcon.setAttribute("src", iconUrl);
    currentWeather.appendChild(currentWeatherIcon);
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

btn.addEventListener("click", render);