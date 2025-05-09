const express = require("express");
const axios = require("axios");
const router = express.Router();
const Museum = require("../models/Museum");

// مفتاح الـ API الخاص بـ WeatherAPI
const WEATHER_API_KEY = '7c93a381c9bf4f6c876164839250505';

// مسار API منفصل لجلب متحف مع الطقس بناءً على المدينة
router.get("/museum-weather/:id", async (req, res) => {
  const { id } = req.params; // استخراج الـ ID من الرابط

  try {
    // العثور على المتحف باستخدام الـ ID
    const museum = await Museum.findById(id);

    // إضافة لوج لعرض الـ ID الذي تم البحث عنه
    console.log("Searching for museum with ID:", id);

    if (!museum) {
      return res.status(404).json({ error: "Museum not found." });
    }

    // دالة لجلب الطقس من WeatherAPI
    const getWeather = async (city) => {
      try {
        const response = await axios.get('http://api.weatherapi.com/v1/current.json', {
          params: {
            key: WEATHER_API_KEY, // استخدام مفتاح الـ API للطعام
            q: city,
          }
        });
        return response.data;
      } catch (err) {
        console.error("Error fetching weather data:", err.message);
        return null;
      }
    };

    // الحصول على حالة الطقس للمدينة المرتبطة بالمتحف
    const weatherData = await getWeather(museum.location); // `location` هو المدينة المخزنة في المتحف

    if (weatherData) {
      res.status(200).json({
        museum: museum,
        weather: {
          description: weatherData.current.condition.text,
          temperature: weatherData.current.temp_c,
          city: weatherData.location.name
        }
      });
    } else {
      res.status(500).json({ error: "Error fetching weather data." });
    }

  } catch (err) {
    console.error("❌ Error fetching museum by weather:", err.message);
    res.status(500).json({
      error: "Error fetching museum by weather."
    });
  }
});


module.exports = router;
