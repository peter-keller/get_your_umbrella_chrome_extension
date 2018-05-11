'use strict';

const body = document.querySelector("body");
const buttons = document.getElementsByClassName("dayButton");


const ipStackKey = "5bbd3d01ffb7673da9dcd7dc22d800f3";
const accuWeatherKey = "9AI2zAYeN5HsQmwlLyHxvtS4RPTOK1Cb";


const coordinates = new XMLHttpRequest();
coordinates.open('GET', "http://api.ipstack.com/check?access_key=" + ipStackKey, false);
coordinates.send();
let ipStackResponse = JSON.parse(coordinates.response);

let locationCoordinates = ipStackResponse.latitude + "%2C" + ipStackResponse.longitude;


const getCity = new XMLHttpRequest();
getCity.open('GET', "http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=" + accuWeatherKey + "&q=" + locationCoordinates + "&details=true&toplevel=true", false);
getCity.send();
let cityResponse = JSON.parse(getCity.response);


const weather = new XMLHttpRequest();
weather.open("GET", "http://dataservice.accuweather.com/forecasts/v1/daily/5day/" + cityResponse.Key + "?apikey=" + accuWeatherKey + "&details=true&metric=true ", false);
weather.send(null);
let weatherResponse = JSON.parse(weather.response);


function dateRender () {
    weatherResponse.DailyForecasts.forEach(function(element) {
        let button = document.createElement("button");
        button.className = 'dayButton';
        body.appendChild(button);
        button.innerHTML = element.Date.split("-").join(",").split("T")[0].split(",")[2];
    });
};

dateRender();


for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function() {
        let paragraph = document.querySelector('p');
        paragraph.innerHTML = "Min: " + weatherResponse.DailyForecasts[i].Temperature.Minimum.Value + "°C " + " Max: " + weatherResponse.DailyForecasts[i].Temperature.Maximum.Value + "°C"
        const weatherTag = document.getElementById("icons");
        if (weatherResponse.DailyForecasts[i].Day.IconPhrase == "Mostly sunny") {
            weatherTag.className = "sunny";
        } else if (weatherResponse.DailyForecasts[i].Day.IconPhrase == "Intermittent clouds") {
            weatherTag.className = "cloudy";
        } else if (weatherResponse.DailyForecasts[i].Day.IconPhrase == "Partly sunny w/ showers") {
            weatherTag.className = "cloudy";
        } else if (weatherResponse.DailyForecasts[i].Day.IconPhrase == "Mostly cloudy w/ showers") {
            weatherTag.className = "cloudy";
        } else if (weatherResponse.DailyForecasts[i].Day.IconPhrase == "Showers") {
            weatherTag.className = "rainy";
        } else 
            console.log(weatherResponse.DailyForecasts[i].Day.IconPhrase)
        });

};
