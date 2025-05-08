const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// تعريف مسار الملف الذي يحتوي على البيانات
const filePath = path.join(__dirname, "../data/museumsData.json");

router.get("/", (req, res) => {
  // قراءة البيانات من الملف
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error reading file",
        error: err,
      });
    }

    try {
      // تحويل البيانات من JSON إلى كائن JavaScript
      const museums = JSON.parse(data);
      res.status(200).json({
        data: museums,
      });
    } catch (parseError) {
      res.status(500).json({
        success: false,
        message: "Error parsing JSON data",
        error: parseError,
      });
    }
  });
});

module.exports = router;
