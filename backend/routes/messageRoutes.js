const express = require('express');
const { sendMessage, getMessages, getAllUsers } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware'); // Ensure the user is authenticated
const router = express.Router();

// Route to get all users (excluding the logged-in user)
router.get('/users', protect, getAllUsers);

// Route to get all messages between two users
router.get('/messages', protect, getMessages);

// Route to send a message
router.post('/messages', protect, sendMessage);

module.exports = router;
