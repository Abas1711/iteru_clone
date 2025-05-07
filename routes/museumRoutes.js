// module.exports = router;
const express = require("express");
const router = express.Router();
const Museum = require("../models/Museum");







router.get("/", async (req, res) => {
  try {
    const museums = await Museum.find(); 
    res.status(200).json({
      data: museums
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching museums", error: err });
  }
});

module.exports = router;
