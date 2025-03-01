import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' }); // Replace with your backend URL

// Add token to requests
API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    req.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`;
  }
  return req;
});

export const sendMessage = (messageData) => API.post('/messages/send', messageData);
export const getMessages = (userId) => API.get(`/messages/${userId}`);
