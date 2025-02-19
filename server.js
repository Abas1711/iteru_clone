require("dotenv").config();
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



