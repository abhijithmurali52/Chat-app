import React, { useState } from 'react';
import { loginUser } from '../services/api';
import { useDispatch } from 'react-redux';
import { login } from '../features/userSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState(null); // For success or error messages
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // Making the login request
        const { data } = await loginUser(formData);
        
        // Store the token in localStorage
        localStorage.setItem('token', data.token); 

        // Dispatch the login action to save user info in Redux or global state
        dispatch(login(data));

        // Set success message
        setMessage({ type: 'success', text: 'Login successful!' });

        // Redirect to dashboard after successful login
        navigate('/dashboard');
    } catch (error) {
        // Handle any error that occurs
        setMessage({ type: 'error', text: error.response?.data?.message || 'Login failed!' });
    }
};
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <button type="submit">Login</button>
      </form>

      {message && (
        <p
          style={{
            color: message.type === 'success' ? 'green' : 'red',
            marginTop: '10px',
          }}
        >
          {message.text}
        </p>
      )}
    </div>
  );
};

export default Login;
