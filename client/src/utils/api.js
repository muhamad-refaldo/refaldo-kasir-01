import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // URL backend Anda
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