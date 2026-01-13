const wrapper = document.querySelector(".wrapper");
const inputPart = document.querySelector(".input-part");
const infoTxt = inputPart.querySelector(".info-txt");
const inputField = inputPart.querySelector("input");

const searchBtn = inputPart.querySelector(".search-btn");
const locationBtn = inputPart.querySelector(".location-btn");

const wIcon = wrapper.querySelector(".weather-part img");
const arrowBack = wrapper.querySelector("header i");

const tempNumb = wrapper.querySelector(".temp .numb");
const weatherDesc = wrapper.querySelector(".weather");
const locationName = wrapper.querySelector(".location span");
const feelsLikeNumb = wrapper.querySelector(".feels .numb-2");
const humidityVal = wrapper.querySelector(".humidity span");

let api;

// ✅ Put your own key here (don’t hardcode a real key in public repos)
const API_KEY = "PASTE_YOUR_API_KEY_HERE";

function setInfo(message, type) {
  infoTxt.innerText = message;
  infoTxt.classList.remove("error", "pending");
  if (type) infoTxt.classList.add(type);
}

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&units=metric&appid=${API_KEY}`;
  fetchData();
}

function requestApiByCoords(lat, lon) {
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  fetchData();
}

function fetchData() {
  setInfo("Getting weather details...", "pending");

  fetch(api)
    .then((res) => res.json())
    .then((result) => weatherDetails(result))
    .catch(() => setInfo("Something went wrong", "error"));
}

function weatherDetails(info) {
  // OpenWeather sometimes returns cod as number, sometimes string
  if (info.cod == 404) {
    setInfo(`${inputField.value} isn't a valid city name`, "error");
    return;
  }
  if (info.cod && info.cod != 200) {
    setInfo(info.message || "Could not fetch weather", "error");
    return;
  }

  const city = info.name;
  const country = info.sys.country;
  const { description, id } = info.weather[0];
  const { feels_like, humidity, temp } = info.main;

  // Local SVG icon mapping (your icons/ folder)
  if (id === 800) wIcon.src = "icons/clear.svg";
  else if (id >= 200 && id <= 232) wIcon.src = "icons/storm.svg";
  else if (id >= 600 && id <= 622) wIcon.src = "icons/snow.svg";
  else if (id >= 701 && id <= 781) wIcon.src = "icons/haze.svg";
  else if (id >= 801 && id <= 804) wIcon.src = "icons/cloud.svg";
  else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531))
    wIcon.src = "icons/rain.svg";

  tempNumb.innerText = Math.floor(temp);
  weatherDesc.innerText = description;
  locationName.innerText = `${city}, ${country}`;
  feelsLikeNumb.innerText = Math.floor(feels_like);
  humidityVal.innerText = `${humidity}%`;

  inputField.value = "";
  infoTxt.classList.remove("error", "pending");
  wrapper.classList.add("active");
}

// ✅ Enter key searches city
inputField.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && inputField.value.trim() !== "") {
    requestApi(inputField.value.trim());
  }
});

// ✅ Search button searches city
searchBtn.addEventListener("click", () => {
  const city = inputField.value.trim();
  if (!city) return setInfo("Please enter a city name", "error");
  requestApi(city);
});

// ✅ Location button uses geolocation
locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Your browser doesn't support Geolocation API");
    return;
  }

  setInfo("Getting your location...", "pending");

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      requestApiByCoords(latitude, longitude);
    },
    (err) => setInfo(err.message, "error"),
    { enableHighAccuracy: true, timeout: 10000 }
  );
});

// ✅ Back arrow returns to input view
arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
  infoTxt.classList.remove("error", "pending");
});
