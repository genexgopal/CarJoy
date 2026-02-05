import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axiosInstance from '../api/axiosInstance';

/**
 * AuthContext
 *
 * Provides authentication state and methods throughout the application.
 * Handles login, logout, and token validation on app mount.
 */
const AuthContext = createContext(null);

// ============================================
// DEMO MODE - Set to false when backend is ready
// ============================================
const DEMO_MODE = true;

// Demo credentials for testing (only used when DEMO_MODE is true)
const DEMO_USERS = [
  { email: 'admin@carjoy.com', password: 'admin123', name: 'Admin User', role: 'Administrator' },
  { email: 'user@carjoy.com', password: 'user123', name: 'Test User', role: 'User' },
  { email: 'demo@demo.com', password: 'demo', name: 'Demo User', role: 'User' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Login user with email and password
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>} User data on success
   */
  const login = useCallback(async (email, password) => {
    setError(null);
    setIsLoading(true);

    try {
      // DEMO MODE: Check against demo users
      if (DEMO_MODE) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const demoUser = DEMO_USERS.find(
          u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (demoUser) {
          const userData = { email: demoUser.email, name: demoUser.name, role: demoUser.role };
          const fakeToken = 'demo_token_' + Date.now();

          localStorage.setItem('access_token', fakeToken);
          localStorage.setItem('user', JSON.stringify(userData));

          setUser(userData);
          return userData;
        } else {
          throw new Error('Invalid email or password. Try: demo@demo.com / demo');
        }
      }

      // PRODUCTION MODE: Use real API
      const response = await axiosInstance.post('/api/login', { email, password });
      const { access_token, user: userData } = response.data;

      // Store token and user data
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      return userData;
    } catch (err) {
      const message = err.message || err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Register a new user
   * @param {Object} userData - Registration data
   * @returns {Promise<Object>} User data on success
   */
  const register = useCallback(async (userData) => {
    setError(null);
    setIsLoading(true);

    try {
      // DEMO MODE: Simulate registration
      if (DEMO_MODE) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newUser = {
          email: userData.email,
          name: userData.firstName + ' ' + userData.lastName,
          role: 'User'
        };
        const fakeToken = 'demo_token_' + Date.now();

        localStorage.setItem('access_token', fakeToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);

        return { success: true, user: newUser, access_token: fakeToken };
      }

      // PRODUCTION MODE: Use real API
      const response = await axiosInstance.post('/api/register', userData);
      const { access_token, user: newUser } = response.data;

      if (access_token) {
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
      }

      return response.data;
    } catch (err) {
      const message = err.message || err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout user and clear all auth data
   */
  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  }, []);

  /**
   * Clear any auth errors
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Validate token and restore user session on mount
   */
  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user');
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Try to restore user from localStorage first
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          // Invalid JSON, clear it
          localStorage.removeItem('user');
        }
      }

      // Optionally validate token with backend
      // Uncomment if your backend has a /api/me or /api/validate endpoint
      /*
      try {
        const response = await axiosInstance.get('/api/me');
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } catch {
        // Token invalid, clear auth data
        logout();
      }
      */
      
      setIsLoading(false);
    };

    validateSession();
  }, [logout]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  }), [user, isLoading, error, login, register, logout, clearError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access auth context
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

