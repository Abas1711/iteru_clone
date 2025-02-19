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
    
    const userType = req.query.userType; 

    const museums = await Museum.find().select("-__v");


    const filteredMuseums = museums.map((museum) => {
      let ticket_prices = {};

      if (userType === "foreigner") {
        ticket_prices = {
          foreign_adult: museum.ticket_prices.foreign_adult,
          foreign_student: museum.ticket_prices.foreign_student,
          foreigners: museum.ticket_prices.foreigners,
        };
      } else { 
        ticket_prices = {
          egyptian_adult: museum.ticket_prices.egyptian_adult,
          egyptian_student: museum.ticket_prices.egyptian_student,
          egyptian_arabs: museum.ticket_prices.egyptian_arabs,
        };
      }

      return {
        ...museum.toObject(),
        ticket_prices,
      };
    });

    res.status(200).json({ data: filteredMuseums });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching museums", error: err });
  }
});

module.exports = router;
