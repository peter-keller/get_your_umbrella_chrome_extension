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
let cityResponse = JSON.parse(getCity.response)