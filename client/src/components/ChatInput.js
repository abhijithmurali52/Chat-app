import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addMessage } from '../features/messagesSlice';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const ChatInput = () => {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = { sender: 'User', content: message };
      socket.emit('sendMessage', newMessage);
      dispatch(addMessage(newMessage));
      setMessage('');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatInput;
