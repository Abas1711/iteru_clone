require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");

const connectDB = require("./config/db"); // لو عندك ملف خاص
const Museum = require("./models/Museum");
const museumsData = require("./data/museumsData.json");
const Message = require("./models/Message"); // موديل الرسائل
const authenticate = require("./middlewares/authMiddleware"); // ميدل وير JWT

// المسارات
const monumentRoutes = require("./routes/monumentRoutes");
const museumRoutes = require("./routes/museumRoutes");
const authRoutes = require("./routes/authRoutes");
const imageRoutes = require("./routes/imageRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ اتصال قاعدة البيانات
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/yourDB";
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB...");
  seedMuseums();
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// ✅ دالة إدخال المتاحف
async function seedMuseums() {
  try {
    await Museum.deleteMany();
    await Museum.insertMany(museumsData);
    console.log("✅ Museums data inserted successfully!");
  } catch (err) {
    console.error("❌ Error inserting museums data:", err);
  }
}

// ✅ POST رسالة مع AI
app.post("/api/messages", authenticate, async (req, res) => {
  const { content } = req.body;
  const userId = req.user.userId;

  if (!content) {
    return res.status(400).json({ error: "Message is empty!" });
  }

  try {
    const message = await Message.create({
      userId,
      content,
      aiReply: "Waiting for AI response..."
    });

    const aiRes = await axios.post("https://web-production-65e38.up.railway.app/chat", {
      message: content
    });

    const aiReply = aiRes.data.response;
    message.aiReply = aiReply;
    await message.save();

    res.json({
      userId: message.userId,
      content: message.content,
      aiReply: message.aiReply,
      createdAt: message.createdAt
    });
  } catch (err) {
    console.error("Error from AI API:", err.message);
    res.status(500).json({ error: "Something went wrong with the AI." });
  }
});

// ✅ GET كل الرسائل
app.get("/api/messages", authenticate, async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.user.userId }).lean();

    const cleanedMessages = messages.map(msg => {
      const { __v, ...rest } = msg;
      return rest;
    });

    res.json(cleanedMessages);
  } catch (err) {
    res.status(500).json({ error: "Error fetching messages." });
  }
});

// ✅ إضافة المسارات الجانبية
app.use("/api/monuments", monumentRoutes);
app.use("/api/museums", museumRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);

// ✅ نقطة اختبار
app.get("/", (req, res) => res.json({ message: "🚀 API is running" }));

// ✅ تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
