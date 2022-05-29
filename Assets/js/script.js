var searchFormEl = document.querySelector('#search-form');
var currentWeather = document.querySelector('#current-weather');
var locationInfo = document.querySelector('#location');
var tempInfo = document.querySelector('#temp-info');
var windInfo = document.querySelector('#wind-info');
var humidityInfo = document.querySelector('#humidity-info');



var APIkey = "91d57b7fd6726c36fc275a86a5361130";


function handleSearchFormSubmit(event) {
    event.preventDefault();

    var searchInputVal = document.querySelector('#search-input').value;
    //   var formatInputVal = document.querySelector('#format-input').value;

    if (!searchInputVal) {
        console.error('You need a search input value!');
        return;
    }

    var queryString = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInputVal + "&appid=" + APIkey + "&units=imperial"

    fetch(queryString, {
        cache: 'reload',
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log(data.name);
            // let $currentIcon = response.weather[0].icon;
            // let $currentIconURL = "http://openweathermap.org/img/w/" + $currentIcon + ".png";  //use for icons
            console.log(data.main.temp);
            console.log(data.wind.speed);
            console.log(data.main.humidity);
            console.log(data.coord.lat);
            console.log(data.coord.lon);

            var currentLat = data.coord.lat;
            var currentLon = data.coord.lon;
            var currentLocation = data.name;
            var currentTemp = data.main.temp;
            var currentWindSpeed = data.wind.speed;
            var currentHumidity = data.main.humidity;

            locationInfo.textContent = currentLocation + "  ( " + moment().format("MM/DD/YYYY") + " )";
            tempInfo.textContent = "Temp: " + currentTemp + " F";
            windInfo.textContent = "Wind: " + currentWindSpeed + " mph";
            humidityInfo.textContent = "Humidity: " + currentHumidity + " %";

            var latlonString = "https://api.openweathermap.org/data/2.5/onecall?lat=" + currentLat + "&lon=" + currentLon +"&exclude=hourly&units=imperial&appid=" + APIkey;

            fetch(latlonString, {
                cache: 'reload',
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                    console.log(data.daily[1].temp.day);
                    console.log(data.daily[1].wind_speed);
                    console.log(data.daily[1].humidity);

                    for (let i = 1; i < 6; i++) {

                        var dailyTemp = document.getElementById("daily").children[i-1].children[2];
                        var dailyWind = document.getElementById("daily").children[i-1].children[3];
                        var dailyHumidity = document.getElementById("daily").children[i-1].children[4];
                        console.log(daily);
                        dailyTemp.textContent = "Temp: " + data.daily[i].temp.day + " F";
                        dailyWind.textContent = "Wind: " + data.daily[i].wind_speed + " mph";
                        dailyHumidity.textContent = "Humidity: " + data.daily[i].humidity + " %";
                        // var daily = document.getElementById("daily").children[0].children[2];
                        // console.log(daily)
                        // daily.textContent = "Temp: " + data.daily[1].temp.day + " F";
                    }
                    

        
                })


        });

}



searchFormEl.addEventListener('submit', handleSearchFormSubmit);

