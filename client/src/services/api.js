import axios from 'axios';

const API = axios.create({ baseURL: 'https://chat-app-backend-khpw.onrender.com/api/users' });

export const registerUser = (data) => API.post('/register', data);
export const loginUser = (data) => API.post('/login', data);
