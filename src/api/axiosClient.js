import axios from 'axios';

// During development (localhost), Vite's proxy in vite.config.js handles '/api'
// In production (Netlify), it uses the VITE_BACKEND_URL environment variable you set in Netlify dashboard.
const baseURL = import.meta.env.MODE === 'production' 
  ? import.meta.env.VITE_BACKEND_URL 
  : ''; // In dev, we use the relative path which gets caught by Vite's proxy

const axiosClient = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle Bridge redirects from backend
axiosClient.interceptors.response.use(
  (response) => {
    // Check if the response data contains a JSON redirect signal from our Backend Bridge
    if (response.data && response.data.redirect) {
      const redirectUrl = response.data.redirect;
      
      // If the redirect is to /login, we should also clear any local storage if needed 
      // but for now, we just perform the navigation.
      // Using window.location.href because this is a non-component file.
      // In SPA, this triggers a reload which is safe for cross-origin domain session sync.
      window.location.href = redirectUrl;
      return new Promise(() => {}); // Halt further execution
    }
    return response;
  },
  (error) => {
    // Handle global errors like 401 Unauthorized
    if (error.response && error.response.status === 401) {
       window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Utility to get full image URL
export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  // If it's a relative path starting with /img/ or /uploads/, append backend URL in production
  const apiURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // In development, we use proxy or relative path
  if (import.meta.env.MODE === 'development') {
    return cleanPath;
  }
  
  return `${apiURL}${cleanPath}`;
};

export default axiosClient;
