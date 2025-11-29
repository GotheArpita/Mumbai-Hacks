import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token to headers
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Attach auth methods to the api instance to maintain compatibility
api.login = (data) => api.post('/auth/login', data);
api.getMe = () => api.get('/auth/me');
api.updateProfile = (data) => api.put('/auth/profile', data);

export default api;
