import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Replace with your server's URL
const socket = io('http://localhost:5000');

const ChatComponent = ({ userId }) => {
  const [users, setUsers] = useState([]);  // List of all users
  const [activeChat, setActiveChat] = useState(null);  // Active user for chat
  const [message, setMessage] = useState('');  // Message input
  const [messages, setMessages] = useState([]);  // Messages for the active chat

  useEffect(() => {
    // Fetch all users except the current user
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/messages/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();

    // Listen for incoming messages
    socket.on('message', (incomingMessage) => {
      if (incomingMessage.receiver === activeChat) {
        setMessages((prevMessages) => [...prevMessages, incomingMessage]);
      }
    });

    return () => {
      socket.off('message');
    };
  }, [userId, activeChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (message.trim() === '') return;

    const messageData = {
      receiver: activeChat,
      content: message,
    };

    try {
      // Send message to the server
      await fetch('http://localhost:5000/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });

      // Emit the message to the receiver via Socket.IO
      socket.emit('message', { sender: userId, receiver: activeChat, content: message });

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleUserClick = async (userId) => {
    setActiveChat(userId);

    // Fetch messages for the selected user
    try {
      const response = await fetch(`http://localhost:5000/api/messages/${userId}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* User List */}
      <div style={{ width: '250px', marginRight: '20px', borderRight: '1px solid #ccc', padding: '10px' }}>
        <h3>Users</h3>
        {Array.isArray(users) && users.length > 0 ? (
  <ul style={{ listStyle: 'none', padding: 0 }}>
    {users.map((user) => (
      <li
        key={user._id}
        style={{
          padding: '10px',
          cursor: 'pointer',
          backgroundColor: activeChat === user._id ? '#f0f0f0' : 'transparent',
        }}
        onClick={() => handleUserClick(user._id)}
      >
        {user.username}
      </li>
    ))}
  </ul>
) : (
  <div>No users found</div>
)}
      </div>

      {/* Chat Box */}
      <div style={{ flex: 1 }}>
        {activeChat ? (
          <div style={{ padding: '20px' }}>
            <h3>Chat with User {activeChat}</h3>

            <div style={{ height: '400px', overflowY: 'scroll', marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
              {messages.map((msg, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <strong>{msg.sender === userId ? 'You' : 'User ' + msg.sender}: </strong>
                  <span>{msg.content}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                style={{ width: '80%', padding: '10px' }}
              />
              <button type="submit" style={{ padding: '10px' }}>Send</button>
            </form>
          </div>
        ) : (
          <div style={{ padding: '20px' }}>Select a user to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;
