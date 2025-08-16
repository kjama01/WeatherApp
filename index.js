let inputData = document.getElementById("inputData");
inputData.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const inputVal = inputData.value;
    inputData.value = "";
    getWeather(inputVal);
    if (inputData.validity.valueMissing) {
      console.log("Value cant be missing");
    }
  }
});

async function getWeather(inputVal) {
  try {
    const weatherCoordinates = await fetch(
      `https://geocode.maps.co/search?q=${inputVal}&api_key=6744db971cc45176177078ebk9f90b4`
    );
    const weatherCoordinatesData = await weatherCoordinates.json();
    const weather = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${weatherCoordinatesData[0].lat}&lon=${weatherCoordinatesData[0].lon}&appid=559648589076d5230604aa1570499d9e&units=metric`
    );
    const weatherData = await weather.json();
    console.log(weatherData);
    updateUI(createWeatherObject(weatherData));
  } catch (error) {
    console.log(error);
  }
}
function createWeatherObject(weatherData) {
  return {
    name: weatherData.name,
    timeZone: weatherData.timezone,
    timeStamp: weatherData.dt,
    main: weatherData.weather[0].main,
    temperature: weatherData.main.temp,
    country: weatherData.sys.country,
    description: weatherData.weather[0].description,
    feels: weatherData.main.feels_like,
    pressure: weatherData.main.pressure,
    wind: weatherData.wind.speed,
    rain: weatherData.rain,
    sunset: weatherData.sys.sunset,
    sunrise: weatherData.sys.sunrise,
    clouds: weatherData.clouds.all,
    humidity: weatherData.main.humidity,
  };
}

const slider = document.getElementById("slider");
let symbol = 0;
let rawTemperature = null;
let rawFeels = null;
slider.addEventListener("click", () => {
  symbol = +!symbol;

  const tempResult = changeDegree(rawTemperature, symbol);
  temperature = tempResult.temp;
  degree = tempResult.degree;

  const feelsResult = changeDegree(rawFeels, symbol);
  feels = feelsResult.temp;

  document.getElementById("temperature").textContent = `${temperature.toFixed(
    1
  )}${degree}`;
  document.getElementById("feels").textContent = `Feels like: ${feels.toFixed(
    1
  )}${degree}`;

  for (let node of slider.children) {
    node.classList.toggle("active");
  }
});

function updateUI(object) {
  changeImage(object.main);

  const timestamp = object.timeStamp;
  const offset = object.timeZone;

  const time = formatTime(timestamp, offset);
  const localDate = new Date((timestamp + offset) * 1000);
  const day = "Today";
  const month = localDate.toLocaleString("en-US", { month: "short" });
  const date = localDate.getDate();

  const countryCode = object.country;
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  const countryName = regionNames.of(countryCode);
  const flag = `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;

  document.getElementById("flag").src = flag;
  document.getElementById("country").textContent = countryName;
  document.getElementById("city").textContent = object.name;
  document.getElementById("hour").textContent = `Last updated: ${time}`;
  document.getElementById("date").textContent = `${day}, ${month} ${date}`;
  document.getElementById(
    "humidity"
  ).textContent = `Humidity: ${object.humidity}%`;

  const fulldesc =
    object.description.charAt(0).toUpperCase() + object.description.slice(1);
  document.getElementById("description").textContent = fulldesc;

  rawTemperature = object.temperature;
  rawFeels = object.feels;

  const result = changeDegree(rawTemperature, symbol);
  temperature = result.temp;
  degree = result.degree;

  const feelsResult = changeDegree(rawFeels, symbol);
  feels = feelsResult.temp;

  document.getElementById("temperature").textContent = `${temperature.toFixed(
    1
  )}${degree}`;
  document.getElementById("feels").textContent = `Feels like: ${feels.toFixed(
    1
  )}${degree}`;
  document.getElementById(
    "pressure"
  ).textContent = `Pressure: ${object.pressure}hPa`;

  const finalWind = (object.wind * 3.6).toFixed(1);
  document.getElementById("wind").textContent = `Wind: ${finalWind} km/h`;

  const clouds = object.clouds ?? 0;
  document.getElementById("clouds").textContent = `Clouds: ${clouds}%`;

  const finalRain = object.rain?.["1h"] ?? 0;
  document.getElementById("rain").textContent = `Rain: ${finalRain}mm`;

  const sunriseStr = formatTime(object.sunrise, offset);
  const sunsetStr = formatTime(object.sunset, offset);

  document.getElementById("sunrise").textContent = `Sunrise: ${sunriseStr}`;
  document.getElementById("sunset").textContent = `Sunset: ${sunsetStr}`;
}

function changeDegree(temperature, symbol) {
  return {
    temp: symbol === 1 ? (temperature * 9) / 5 + 32 : temperature,
    degree: symbol === 1 ? "°F" : "°C",
  };
}

function formatTime(timestamp, timezoneOffset) {
  const localTime = new Date((timestamp + timezoneOffset) * 1000);
  return localTime.toLocaleTimeString("en-US", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
function changeImage(value) {
  const weatherTab = {
    Rain: {
      iconClass: "weather-rain",
      background: "icons/rain-body.jpg",
      gradient:
        "linear-gradient(135deg, #4a4e69,rgb(64, 66, 90),rgb(71, 75, 104))",
    },
    Clear: {
      iconClass: "weather-clear",
      background: "icons/clear-body.jpg",
      gradient: "linear-gradient(135deg, #56ccf2, #2f80ed)",
    },
    Snow: {
      iconClass: "weather-snow",
      background: "icons/snow-body.jpg",
      gradient: "linear-gradient(135deg, #e0f7fa, #ffffff, #b0e0e6)",
    },
    Clouds: {
      iconClass: "weather-clouds",
      background: "icons/cloud-body.jpg",
      gradient: "linear-gradient(135deg, #bdc3c7, #dfe6e9)",
    },
    Thunderstorm: {
      iconClass: "weather-thunder",
      background: "icons/thunder-body.jpg",
      gradient: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    },
  };
  let weatherimg = document.getElementById("weatherimg");
  if (weatherTab[value]) {
    weatherimg.className = "";
    weatherimg.classList.add(`${weatherTab[value].iconClass}`);
    document.getElementById(
      "main"
    ).style.background = `url('${weatherTab[value].background}') center/cover no-repeat`;
    document.getElementById("all").style.background =
      weatherTab[value].gradient;
  }
}

getWeather("New York");
