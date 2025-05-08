const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/", (req, res) => {
  const filePath = path.join(__dirname, "..", "data", "monumentsData.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error reading monuments data", error: err });
    }

    try {
      const monuments = JSON.parse(data);
      res.status(200).json({ data: monuments });
    } catch (parseError) {
      res.status(500).json({ success: false, message: "Error parsing JSON data", error: parseError });
    }
  });
});

module.exports = router;
