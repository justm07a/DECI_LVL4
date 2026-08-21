const Message = require('../models/message.model');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.sendAnnouncement = asyncHandler(async (req, res, next) => {
  const { eventId, text } = req.body;
  const senderId = req.user.userId;

  const message = await Message.create({
    event: eventId,
    sender: senderId,
    text,
  });

  const io = req.app.get('io');
  if (io) {
    io.to(eventId).emit('announcement', {
      _id: message._id,
      event: eventId,
      sender: senderId,
      text,
      createdAt: message.createdAt,
    });
  }

  res.status(201).json({
    status: 'success',
    data: message,
  });
});

exports.getAnnouncements = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;

  const messages = await Message.find({ event: eventId })
    .populate('sender', 'name email')
    .sort({ createdAt: 1 });

  res.status(200).json({
    status: 'success',
    data: messages,
  });
});
