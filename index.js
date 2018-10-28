const body = document.querySelector("body");
const buttons = document.getElementsByClassName("dayButton");
const header = document.getElementById("header");

const ipStackKey = "5bbd3d01ffb7673da9dcd7dc22d800f3";
const accuWeatherKey = "9AI2zAYeN5HsQmwlLyHxvtS4RPTOK1Cb";

const coordinates = new XMLHttpRequest();
coordinates.open(
  "GET",
  "http://api.ipstack.com/check?access_key=" + ipStackKey,
  false
);
coordinates.send();
let ipStackResponse = JSON.parse(coordinates.response);

let locationCoordinates = `${ipStackResponse.latitude}%2C${
  ipStackResponse.longitude
}`;
var cityResponse;
fetch(
  `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=
    ${accuWeatherKey}
    &q=
    ${locationCoordinates}
    &details=true&toplevel=true`
).then(function(response) {
  Promise.resolve(response.json()).then(result => {
    cityResponse = result;
  });
});

console.log(cityResponse);

const weather = new XMLHttpRequest();
weather.open(
  "GET",
  "http://dataservice.accuweather.com/forecasts/v1/daily/5day/" +
    cityResponse.Key +
    "?apikey=" +
    accuWeatherKey +
    "&details=true&metric=true ",
  false
);
weather.send(null);
let weatherResponse = JSON.parse(weather.response);

const numberToMonth = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  "10": "October",
  "11": "November",
  "12": "December"
};

function dateRender() {
  weatherResponse.DailyForecasts.forEach(function(element) {
    let button = document.createElement("button");
    button.className = "dayButton";
    header.appendChild(button);
    button.innerHTML =
      element.Date.split("-")
        .join(",")
        .split("T")[0]
        .split(",")[2] +
      " " +
      numberToMonth[
        element.Date.split("-")
          .join(",")
          .split("T")[0]
          .split(",")[1]
      ];
  });
}

dateRender();

function createTempIcon(minimum, maximum) {
  let paragraph = document.getElementById("temperature");
  let tempIcon = document.createElement("img");
  tempIcon.setAttribute("src", "images/thermometer.png");
  paragraph.innerHTML = "Min: " + minimum + "°C " + " Max: " + maximum + "°C";
  paragraph.appendChild(tempIcon);
}

function createRainIcon(value, probability) {
  let rainParagraph = document.getElementById("rain");
  let rainIcon = document.createElement("img");
  rainIcon.setAttribute("src", "images/rain.png");
  rainParagraph.innerHTML =
    "Value: " + value + " mm   Probability: " + probability + "%";
  rainParagraph.appendChild(rainIcon);
}

function createWindIcon(speed, direction) {
  let windParagraph = document.getElementById("wind");
  let windIcon = document.createElement("img");
  windIcon.setAttribute("src", "images/wind.png");
  windParagraph.innerHTML =
    "Speed: " + speed + " km/h   Direction: " + direction;
  windParagraph.appendChild(windIcon);
}

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function() {
    createTempIcon(
      weatherResponse.DailyForecasts[i].Temperature.Minimum.Value,
      weatherResponse.DailyForecasts[i].Temperature.Maximum.Value
    );
    createRainIcon(
      weatherResponse.DailyForecasts[i].Day.Rain.Value,
      weatherResponse.DailyForecasts[i].Day.RainProbability
    );
    createWindIcon(
      weatherResponse.DailyForecasts[i].Day.Wind.Speed.Value,
      weatherResponse.DailyForecasts[i].Day.Wind.Direction.English
    );
    iconSorter(weatherResponse.DailyForecasts[i].Day.IconPhrase);
  });

  function iconSorter(weather) {
    const weatherTag = document.getElementById("icons");
    if (weather == "Mostly sunny") {
      weatherTag.className = "sunny";
    } else if (
      weather == "Intermittent clouds" ||
      "Partly sunny w/ showers" ||
      "Mostly cloudy w/ showers" ||
      "Mostly cloudy"
    ) {
      weatherTag.className = "cloudy";
      console.log(weather);
    } else if (weather == "Showers") {
      weatherTag.className = "rainy";
    } else console.log(weather);
  }
}
