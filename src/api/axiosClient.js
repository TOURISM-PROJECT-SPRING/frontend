import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    timeout: import.meta.env.VITE_API_TIMEOUT ? Number(import.meta.env.VITE_API_TIMEOUT) : 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use((config) => {

    const token = localStorage.getItem('token');

    if (config.expectedSessionToken !== undefined) {
        if (config.expectedSessionToken !== token) {
            throw new Error('Your session changed. Open your profile again.');
        }
        delete config.expectedSessionToken;
    }

    if (token && !config.headers.has("Authorization")) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default axiosClient;