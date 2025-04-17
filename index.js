require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db"); // لو عندك دالة اتصال خاصة وبتفضل استخدامها
const Museum = require("./models/Museum");
const museumsData = require("./data/museumsData.json");

const monumentRoutes = require("./routes/monumentRoutes");
const museumRoutes = require("./routes/museumRoutes");
const authRoutes = require("./routes/authRoutes");
const imageRoutes = require("./routes/imageRoutes");

const app = express();
app.use(express.json());

// ✅ الاتصال بقاعدة البيانات
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/yourDB";
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB...");
  seedDB(); // استدعاء دالة إدخال البيانات بعد الاتصال
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// ✅ دالة إدخال البيانات
async function seedDB(req, res) {
  try {
    await Museum.deleteMany(); // حذف البيانات القديمة
    const insertedMuseums = await Museum.insertMany(museumsData); // إدخال البيانات الجديدة
    console.log("✅ Museums data inserted successfully!", insertedMuseums);

    if (res) {
      return res.status(201).json({
        success: true,
        message: "Museums inserted successfully",
        data: insertedMuseums
      });
    }
  } catch (err) {
    console.error("❌ Error inserting museums data:", err);
    if (res) {
      return res.status(500).json({ success: false, message: "Error inserting data", error: err });
    }
  }
}

// ✅ إعداد المسارات
app.use("/api/monuments", monumentRoutes);
app.use("/api/museums", museumRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);

// ✅ نقطة البداية
app.get("/", (req, res) => res.json({ message: "API running" }));

// ✅ تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
