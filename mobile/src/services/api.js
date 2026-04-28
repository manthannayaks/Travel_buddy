import axios from 'axios';
import { getToken } from '../utils/auth';

import { Platform } from 'react-native';

// Use local backend for web testing, and production for mobile
const BASE_URL = Platform.OS === 'web' 
  ? 'http://localhost:5001' 
  : 'https://travel-buddy-backend-m8he.onrender.com';

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
