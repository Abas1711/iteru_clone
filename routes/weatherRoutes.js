const express = require("express");
const router = express.Router();
const axios = require("axios");
const Museum = require("../models/Museum");
const WEATHER_API_KEY = '7c93a381c9bf4f6c876164839250505';

// خريطة المحافظات للمدن
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

// جلب بيانات الطقس من API
const fetchWeather = async (city) => {
  try {
    const res = await axios.get('http://api.weatherapi.com/v1/current.json', {
      params: {
        key: WEATHER_API_KEY,
        q: city
      }
    });

    if (res.data && res.data.current) {
      return {
        temp_c: res.data.current.temp_c,
        condition: res.data.current.condition.text,
        wind_kph: res.data.current.wind_kph,
        humidity: res.data.current.humidity
      };
    }
    return null;
  } catch (err) {
    console.error(`Error fetching weather for ${city}:`, err.message);
    return null;
  }
};

// تنفيذ الطلبات على دفعات
const processInBatches = async (items, batchSize, handler) => {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(handler));
    results.push(...batchResults);
  }
  return results;
};

// دمج بيانات المتاحف مع الطقس
router.get("/museums-with-weather", async (req, res) => {
  try {
    const museums = await Museum.find();

    if (!museums.length) {
      return res.status(404).json({ success: false, message: "No museums found" });
    }

    const results = await processInBatches(museums, 5, async (museum) => {
      const governorate = museum.governorate || museum.city;
      const city = cityMap[governorate] || governorate || "Cairo";
      const weather = await fetchWeather(city);

      return {
        ...museum.toObject(),
        weather: weather || "No weather data"
      };
    });

    res.status(200).json({ success: true, data: results });
  } catch (err) {
    console.error("Error fetching museums with weather:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
