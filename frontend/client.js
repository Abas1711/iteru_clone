async function sendMessage() {
    const input = document.getElementById("msg");
    const chatBox = document.getElementById("chat");
    const content = input.value;
  
    if (!content) return;
  
    // أضف الرسالة التي كتبها المستخدم
    const userItem = document.createElement("li");
    userItem.textContent = "أنت: " + content;
    chatBox.appendChild(userItem);
  
    input.value = "";
  
    try {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZmZlZmVkMGI4M2I2OWRjMjM2NDJmNSIsImlhdCI6MTc0NDgyNzA0MiwiZXhwIjoxNzQ0OTEzNDQyfQ.68gH7sUPYwnMbt_01puHFP9WkhSCW7fJ6lQXRbj0BNM'; // حط التوكن اللي جالك من تسجيل الدخول
  
      const res = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // ✅ كده تمام
        },
        body: JSON.stringify({ content })
      });
  
      if (!res.ok) throw new Error("Failed to send message");
  
      const data = await res.json();
  
      const aiItem = document.createElement("li");
      aiItem.textContent = "AI: " + data.aiReply;
      chatBox.appendChild(aiItem);
    } catch (err) {
      const errorItem = document.createElement("li");
      errorItem.textContent = "❌ خطأ في الاتصال بالسيرفر";
      chatBox.appendChild(errorItem);
    }
  }
  