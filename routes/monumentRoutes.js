const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Monument = require("../models/Monument"); // تأكد من استيراد النموذج بشكل صحيح

router.get("/", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "..", "data", "monumentsData.json");

    // قراءة البيانات من الملف
    const rawData = fs.readFileSync(filePath, "utf8");
    const monuments = JSON.parse(rawData);

    // إضافة _id لكل عنصر باستخدام mongoose.Types.ObjectId
    const monumentsWithIds = monuments.map((monument) => ({
      ...monument,
      _id: new mongoose.Types.ObjectId(), // توليد ObjectId باستخدام Mongoose
    }));

    // إدخال البيانات إلى قاعدة البيانات
    await Monument.insertMany(monumentsWithIds); // إدخال البيانات إلى MongoDB

    res.status(200).json({
      success: true,
      message: "Monuments added successfully!",
      data: monumentsWithIds,
    });
  } catch (error) {
    console.error("Error adding monuments:", error);
    res.status(500).json({
      success: false,
      message: "Error adding monuments to the database.",
      error: error.message,
    });
  }
});

module.exports = router;
