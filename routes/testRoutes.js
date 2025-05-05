const express = require("express");
const router = express.Router();

// نقطة اختبار ترجع true أو false
router.get("/test", (req, res) => {
  const isApiWorking = true;  // يمكنك تغيير هذه القيمة بناءً على أي شرط تود اختباره

  if (isApiWorking) {
    return res.json({ success: true });
  } else {
    return res.json({ success: false });
  }
});

module.exports = router;
