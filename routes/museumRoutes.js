const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Museum = require("../models/Museum");  // تأكد من أنك استوردت النموذج

// مسار الملف الذي يحتوي على بيانات المتاحف
const filePath = path.join(__dirname, "../data/museumsData.json");

router.get("/", async (req, res) => {
  try {
    // قراءة البيانات من الملف
    const rawData = fs.readFileSync(filePath, "utf8");
    const museums = JSON.parse(rawData);

    // إضافة _id لكل متحف باستخدام mongoose.Types.ObjectId()
    const museumsWithIds = museums.map(museum => ({
      ...museum,
      _id: new mongoose.Types.ObjectId(),  // توليد ObjectId بشكل صحيح
    }));

    // إدخال المتاحف إلى قاعدة البيانات
    await Museum.insertMany(museumsWithIds); 

    res.status(200).json({
      success: true,
      message: "Museums added successfully!",
      data: museumsWithIds,
    });
  } catch (error) {
    console.error("Error adding museums:", error);
    res.status(500).json({
      success: false,
      message: "Error adding museums to the database.",
      error: error.message,
    });
  }
});

module.exports = router;
