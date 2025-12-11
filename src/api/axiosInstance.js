import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.arabfilmdb.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// interceptor for adding token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// interceptor for handling responses
axiosInstance.interceptors.response.use((response) => {
  return response;
}, (error) => {
  // Handle authentication errors only for protected routes
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Only redirect to login if we're on a protected route
    const currentPath = window.location.pathname;
    const protectedRoutes = ['/Profile', '/dashboard', '/AdminDashboard', '/AddForm'];

    if (protectedRoutes.some(route => currentPath.startsWith(route))) {
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
});

export { axiosInstance };
