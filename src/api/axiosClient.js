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
