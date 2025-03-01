import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, addMessage } from '../features/messagesSlice';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const ChatWindow = () => {
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.messages);

  useEffect(() => {
    dispatch(fetchMessages());
    socket.on('receiveMessage', (message) => {
      dispatch(addMessage(message));
    });
  }, [dispatch]);

  return (
    <div>
      {messages.map((msg, index) => (
        <p key={index}>
          <strong>{msg.sender}: </strong>
          {msg.content}
        </p>
      ))}
    </div>
  );
};

export default ChatWindow;
