const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  content: { type: String, required: true },
  aiReply: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// حذف __v تلقائيًا من JSON
messageSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
