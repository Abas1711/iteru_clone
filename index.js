require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");


const app = express();
app.use(express.json());


connectDB();
app.get("/", (req, res) => res.json({message:"API running"}));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/museums", require("./routes/museumRoutes"));
app.use("/api/images", require("./routes/imageRoutes"));
app.listen(5000, () => console.log("Server running on port 5000"));


