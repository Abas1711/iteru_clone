const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const WEATHER_API_KEY = '7c93a381c9bf4f6c876164839250505';

// خريطة المحافظات لأسماء المدن
const cityMap = {
  "Red Sea": "Hurghada",
  "South Sinai": "Sharm El Sheikh",
  "Kafr El-Sheikh": "Kafr El Sheikh",
  "Giza": "Giza",
  "Aswan": "Aswan",
  "Alexandria": "Alexandria",
  "Suez": "Suez",
  "Luxor": "Luxor",
  "Cairo": "Cairo",
  "Matrouh": "Marsa Matruh",
  "Dakahlia": "Mansoura",
  "Sharkia": "Zagazig",
  "Qena": "Qena",
  "Beni Suef": "Beni Suef",
  "Fayoum": "Fayoum",
  "Minya": "Minya",
  "Gharbia": "Tanta",
  "Kaliubia": "Banha",
  "Sohag": "Sohag",
  "Asyut": "Asyut",
  "Damietta": "Damietta",
  "Ismailia": "Ismailia",
  "Port Said": "Port Said",
  "North Sinai": "Arish",
  "New Valley": "Kharga",
  "Dahab": "Dahab",
  "Taba": "Taba"
};

// دالة retry للطقس
const fetchWeatherWithRetry = async (city, retries = 10, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await axios.get('https://api.weatherapi.com/v1/current.json', {
        params: {
          key: WEATHER_API_KEY,
          q: city
        }
      });

      if (res.data && res.data.current) {
        return res.data.current;
      }

      console.log(`⚠️ No data in response for ${city}, attempt ${i + 1}`);
    } catch (err) {
      console.log(`❌ Error on attempt ${i + 1} for ${city}:`, err.message);
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  return null;
};

router.get("/", async (req, res) => {
  const filePath = path.join(__dirname, "..", "data", "monumentsData.json");

  fs.readFile(filePath, "utf8", async (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error reading monuments data", error: err });
    }

    try {
      const monuments = JSON.parse(data);

      const monumentsWithWeather = await Promise.all(
        monuments.map(async (monument) => {
          const city = cityMap[monument.location] || monument.location;

          const weather = await fetchWeatherWithRetry(city);

          return {
            monument,
            weather: weather
              ? {
                  temp_c: weather.temp_c,
                  condition: weather.condition.text,
                  wind_kph: weather.wind_kph,
                  humidity: weather.humidity
                }
              : null
          };
        })
      );

      res.status(200).json({ data: monumentsWithWeather });
    } catch (parseError) {
      res.status(500).json({ success: false, message: "Error parsing JSON data", error: parseError });
    }
  });
});

module.exports = router;
