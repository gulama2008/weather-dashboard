var currentWeather = document.querySelector('#current-weatehr');
var fiveDaysForecastWeather = document.querySelector('#five-days-forecast-weather');
var currentWeatherCity = document.querySelector('#current-weather-city');
var currentWeatherTemp = document.querySelector('#current-weather-temp');
var currentWeatherWind = document.querySelector('#current-weather-wind');
var currentWeatherHumidity = document.querySelector('#current-weather-humidity');
var lat;
var lon;


function render() { 
    fetch(
      "http://api.openweathermap.org/geo/1.0/direct?q=Sydney&limit=1&appid=d1b67a2c29e2519a2b26b7d05d8c9464"
    )
        .then(function (response) { 
            return response.json();
        })
        .then(function (data) { 
            lat = data[0].lat;
            lon = data[0].lon;
            var weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=d1b67a2c29e2519a2b26b7d05d8c9464'
            return weatherUrl;
        })
        .then(function (data) { 
            fetch(data)
                .then(function (response) { 
                    return response.json();
                })
                .then(function (data) { 
                    console.log(data);
                    var city = data.name;
                    var date = dayjs().format("DD/MM/YYYY");
                    var temp = data.main.temp;
                    console.log(temp);
                    var wind = data.wind.speed;
                    var humidity = data.main.humidity;
                    currentWeatherCard(city, date, temp, wind, humidity);
                })
        });
}

function currentWeatherCard(city, date, temp, wind, humidity) { 
    currentWeatherCity.textContent = city + ' (' + date + ')';
    currentWeatherTemp.textContent = 'Temp: ' + temp + "℉";
    currentWeatherWind.textContent = 'Wind: '+wind+' MPH';
    currentWeatherHumidity.textContent ='Humidity: '+ humidity+'%';
}

render();