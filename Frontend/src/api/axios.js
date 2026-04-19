import axios from 'axios';
import { store } from '../store/store';
import { logout } from '../store/slices/authSlice';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // Adjust base URL as needed
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach the token
axiosInstance.interceptors.request.use(
    (config) => {
        // We can pull the token right from LocalStorage or Redux (Redux shown here)
        const token = store.getState().auth.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle unauthenticated errors (e.g., 401)
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // If our backend throws 401, it means token expired or invalid
        if (error.response && error.response.status === 401) {
            store.dispatch(logout()); // Log user out automatically
            window.location.href = '/login'; // Redirect to login
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
