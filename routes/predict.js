const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const router = express.Router();

// multer لإستقبال الصور بدون تخزين (in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/predict', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // إنشاء form-data جديدة
    const form = new FormData();
    form.append('image', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    // إرسال الصورة لـ AI endpoint
    const response = await axios.post('https://web-production-9811.up.railway.app/predict', form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    // رجّع رد الذكاء الاصطناعي للعميل
    res.json(response.data);
  } catch (error) {
    console.error('Prediction error:', error.message);
    res.status(500).json({
      error: 'Prediction failed',
      details: error.response ? error.response.data : error.message,
    });
  }
});

module.exports = router;
