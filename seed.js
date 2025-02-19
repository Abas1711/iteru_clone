require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Museum = require("./models/Museum");
const museumsData = require("./data/museumsData.json");
const museumRoutes = require("./routes/museumRoutes");

const app = express();
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/yourDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB..."))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Function to seed data (Call manually when needed)
async function seedDB() {
  try {
    await Museum.deleteMany(); // Clear existing data
    await Museum.insertMany(museumsData); // Insert new data
    console.log("✅ Museums data inserted successfully!");
  } catch (err) {
    console.error("❌ Error inserting museums data:", err);
  }
}

// ✅ Define routes
app.use("/api/museums", museumRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

// Uncomment the line below to seed the database manually
// seedDB();
