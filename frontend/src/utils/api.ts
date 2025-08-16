import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
    withCredentials: true,
});

// Centralized error handling
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 500) {
            window.location.href = '/500';
        }
        return Promise.reject(error);
    }
);

export default api;
