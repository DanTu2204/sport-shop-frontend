const axios = require('axios');

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 5000,
});

// Helper to handle API calls
const fetchData = async (path, req) => {
    try {
        const config = {};
        if (req && req.headers.cookie) {
            config.headers = { Cookie: req.headers.cookie };
        }
        const response = await api.get(path, config);
        return response.data;
    } catch (err) {
        console.error(`API Error (${path}):`, err.message);
        return null;
    }
};

module.exports = { api, fetchData };
