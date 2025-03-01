import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch users from the backend
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
  console.log("token",localStorage.getItem('token'))
   // Handle sending a message
   const handleSendMessage = async () => {
    if (!message.trim()) {
      alert('Message cannot be empty!');
      return;
    }
  
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token not found. Please log in again.');
      return;
    }
  
    console.log('Sending with token:', token); // Log the token being sent
    
    try {
      const response = await axios.post(
        'http://localhost:5000/api/messages/messages',
        {
          receiver: selectedUser._id,
          content: message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess('Message sent successfully!');
      setMessage('');
      setSelectedUser(null); // Close the modal after sending
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to send message. Please try again later.');
      }
    }
  };
  
  
  


  return (
    <div>
    <h1>Users</h1>
    {error && <p style={{ color: 'red' }}>{error}</p>}
    {success && <p style={{ color: 'green' }}>{success}</p>}

    <ul>
      {users.map((user) => (
        <li key={user._id}>
          {user.username} - {user.email}{' '}
          <button onClick={() => setSelectedUser(user)}>Message</button>
        </li>
      ))}
    </ul>

    {/* Modal for sending message */}
    {selectedUser && (
      <div style={{ border: '1px solid black', padding: '20px', marginTop: '20px' }}>
        <h3>Send a message to {selectedUser.username}</h3>
        <textarea
          rows="4"
          cols="30"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
        ></textarea>
        <br />
        <button onClick={handleSendMessage}>Send</button>
        <button onClick={() => setSelectedUser(null)}>Cancel</button>
      </div>
    )}
  </div>
  );
};

export default UserList;
