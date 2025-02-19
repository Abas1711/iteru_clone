const Museum = require('../models/Museum');

// const createMuseum = async (req, res) => {
//   const museum = await Museum.create({ ...req.body, createdBy: req.user.id });
//   res.status(201).json(museum);
// };
const createMuseum = async (req, res) => {
    console.log("Received data:", req.body);
    try {
        const museum = await Museum.create({ ...req.body, createdBy: req.user.id });
        res.status(201).json(museum);
    } catch (error) {
        console.error("Error creating museum:", error);
        res.status(500).json({ message: "Server error" });
    }
};


const getMuseums = async (req, res) => {
  const museums = await Museum.find();
  res.json(museums);
};


const updateMuseum = async (req, res) => {
  console.log("Updating Museum with ID:", req.params.id);
  try {
      const museum = await Museum.findById(req.params.id);
      if (!museum) return res.status(404).json({ message: "Museum not found" });

      Object.assign(museum, req.body);
      await museum.save();
      res.json(museum);
  } catch (error) {
      console.error("Error updating museum:", error);
      res.status(500).json({ message: "Server error" });
  }
};

const deleteMuseum = async (req, res) => {
  console.log("Deleting Museum with ID:", req.params.id);
  try {
      const museum = await Museum.findById(req.params.id);
      if (!museum) return res.status(404).json({ message: "Museum not found" });

      await museum.deleteOne();
      res.json({ message: "Deleted" });
  } catch (error) {
      console.error("Error deleting museum:", error);
      res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createMuseum, getMuseums, updateMuseum, deleteMuseum };