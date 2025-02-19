// const mongoose = require("mongoose");
// const Museum = require("./models/Museum");
// const museumsData = require("./data/museumsData.json");

// mongoose.connect("mongodb://localhost:27017/yourDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => {
//   console.log("✅ Connected to MongoDB...");
//   return seedDB();
// }).catch((err) => {
//   console.error("❌ MongoDB connection error:", err);
// });

// async function seedDB(req, res) {
//   try {
//     await Museum.deleteMany(); 
//     const insertedMuseums = await Museum.insertMany(museumsData); 

//     console.log("✅ Museums data inserted successfully!", insertedMuseums); 

//     if (res) { 
//       return res.status(201).json({
//         success: true,
//         message: "Museums inserted successfully",
//         data: insertedMuseums
//       });
//     }
//   } catch (err) {
//     console.error("❌ Error inserting museums data:", err);
//     if (res) {
//       return res.status(500).json({ success: false, message: "Error inserting data", error: err });
//     }
//   } finally {
//     mongoose.connection.close();
//   }
// }
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
}).then(() => {
  console.log("✅ Connected to MongoDB...");
  return seedDB(); 
}).catch((err) => {
  console.error(" MongoDB connection error:", err);
});

async function seedDB(req, res) {
  try {
    await Museum.deleteMany(); // Clear existing data
    const insertedMuseums = await Museum.insertMany(museumsData); // Insert new data

    console.log("✅ Museums data inserted successfully!", insertedMuseums);

    if (res) { 
      return res.status(201).json({
        success: true,
        message: "Museums inserted successfully",
        data: insertedMuseums
      });
    }
  } catch (err) {
    console.error(" Error inserting museums data:", err);
    if (res) {
      return res.status(500).json({ success: false, message: "Error inserting data", error: err });
    }
  }
}

app.use("/api/museums", museumRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
