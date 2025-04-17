const Message = require('../models/messagesModel');

exports.createMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const sender = req.user._id;

    // ToDo: Add replyAi from AI Model
    const replyAi = 'This is a reply from AI';

    const message = await Message.create({ sender, content, replyAi });
    res.status(201).json({
      status: 'success',
      data: {
        message,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json({
      status: 'success',
      data: {
        messages,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};
