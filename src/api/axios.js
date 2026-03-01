import axios from 'axios';

const api = axios.create({
    baseURL: 'https://sport-shop-backend.onrender.com/',
    withCredentials: true, // important for session cookies
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export default api;
