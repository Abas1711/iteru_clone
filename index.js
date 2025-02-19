require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

// إنشاء التطبيق
const app = express();
app.use(express.json());

// الاتصال بقاعدة البيانات
connectDB();

// تعريف الراوتات
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/museums", require("./routes/museumRoutes"));
app.use("/api/images", require("./routes/imageRoutes"));

// تشغيل السيرفر
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});

// التأكد من أن المتغير `MONGO_URI` محمّل بشكل صحيح
console.log("🔍 MONGO_URI:", process.env.MONGO_URI);
