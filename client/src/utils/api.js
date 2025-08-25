import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://refaldo-kasir-server.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Ini akan secara otomatis menambahkan token login ke setiap request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;