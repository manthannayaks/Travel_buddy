import axios from 'axios';
import { getToken } from '../utils/auth';

// Use the laptop's physical Wi-Fi IP address so Expo Go on your smartphone can connect to Node.js
const BASE_URL = 'https://travel-buddy-backend-m8he.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
