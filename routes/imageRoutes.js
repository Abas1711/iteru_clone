const express = require("express");
const router = express.Router();
const upload = require("../utils/multer.utils");

// ✅ رفع الصور إلى Cloudinary
router.post("/upload", upload, async (req, res) => {
  try {
    if (!req.files || (!req.files.coverPicture && !req.files.images)) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // ✅ استخراج روابط الصور من Cloudinary
    const coverPictureUrl = req.files.coverPicture
      ? req.files.coverPicture[0].path // Cloudinary يعيد الرابط هنا
      : null;
    const imagesUrl = req.files.images
      ? req.files.images.map(file => file.path)
      : [];

    res.json({
      message: "Images uploaded successfully",
      coverPicture: coverPictureUrl,
      images: imagesUrl,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

module.exports = router;
