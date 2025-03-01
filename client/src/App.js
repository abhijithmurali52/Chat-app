import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { useSelector, useDispatch  } from 'react-redux';
import { selectUser, login } from './features/userSlice';
import MessageBox from './components/MessageBox'; // Import message component
import UserList from './components/UserList';
import Chat from './components/Chat';
// import ChatWindow from './components/ChatWindow';
// import ChatInput from './components/ChatInput';

function App() {
  const userInfo = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      dispatch(login(JSON.parse(storedUser)));
    }
  }, [dispatch]);  return (
    <div className="App">
       <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path='/users' element={<UserList/>}/>

        {/* Protected Route */}
        <Route
          path="/dashboard"
          element={userInfo ? <Dashboard /> : <Navigate to="/" />}
        />
         <Route
          path="/messages"
          element={userInfo ? <MessageBox /> : <Navigate to="/" />}
        />
        <Route path='/chat' element={<Chat/>}/>

        {/* Redirect to Login if no route matches */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
