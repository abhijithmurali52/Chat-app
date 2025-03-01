import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/userSlice';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  const handleMessagePage = () => {
    navigate('/chat');

  };
  const handleUsersPage = () => {
    navigate('/users');

  };

  return (
    <div>
      <h1>Welcome, {userInfo?.username}!</h1>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleMessagePage} >
        Go to Messages
      </button>
      <button onClick={handleUsersPage} >
        Users
      </button>
    </div>
  );
};

export default Dashboard;
