import axios from "axios";

// Create an Axios instance with environment-based URL
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000, // 10 second timeout
});

// Request interceptor - Add auth token to all requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - Token expired or invalid
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Clear auth data and redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');

            // Only redirect if not already on login page
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }

        // Handle other errors
        const message = error.response?.data?.message || error.message || 'An error occurred';
        console.error('API Error:', message);

        return Promise.reject(error);
    }
);

export default axiosInstance;
