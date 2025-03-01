import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

const Chat = () => {
  const user = useSelector((state) => state.user.user); // Get user from Redux
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState(null);
  

 
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/users');
        setUsers(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);
  
  

  useEffect(() => {
    if (selectedUser) {
      axios.get(`http://localhost:5000/api/messages/${selectedUser._id}`, { withCredentials: true })
        .then(res => setMessages(res.data))
        .catch(err => console.error('Error fetching messages:', err));
    }
  }, [selectedUser]);

  useEffect(() => {
    socket.on('message', (message) => {
      if (selectedUser && message.sender === selectedUser._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off('message');
    };
  }, [selectedUser]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      receiver: selectedUser._id,
      content: newMessage,
    };

    try {
      const res = await axios.post('http://localhost:5000/api/messages', messageData, { withCredentials: true });
      setMessages([...messages, res.data]);
      socket.emit('sendMessage', res.data);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="messaging-container">
      <div className="users-list">
        <h3>Users</h3>
        <ul>
          {users.map((u) => (
            <li key={u._id} onClick={() => setSelectedUser(u)}>
              {u.username}
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-container">
        {selectedUser ? (
          <>
            <h3>Chat with {selectedUser.username}</h3>
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender === user._id ? 'sent' : 'received'}`}>
                  <p>{msg.content}</p>
                  <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input 
                type="text" 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)} 
                placeholder="Type a message..." 
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <p>Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default Chat;
