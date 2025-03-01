const socketIo = require('socket.io');

// Initialize Socket.IO
let io;

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: 'http://localhost:3000',  // Your frontend URL
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('user_connected', (userId) => {
      socket.join(userId);  // Join the user to a "room" based on their userId
      console.log(`${userId} joined the room`);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};

// Emit message to a user
const sendMessageToUser = (message, receiverId) => {
  if (!io) {
    console.error('Socket.IO server not initialized');
    return;
  }

  io.to(receiverId).emit('message', message);  // Emit the message to the receiver's socket
};

module.exports = { initializeSocket, sendMessageToUser };
