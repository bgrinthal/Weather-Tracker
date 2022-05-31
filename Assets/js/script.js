// universal variables
var searchFormEl = document.querySelector('#search-form');
var currentWeather = document.querySelector('#current-weather');
var locationInfo = document.querySelector('#location');
var tempInfo = document.querySelector('#temp-info');
var windInfo = document.querySelector('#wind-info');
var humidityInfo = document.querySelector('#humidity-info');
var uviInfo = document.querySelector('#uvi-info');
var recentSearch = document.querySelector('#searches');
var searchInput = document.querySelector('#search-input')


var searchHistory = [];

var APIkey = "91d57b7fd6726c36fc275a86a5361130";


function handleSearchFormSubmit(event) {
    event.preventDefault();

    // grabs search input and stores in variable
    var searchInputVal = searchInput.value;

    searchHistory.push(searchInputVal);
    localStorage.setItem('City Name', JSON.stringify(searchHistory));

    // checks for valid search input
    if (!searchInputVal) {
        console.error('You need a search input value!');
        return;
    }

    var queryString = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInputVal + "&appid=" + APIkey + "&units=imperial"

    // first api fetch for current weather info
    fetch(queryString, {
        cache: 'reload',
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log(data.name);
            console.log(data.main.temp);
            console.log(data.wind.speed);
            console.log(data.main.humidity);
            console.log(data.coord.lat);
            console.log(data.coord.lon);

            // current weather variables navigated using the API
            var currentLat = data.coord.lat;
            var currentLon = data.coord.lon;
            var currentLocation = data.name;
            var currentTemp = data.main.temp;
            var currentWindSpeed = data.wind.speed;
            var currentHumidity = data.main.humidity;

            // current icon grab
            var nowIcon = data.weather[0].icon
            var img = document.createElement('img');
            img.src = "http://openweathermap.org/img/w/" + nowIcon + ".png";

            // displaying all current weather information
            locationInfo.textContent = currentLocation + "  ( " + moment().format("MM/DD/YYYY") + " )";
            tempInfo.textContent = "Temp: " + currentTemp + " F";
            windInfo.textContent = "Wind: " + currentWindSpeed + " mph";
            humidityInfo.textContent = "Humidity: " + currentHumidity + " %";
            document.getElementById('location').appendChild(img);

            var latlonString = "https://api.openweathermap.org/data/2.5/onecall?lat=" + currentLat + "&lon=" + currentLon + "&exclude=hourly&units=imperial&appid=" + APIkey;

            // second api fetch for daily weather info
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
                    console.log("https://openweathermap.org/img/w/" + data.daily[1].weather[0].icon + ".png");

                    // UV Index and serverity of condition to display text in red, orangem or green
                    var currentUVI = data.current.uvi;
                    uviInfo.textContent = "UV Index: " + currentUVI
                    if (currentUVI <= 2) {
                        uviInfo.style.color = "green";
                    } else if (currentUVI >= 8) {
                        uviInfo.style.color = "red";
                    } else {
                        uviInfo.style.color = "orange";
                    }
                    // set time for 5 day forecast
                    for (let i = 1; i < 6; i++) {
                        var dailyTime = document.getElementById("daily").children[i - 1].children[0];
                        dailyTime.textContent = moment().add(i, 'days').format("MM/DD/YYYY");
                    }

                    // storing 5 day weather info iteration
                    for (let i = 1; i < 6; i++) {

                        // all daily weather variables pulled from API
                        var dailyIconReset = document.getElementById("daily").children[i - 1].children[1];
                        var dailyTemp = document.getElementById("daily").children[i - 1].children[2];
                        var dailyWind = document.getElementById("daily").children[i - 1].children[3];
                        var dailyHumidity = document.getElementById('daily').children[i - 1].children[4];

                        // pull icon 
                        var dailyIcon = data.daily[i].weather[0].icon;
                        var img = document.createElement('img');
                        img.src = "http://openweathermap.org/img/w/" + dailyIcon + ".png";

                        console.log(daily);

                        // displaying 5 day weather info
                        dailyTemp.textContent = "Temp: " + data.daily[i].temp.day + " F";
                        dailyWind.textContent = "Wind: " + data.daily[i].wind_speed + " mph";
                        dailyHumidity.textContent = "Humidity: " + data.daily[i].humidity + " %";
                        dailyIconReset.textContent = " "
                        document.getElementById('icon-' + i).appendChild(img);
                    }
                })
        })
    history();
}

console.log(searchHistory);

// pulls local storage and adds recent searches below search bar
function history() {
    if (localStorage.getItem('City Name')) {
        searchHistory = localStorage.getItem("City Name", JSON.stringify(searchHistory));
        searchHistory = JSON.parse(searchHistory);
        console.log(searchHistory)
        for (i = 0; i <= searchHistory.length - 1; i++) {
            document.getElementById("search" + i).textContent = searchHistory[i]
        }
    }
}

// displays local storage on page refresh
document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem('City Name')) {
        searchHistory = localStorage.getItem("City Name", JSON.stringify(searchHistory));
        searchHistory = JSON.parse(searchHistory);
        console.log(searchHistory)
        for (i = 0; i <= searchHistory.length - 1; i++) {
            document.getElementById("search" + i).textContent = searchHistory[i]
        }
    }
});

// when history search button is clicked, puts value back in search and runs function again
function histBtn(clicked_id) {
    if (clicked_id === "search0") {
        document.getElementById("search-input").value = searchHistory[0];
    } else if (clicked_id === "search1") {
        document.getElementById("search-input").value = searchHistory[1];
    } else if (clicked_id === "search2") {
        document.getElementById("search-input").value = searchHistory[2];
    } else if (clicked_id === "search3") {
        document.getElementById("search-input").value = searchHistory[3];
    } else if (clicked_id === "search4") {
        document.getElementById("search-input").value = searchHistory[4];
    } else if (clicked_id === "search5") {
        document.getElementById("search-input").value = searchHistory[5];
    }
handleSearchFormSubmit(event);
}

// clears local storage and reloads page 
function clearStorage() {
    localStorage.clear();
    window.location.reload();
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);



