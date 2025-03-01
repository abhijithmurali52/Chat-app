// controllers/messageController.js
const User = require('../models/User');
// Send Message
exports.sendMessage = async (req, res) => {
  const { senderId, receiverId, content } = req.body;

  try {
    // Find sender and receiver users
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create message object
    const message = {
      receiver: receiverId,
      content,
      timestamp: new Date(),
    };

    // Save message under sender's sentMessages
    sender.sentMessages.push({ ...message, receiver: receiverId });
    await sender.save();

    // Save message under receiver's receivedMessages
    receiver.receivedMessages.push({ ...message, sender: senderId });
    await receiver.save();

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error });
  }
};

// Get Messages Between Two Users
exports.getMessages = async (req, res) => {
  const { senderId, receiverId } = req.query;

  try {
    const sender = await User.findById(senderId).populate('sentMessages.receiver');
    const receiver = await User.findById(receiverId).populate('receivedMessages.sender');

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    const messages = [
      ...sender.sentMessages.filter(msg => msg.receiver._id.toString() === receiverId),
      ...receiver.receivedMessages.filter(msg => msg.sender._id.toString() === senderId),
    ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error });
  }
};
// Get all users (except the logged-in user)
exports.getAllUsers = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const users = await User.find({ _id: { $ne: req.user._id } }).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

