import axios from 'axios';
import { getToken } from '../utils/auth';

// Use the laptop's physical Wi-Fi IP address so Expo Go on your smartphone can connect to Node.js
const BASE_URL = 'http://172.31.75.179:5001';

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
