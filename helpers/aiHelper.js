const axios = require("axios");

// دالة لإرسال الرسالة للـ AI والرد عليها
async function getAIResponse(message) {
  try {
    // إرسال البيانات للـ AI API عبر الرابط اللي إنت ذكرته
    const response = await axios.post("https://web-production-65e38.up.railway.app/chat", {
      message: message
    });

    // لو الـ response تمام، هنرجع الرد من الـ AI
    return response.data.reply || "لا يوجد رد من AI";  // تأكد من اسم الحقل المرسل من الـ API
  } catch (err) {
    console.error("Error connecting to AI:", err.message);
    return "حدث خطأ في الاتصال بـ AI.";
  }
}

module.exports = { getAIResponse };
