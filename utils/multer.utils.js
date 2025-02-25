const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../providers/cloudinary");

// ✅ إعداد `multer` لتخزين الصور في `Cloudinary`
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "museums", // 🔹 المجلد داخل Cloudinary
    format: file.mimetype.split("/")[1], // 🔹 تحديد نوع الصورة تلقائيًا
    public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "-").split(".")[0]}`, // 🔹 حذف الامتداد المكرر
    resource_type: "image", // 🔹 التأكد من رفع الصور فقط
  }),
});

const upload = multer({
  storage,
  limits: { fileSize: 60 * 1024 * 1024 }, // 🔹 الحد الأقصى للحجم (60MB)
}).fields([
  { name: "coverPicture", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

module.exports = upload;
