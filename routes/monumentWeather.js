const express = require("express");
const axios = require("axios");
const router = express.Router();
const Monument = require("../models/Monument"); // تأكد من أن النموذج `Monument` معرف بشكل صحيح

// مفتاح الـ API الخاص بـ WeatherAPI
const WEATHER_API_KEY = '7c93a381c9bf4f6c876164839250505';

// مسار API منفصل لجلب أثر مع الطقس بناءً على المدينة
router.get("/monument-weather/:id", async (req, res) => {
  const { id } = req.params; // استخراج الـ ID من الرابط

  try {
    // العثور على الأثر باستخدام الـ ID
    const monument = await Monument.findById(id);

    // إضافة لوج لعرض الـ ID الذي تم البحث عنه
    console.log("Searching for monument with ID:", id);

    if (!monument) {
      return res.status(404).json({ error: "Monument not found." });
    }

    // دالة لجلب الطقس من WeatherAPI
    const getWeather = async (city) => {
      try {
        const response = await axios.get('http://api.weatherapi.com/v1/current.json', {
          params: {
            key: WEATHER_API_KEY, // استخدام مفتاح الـ API للطقس
            q: city,
          }
        });
        return response.data;
      } catch (err) {
        console.error("Error fetching weather data:", err.message);
        return null;
      }
    };

    // الحصول على حالة الطقس للمدينة المرتبطة بالأثر
    const weatherData = await getWeather(monument.location); // `location` هو المدينة المخزنة في الأثر

    if (weatherData) {
      res.status(200).json({
        monument: monument,
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
    console.error("❌ Error fetching monument by weather:", err.message);
    res.status(500).json({
      error: "Error fetching monument by weather."
    });
  }
});

module.exports = router;
