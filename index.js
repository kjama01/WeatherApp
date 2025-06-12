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
    main: weatherData.weather[0].main,
    temperature: weatherData.main.temp,
    wind: weatherData.wind.speed,
    rain: weatherData.rain,
    description: weatherData.weather[0].description,
  };
}
function updateUI(object) {
  changeImage(object.main);

  let temp = document.getElementById("temperature");
  temp.textContent = object.temperature + "℃";

  let desc = document.getElementById("description");
  let fulldesc =
    object.description.charAt(0).toUpperCase() + object.description.slice(1);
  desc.textContent = fulldesc;

  let city = document.getElementById("city");
  city.textContent = object.name;

  let rain = document.getElementById("rain");
  let finalrain = object.rain == undefined ? 0 : object.rain["1h"];
  rain.textContent = finalrain + " %";

  let wind = document.getElementById("wind");
  let finalwind = object.wind * 3.6;
  wind.textContent = finalwind.toFixed(1) + " km/h";
}
function changeImage(value) {
  const weatherTab = {
    Rain: {
      src: "/icons/rain.png",
      color: "linear-gradient(135deg, #4A5568, #2D3748, #1A202C",
    },
    Clear: {
      src: "/icons/clear.png",
      color: "linear-gradient(135deg, #87CEEB, #FFFFFF)",
    },
    Snow: {
      src: "/icons/snow.png",
      color: "linear-gradient(135deg, #E0F7FA, #FFFFFF, #B0E0E6)",
    },
    Clouds: {
      src: "/icons/cloud.png",
      color: "linear-gradient(135deg, #DEC2C5, #D8D8D8, #F0F0F0)",
    },
    Thuderstorm: {
      src: "/icons/thunder.png",
      color: "linear-gradient(135deg, #1E2A40, #3A506B, #788AA3)",
    },
  };
  let weatherimg = document.getElementById("weatherimg");
  let main = document.getElementById("main");
  if (weatherTab[value]) {
    weatherimg.src = weatherTab[value].src;
    main.style.background = weatherTab[value].color;
  }
}

getWeather("New York");
