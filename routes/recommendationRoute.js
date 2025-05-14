const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const multer = require('multer'); 
const router = express.Router();

const upload = multer(); 

router.post('/', upload.none(), async (req, res) => {
  try {
    const userData = req.body;
    console.log('User data:', userData);

    const form = new FormData();
    for (let key in userData) {
      form.append(key, userData[key]);
    }

    const response = await axios.post('http://BluSerK.pythonanywhere.com/rec', form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error sending data:', error);
    res.status(500).json({
      error: 'Recommendation failed',
      details: error.response ? error.response.data : error.message
    });
  }
});

module.exports = router;
