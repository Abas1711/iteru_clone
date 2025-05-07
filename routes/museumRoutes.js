const express = require("express");
const router = express.Router();
const Museum = require("../models/Museum");
const axios = require("axios");

const WEATHER_API_KEY = '7c93a381c9bf4f6c876164839250505'; // مفتاح API

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

const fetchWeatherWithRetry = async (city, retries = 10) => {
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
  }

  return null; // بعد كل المحاولات
};

router.get("/", async (req, res) => {
  try {
    const museums = await Museum.find();

    if (museums.length === 0) {
      return res.status(404).json({ success: false, message: "No museums found" });
    }

    const museumsWithWeather = await Promise.all(
      museums.map(async (museum) => {
        const city = cityMap[museum.location] || museum.location;

        const weather = await fetchWeatherWithRetry(city);

        if (!weather) {
          return { museum, weather: null };
        }

        return {
          museum,
          weather: {
            temp_c: weather.temp_c,
            condition: weather.condition.text,
            wind_kph: weather.wind_kph,
            humidity: weather.humidity
          }
        };
      })
    );

    res.status(200).json({ data: museumsWithWeather });

  } catch (err) {
    console.error("Error fetching museums:", err.message);
    res.status(500).json({ success: false, message: "Error fetching museums", error: err });
  }
});

module.exports = router;
