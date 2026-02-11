import axios from "axios";

// ============================================
// DEMO MODE FLAG - Must match AuthContext.jsx
// Set to false when backend is ready
// ============================================
const DEMO_MODE = true;

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

// Response interceptor - Handle errors globally with token refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - Token expired or invalid
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // ============================================
            // TOKEN REFRESH LOGIC
            // Only active when DEMO_MODE is false (backend ready)
            // ============================================
            if (!DEMO_MODE) {
                try {
                    const refreshToken = localStorage.getItem('refresh_token');

                    if (refreshToken) {
                        // Attempt to refresh the access token
                        const { data } = await axios.post(
                            `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/refresh`,
                            { refreshToken }
                        );

                        // Store the new access token
                        localStorage.setItem('access_token', data.access_token);

                        // If backend also returns a new refresh token, update it
                        if (data.refresh_token) {
                            localStorage.setItem('refresh_token', data.refresh_token);
                        }

                        // Update the original request with new token and retry
                        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
                        return axiosInstance(originalRequest);
                    }
                } catch (refreshError) {
                    // Refresh failed - clear all auth data and redirect
                    console.error('Token refresh failed:', refreshError.message);
                }
            }

            // Clear auth data (both tokens) and redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
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
