require("dotenv").config();
const mongoose = require('mongoose');
const express = require("express");
const connectDB = require("./config/db");



const app = express();
app.use(express.json());


connectDB();


app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/museums", require("./routes/museumRoutes"));
app.use("/api/images", require("./routes/imageRoutes"));
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
console.log("MONGO_URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.log("DB Connection Error:", err));



