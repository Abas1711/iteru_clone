// const express = require("express");
// const museumController = require("../controllers/museumController");
// const authMiddleware = require("../middlewares/authMiddleware");
// // const authMiddleware = require("../middleware/authMiddleware.js");
// const router = express.Router();
// authMiddleware
// router.post("/", authMiddleware, museumController.createMuseum);
// router.get("/", museumController.getMuseums);
// router.put("/:id", authMiddleware, museumController.updateMuseum);
// router.delete("/:id", authMiddleware, museumController.deleteMuseum);

// router.get("/museums", async (req, res) => {
//     try {
//       const museums = await Museum.find();
//       res.json(museums);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });



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
