import axios from 'axios';

// During development (localhost), Vite's proxy in vite.config.js handles '/api'
// In production (Netlify), it uses the VITE_BACKEND_URL environment variable you set in Netlify dashboard.
const baseURL = import.meta.env.MODE === 'production' 
  ? import.meta.env.VITE_BACKEND_URL 
  : ''; // In dev, we use the relative path which gets caught by Vite's proxy

const axiosClient = axios.create({
  baseURL: baseURL,
  withCredentials: true, // Crucial for sending cookies/session ID cross-origin
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;
