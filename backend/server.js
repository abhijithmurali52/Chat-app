const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');
const http = require('http');
const messageRoutes = require('./routes/messageRoutes'); // Import the routes
const userRoutes = require('./routes/userRoutes');
const dotenv = require('dotenv');
dotenv.config();
const User = require('./models/User');
// Verify JWT_SECRET
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('MONGO_URL:', process.env.MONGO_URL);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000', // Your frontend URL
      methods: ['GET', 'POST'],
    },
  });
  
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/api', messageRoutes); // Use the message routes
app.use('/api/users', userRoutes);

// Socket.io
let onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('User Connected:', socket.id);

  socket.on('join', (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on('sendMessage', async ({ senderId, receiverId, content }) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', { senderId, content });
    }
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected:', socket.id);
    onlineUsers.forEach((value, key) => {
      if (value === socket.id) {
        onlineUsers.delete(key);
      }
    });
  });
});
// // WebSocket setup for real-time messaging
// io.on('connection', (socket) => {
//   console.log('A user connected');
  
//   socket.on('sendMessage', (message) => {
//     io.emit('receiveMessage', message); // Broadcast to all clients
//   });
  
//   socket.on('disconnect', () => console.log('User disconnected'));
// });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
