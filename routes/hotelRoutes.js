const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// GET: List all hotels
// router.get("/", (req, res) => {
//   const filePath = path.join(__dirname, "../data/hotels.json");
//   fs.readFile(filePath, "utf8", (err, data) => {
//     if (err) {
//       return res.status(500).json({ message: "Error reading hotel data" });
//     }
//     const hotels = JSON.parse(data);
//     res.json(hotels);
//   });
// });
router.get("/", (req, res) => {
  const city = req.query.city?.toLowerCase();
  const filePath = path.join(__dirname, "../data/hotels.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ message: "Error reading hotel data" });

    let hotels = JSON.parse(data);
    if (city) {
      hotels = hotels.filter(h => h.city.toLowerCase() === city);
    }
    res.json(hotels);
  });
});


module.exports = router;
