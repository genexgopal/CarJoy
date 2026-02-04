# Detailed Implementation Plan - CarJoy React Application

## Executive Summary

### Current State Assessment

**Application Overview:**
- **Framework:** React 18.2.0 with Vite 5.0.8 build system
- **Styling:** Tailwind CSS 3.4.19 + SCSS with CSS custom properties theming
- **Routing:** React Router DOM 6.20.0
- **HTTP Client:** Axios 1.6.0
- **Validation:** Zod 4.3.5 with custom validation utilities
- **Charts:** Chart.js 4.5.1 with react-chartjs-2
- **Notifications:** react-toastify 11.0.5

### Critical Issues Identified

| Priority | Issue | Impact |
|----------|-------|--------|
| **P0** | No route protection - all admin pages publicly accessible | Security vulnerability |
| **P0** | Hardcoded production API URL in `axiosInstance.js` | Deployment issues |
| **P0** | Token stored in localStorage without security measures | XSS vulnerability |
| **P1** | No global auth state management | Poor UX, inconsistent state |
| **P1** | Mixed fetch/axios usage across components | Code inconsistency |
| **P1** | No API request/response interceptors | Missing auth headers, no error handling |
| **P2** | No loading states or skeleton screens | Poor perceived performance |
| **P2** | Mock data in production components | Incomplete features |
| **P3** | Missing accessibility features | Compliance issues |

### Effort Estimation Legend

- **XS:** 1-2 hours
- **S:** 2-4 hours  
- **M:** 4-8 hours (half day to full day)
- **L:** 1-3 days
- **XL:** 3-5 days

---

## Priority Matrix

### P0 - Critical (Block Production)
1. [1.1] Implement Protected Route Component
2. [1.2] Create AuthContext with proper token management
3. [3.1] Fix hardcoded API URL with environment variables
4. [4.1] Add Axios interceptors for auth headers

### P1 - High Priority (Next Sprint)
5. [4.2] Standardize all API calls to use axios
6. [1.3] Implement token refresh mechanism
7. [5.1] Add route guards to App.jsx
8. [2.1] Set up global state management structure

### P2 - Medium Priority (Following Sprints)
9. [8.1] Add React.memo and optimization hooks
10. [9.1] Implement global error boundary
11. [9.2] Add loading states and skeleton screens
12. [6.1] Integrate React Hook Form

### P3 - Nice to Have (Backlog)
13. [11.1] Set up testing infrastructure
14. [12.1] Accessibility audit and fixes
15. [7.1] Code organization refactoring

---

## Section 1: Authentication & Authorization

### 1.1 Create Protected Route Component

**Priority:** P0 | **Effort:** S (2-4 hours) | **Dependencies:** None

**Current State:**
All routes in `src/App.jsx` are publicly accessible including admin pages.

**File to create:** `src/components/ProtectedRoute.jsx`

```jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
```

**Implementation Steps:**
1. Create `src/context/AuthContext.jsx` (see 1.2)
2. Create `src/components/ProtectedRoute.jsx`
3. Create `src/components/LoadingSpinner.jsx`
4. Update `src/App.jsx` to wrap protected routes

---

### 1.2 Create AuthContext

**Priority:** P0 | **Effort:** M (4-8 hours) | **Dependencies:** 4.1 (Axios interceptors)

**Current State:**
- Login stores token in localStorage directly (`src/pages/LoginPage.jsx:38-39`)
- No global auth state
- No token validation or refresh

**File to create:** `src/context/AuthContext.jsx`

```jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback(async (email, password) => {
    const response = await axiosInstance.post('/api/login', { email, password });
    const { access_token, user: userData } = response.data;
    
    localStorage.setItem('access_token', access_token);
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await axiosInstance.get('/api/me');
        setUser(response.data.user);
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    };
    validateToken();
  }, [logout]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

**Files to update:**
- `src/main.jsx` - Wrap App with AuthProvider
- `src/pages/LoginPage.jsx` - Use `useAuth().login()` instead of direct fetch
- `src/components/AdminHeader.jsx` - Replace mock user with `useAuth().user`
- `src/components/AdminNavbar.jsx` - Add logout handler with `useAuth().logout()`

---

### 1.3 Implement Token Refresh Mechanism

**Priority:** P1 | **Effort:** M (4-8 hours) | **Dependencies:** 1.2, 4.1

**Implementation:**
Add refresh token handling in axios interceptor (see Section 4).

**Recommended Pattern:**
```jsx
// In axiosInstance.js response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const { data } = await axios.post(`${API_URL}/api/refresh`, { refreshToken });

        localStorage.setItem('access_token', data.access_token);
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
```

**Documentation:**
- [JWT Refresh Token Best Practices](https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/)

---

### 1.4 Role-Based Access Control (RBAC)

**Priority:** P2 | **Effort:** M (4-8 hours) | **Dependencies:** 1.1, 1.2

**Current State:**
- Admin routes exist but no role verification
- User roles not utilized

**Implementation:**
```jsx
// Example usage in App.jsx
<Route
  path="/admin/*"
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminLayout />
    </ProtectedRoute>
  }
/>
```

---

## Section 2: State Management

### 2.1 Evaluate Current State Needs

**Priority:** P1 | **Effort:** S (2-4 hours) | **Dependencies:** None

**Current State Analysis:**

| State Type | Current Location | Recommendation |
|------------|------------------|----------------|
| Auth state | localStorage only | AuthContext ✓ |
| UI state (sidebar) | sessionStorage | Keep as-is ✓ |
| Form state | Component useState | React Hook Form |
| Server state | None | React Query |
| Theme | CSS variables | Keep as-is ✓ |

**Recommendation:** Context API is sufficient for this application. No need for Redux/Zustand.

### 2.2 Recommended Context Structure

**Priority:** P2 | **Effort:** M (4-8 hours) | **Dependencies:** 1.2

**Create the following contexts:**

```
src/context/
├── AuthContext.jsx       # User authentication state
├── NotificationContext.jsx  # Toast notifications (wrap react-toastify)
└── index.js              # Export all contexts
```

**File:** `src/context/NotificationContext.jsx`
```jsx
import { createContext, useContext, useCallback } from 'react';
import { toast } from 'react-toastify';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const notify = useCallback((message, type = 'info') => {
    toast[type](message, {
      position: 'top-right',
      autoClose: 3000,
    });
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
```

---

## Section 3: Environment Configuration

### 3.1 Fix Hardcoded API URL

**Priority:** P0 | **Effort:** XS (1-2 hours) | **Dependencies:** None

**Current Issue:**
```javascript
// src/api/axiosInstance.js (Line 4)
baseURL: "https://python-backend-ex9x.onrender.com"  // ❌ Hardcoded

// src/pages/DashboardPage.jsx (Line 4)
const apiBaseURL = "http://127.0.0.1:5000/api";  // ❌ Different hardcoded URL
```

**Solution - Update `src/api/axiosInstance.js`:**
```javascript
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;
```

### 3.2 Create Environment Files

**Priority:** P0 | **Effort:** XS (1-2 hours) | **Dependencies:** 3.1

**Files to create:**

**`.env.example`** (commit to repository)
```env
# API Configuration
VITE_API_URL=http://localhost:5000

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_MOCK_DATA=true
```

**`.env.development`** (local development)
```env
VITE_API_URL=http://localhost:5000
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_MOCK_DATA=true
```

**`.env.production`** (production build)
```env
VITE_API_URL=https://python-backend-ex9x.onrender.com
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_MOCK_DATA=false
```

**Add to `.gitignore`:**
```
.env
.env.local
.env.production.local
```

**Documentation:**
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

## Section 4: API Layer & Data Fetching

### 4.1 Add Axios Interceptors

**Priority:** P0 | **Effort:** M (4-8 hours) | **Dependencies:** 3.1

**Current State:**
`src/api/axiosInstance.js` has no interceptors for:
- Adding auth headers
- Handling errors globally
- Refreshing tokens

**Updated `src/api/axiosInstance.js`:**
```javascript
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000, // 10 second timeout
});

// Request interceptor - Add auth token
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

// Response interceptor - Handle errors
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const message = error.response?.data?.message || 'An error occurred';

        // Handle specific status codes
        switch (error.response?.status) {
            case 401:
                // Token expired - redirect to login
                localStorage.removeItem('access_token');
                window.location.href = '/login';
                break;
            case 403:
                console.error('Access forbidden:', message);
                break;
            case 500:
                console.error('Server error:', message);
                break;
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
```

### 4.2 Standardize API Calls

**Priority:** P1 | **Effort:** M (4-8 hours) | **Dependencies:** 4.1

**Current Issue:**
Mixed usage of `fetch` and `axios`:

| File | Current | Should Use |
|------|---------|------------|
| `LoginPage.jsx` | fetch | axiosInstance |
| `RegisterPage.jsx` | fetch | axiosInstance |
| `DashboardPage.jsx` | direct axios | axiosInstance |

**Example Migration - `LoginPage.jsx`:**
```jsx
// Before (current)
const response = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
});

// After (recommended)
import axiosInstance from '../api/axiosInstance';

const response = await axiosInstance.post('/api/login', { email, password });
```

### 4.3 Consider React Query for Server State

**Priority:** P3 | **Effort:** L (1-3 days) | **Dependencies:** 4.1, 4.2

**Benefits:**
- Automatic caching
- Background refetching
- Optimistic updates
- Loading/error states built-in

**Installation:**
```bash
npm install @tanstack/react-query
```

**Setup in `src/main.jsx`:**
```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
```

**Example Hook:**
```jsx
// src/hooks/useOrders.js
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/api/orders');
      return data;
    },
  });
};
```

**Documentation:**
- [TanStack Query v5](https://tanstack.com/query/latest)

---

## Section 5: Routing & Navigation

### 5.1 Add Route Guards to App.jsx

**Priority:** P1 | **Effort:** S (2-4 hours) | **Dependencies:** 1.1, 1.2

**Current `src/App.jsx` (problematic):**
```jsx
<Route path="/admin" element={<AdminDashboard />} />
<Route path="/admin/orders" element={<AdminOrders />} />
// All routes publicly accessible!
```

**Updated `src/App.jsx`:**
```jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Lazy load admin routes
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected User Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <ProtectedRoute requiredRole="admin">
                <AdminOrders />
              </ProtectedRoute>
            } />

            {/* Error Routes */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}
```

### 5.2 Add Missing Error Pages

**Priority:** P2 | **Effort:** S (2-4 hours) | **Dependencies:** None

**Files to create:**
- `src/pages/NotFoundPage.jsx` - 404 page
- `src/pages/UnauthorizedPage.jsx` - 403 page

**Example `NotFoundPage.jsx`:**
```jsx
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-3 bg-primary text-white rounded-lg"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
```

### 5.3 Implement Lazy Loading

**Priority:** P2 | **Effort:** S (2-4 hours) | **Dependencies:** 5.1

**Already shown in 5.1.** Benefits:
- Smaller initial bundle
- Faster first paint
- Better code splitting

**Documentation:**
- [React Lazy Loading](https://react.dev/reference/react/lazy)

---

## Section 6: Form Handling & Validation

### 6.1 Current Validation Analysis

**Priority:** P2 | **Effort:** S (2-4 hours) | **Dependencies:** None

**Current State - Well Implemented:**
- ✅ Zod schemas in `src/schemas/shipmentValidation.js`
- ✅ Validation utilities in `src/utils/validation.js`
- ✅ Step-based validation for multi-step forms
- ✅ Field-level validation

**Areas for Improvement:**
- Form state management is manual (useState for each field)
- No form-level dirty/touched tracking
- No unified form submission handling

### 6.2 Integrate React Hook Form (Optional Enhancement)

**Priority:** P3 | **Effort:** M (4-8 hours) | **Dependencies:** None

**Installation:**
```bash
npm install react-hook-form @hookform/resolvers
```

**Example Integration with Zod:**
```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema } from '../schemas/shipmentValidation';

function ShipmentForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty }
  } = useForm({
    resolver: zodResolver(step1Schema),
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    await axiosInstance.post('/api/shipments', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('senderName')} />
      {errors.senderName && <span>{errors.senderName.message}</span>}

      <button type="submit" disabled={isSubmitting || !isDirty}>
        Submit
      </button>
    </form>
  );
}
```

**Benefits:**
- Reduced re-renders (uncontrolled inputs)
- Built-in form state management
- Easy integration with existing Zod schemas

**Documentation:**
- [React Hook Form](https://react-hook-form.com/)
- [Zod Resolver](https://github.com/react-hook-form/resolvers#zod)

---

## Section 7: Code Organization & Best Practices

### 7.1 Recommended Folder Structure

**Priority:** P3 | **Effort:** L (1-3 days) | **Dependencies:** None

**Current Structure:**
```
src/
├── api/           # ✅ Good
├── assets/        # ✅ Good
├── components/    # ⚠️ Needs organization
├── config/        # ❌ Empty
├── context/       # ⚠️ Needs AuthContext
├── layouts/       # ✅ Good concept
├── pages/         # ✅ Good
├── schemas/       # ✅ Good
├── styles/        # ✅ Good
└── utils/         # ✅ Good
```

**Recommended Structure:**
```
src/
├── api/
│   ├── axiosInstance.js
│   └── endpoints/         # NEW: API endpoint functions
│       ├── auth.js
│       ├── orders.js
│       └── shipments.js
├── components/
│   ├── common/            # NEW: Reusable components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── Modal.jsx
│   ├── layout/            # NEW: Layout components
│   │   ├── AdminLayout.jsx
│   │   └── MainLayout.jsx
│   └── features/          # NEW: Feature-specific components
│       ├── admin/
│       └── dashboard/
├── config/
│   └── constants.js       # NEW: App constants
├── context/
│   ├── AuthContext.jsx
│   └── index.js
├── hooks/                 # NEW: Custom hooks
│   ├── useAuth.js
│   ├── useOrders.js
│   └── useLocalStorage.js
├── pages/
├── schemas/
├── styles/
└── utils/
```

### 7.2 Extract Reusable Components

**Priority:** P2 | **Effort:** M (4-8 hours) | **Dependencies:** None

**Components to Extract:**

1. **Button Component** - Standardize button styling
```jsx
// src/components/common/Button.jsx
export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  ...props
}) => {
  const baseStyles = "font-semibold rounded-xl transition-all";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
      disabled={loading}
      {...props}
    >
      {loading ? <LoadingSpinner size="sm" /> : children}
    </button>
  );
};
```

2. **Input Component** - Already partially exists in `AdminForm.jsx` as `FormField`

### 7.3 Create Custom Hooks

**Priority:** P2 | **Effort:** S (2-4 hours) | **Dependencies:** None

**Hooks to Create:**

```jsx
// src/hooks/useLocalStorage.js
export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback((newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  }, [key]);

  return [value, setStoredValue];
};
```

```jsx
// src/hooks/useDebounce.js
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
```

---

## Section 8: Performance Optimization

### 8.1 Add React.memo and Optimization Hooks

**Priority:** P2 | **Effort:** M (4-8 hours) | **Dependencies:** None

**Current Good Practice Found:**
`src/pages/admin/AdminForm.jsx` already uses `memo` correctly:
```jsx
const FormField = memo(({ ... }) => { ... });
```

**Components to Optimize:**

| Component | Issue | Solution |
|-----------|-------|----------|
| `AdminNavbar.jsx` | Re-renders on parent state change | Wrap with `memo` |
| `AdminHeader.jsx` | Search input causes re-renders | `useCallback` for handlers |
| `IconLibrary.jsx` | Icons recreated each render | Already optimized ✓ |

**Example Optimization:**
```jsx
// Before
const AdminNavbar = () => { ... };

// After
const AdminNavbar = memo(() => { ... });

// With comparison function if needed
const AdminNavbar = memo(
  (props) => { ... },
  (prevProps, nextProps) => prevProps.isExpanded === nextProps.isExpanded
);
```

### 8.2 Implement Code Splitting

**Priority:** P2 | **Effort:** S (2-4 hours) | **Dependencies:** 5.1

Already covered in Section 5.3. Key routes to lazy load:
- All admin pages
- Dashboard page
- Charts/heavy components

### 8.3 Optimize Bundle Size

**Priority:** P3 | **Effort:** S (2-4 hours) | **Dependencies:** None

**Analysis Commands:**
```bash
# Install bundle analyzer
npm install -D rollup-plugin-visualizer

# Add to vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true }),
  ],
});
```

**Potential Optimizations:**
1. Import only needed Chart.js components
2. Tree-shake unused Tailwind classes (already configured)
3. Consider dynamic imports for heavy libraries

---

## Section 9: Error Handling & User Feedback

### 9.1 Implement Global Error Boundary

**Priority:** P2 | **Effort:** S (2-4 hours) | **Dependencies:** None

**File to create:** `src/components/ErrorBoundary.jsx`

```jsx
import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-gray-800">Something went wrong</h1>
            <p className="text-gray-600 mt-2">Please refresh the page or try again later.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-lg"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Usage in `main.jsx`:**
```jsx
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
```

### 9.2 Add Loading States & Skeleton Screens

**Priority:** P2 | **Effort:** M (4-8 hours) | **Dependencies:** None

**File to create:** `src/components/common/Skeleton.jsx`

```jsx
export const Skeleton = ({ className = '', variant = 'text' }) => {
  const baseStyles = 'animate-pulse bg-gray-200 rounded';
  const variants = {
    text: 'h-4 w-full',
    title: 'h-8 w-3/4',
    avatar: 'h-12 w-12 rounded-full',
    card: 'h-32 w-full rounded-xl',
  };

  return <div className={`${baseStyles} ${variants[variant]} ${className}`} />;
};

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4">
        <Skeleton className="w-1/4" />
        <Skeleton className="w-1/4" />
        <Skeleton className="w-1/4" />
        <Skeleton className="w-1/4" />
      </div>
    ))}
  </div>
);
```

### 9.3 Standardize Toast Notifications

**Priority:** P2 | **Effort:** S (2-4 hours) | **Dependencies:** 2.2

**Current State:**
- react-toastify installed but not consistently used
- Some components use `alert()` instead

**Files to Update:**
- `src/pages/LoginPage.jsx` - Replace `alert()` with toast
- `src/pages/RegisterPage.jsx` - Replace `alert()` with toast

**Example:**
```jsx
// Before
alert(data.message || 'Login failed');

// After
import { toast } from 'react-toastify';
toast.error(data.message || 'Login failed');
```

**Add ToastContainer to `main.jsx`:**
```jsx
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

root.render(
  <>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
    />
  </>
);
```

---

## Section 10: Security Best Practices

### 10.1 Token Storage Security

**Priority:** P0 | **Effort:** M (4-8 hours) | **Dependencies:** 1.2

**Current Issue:**
```jsx
// src/pages/LoginPage.jsx - Line 38-39
localStorage.setItem('access_token', data.access_token);
localStorage.setItem('user', JSON.stringify(data.user));
```

**Risks:**
- localStorage is accessible via XSS attacks
- Token persists indefinitely

**Recommended Approach:**
1. **Short-lived access tokens** (15-30 minutes)
2. **HTTP-only cookies for refresh tokens** (requires backend support)
3. **Memory-only access tokens** as a more secure alternative:

```jsx
// AuthContext.jsx - Keep token in memory only
const [accessToken, setAccessToken] = useState(null);

// Persist refresh token in HTTP-only cookie (backend sets this)
// Access token stays in memory only

const login = async (email, password) => {
  const response = await axiosInstance.post('/api/login', {
    email,
    password
  }, { withCredentials: true }); // Important for cookies

  setAccessToken(response.data.access_token);
  setUser(response.data.user);
};
```

### 10.2 Input Sanitization

**Priority:** P2 | **Effort:** S (2-4 hours) | **Dependencies:** None

**Current State:**
Zod validation handles type checking but not sanitization.

**Add Sanitization:**
```jsx
// src/utils/sanitize.js
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML
    .slice(0, 1000); // Limit length
};

// Usage in form handlers
const handleChange = (e) => {
  const sanitized = sanitizeInput(e.target.value);
  setFormData(prev => ({ ...prev, [e.target.name]: sanitized }));
};
```

### 10.3 Content Security Policy

**Priority:** P3 | **Effort:** S (2-4 hours) | **Dependencies:** None

**Add to `index.html`:**
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self';
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
               font-src 'self' https://fonts.gstatic.com;
               img-src 'self' data: https:;
               connect-src 'self' https://python-backend-ex9x.onrender.com;">
```

---

## Section 11: Testing Strategy

### 11.1 Set Up Testing Infrastructure

**Priority:** P3 | **Effort:** M (4-8 hours) | **Dependencies:** None

**Installation:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

**Configure `vite.config.js`:**
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
  },
});
```

**Create `src/test/setup.js`:**
```javascript
import '@testing-library/jest-dom';
```

**Add to `package.json`:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

### 11.2 Critical User Flows to Test

**Priority:** P3 | **Effort:** L (1-3 days) | **Dependencies:** 11.1

| Flow | Priority | Components |
|------|----------|------------|
| Login | High | LoginPage, AuthContext |
| Registration | High | RegisterPage (all 3 steps) |
| Protected Route | High | ProtectedRoute |
| Form Validation | Medium | Zod schemas, validation utils |
| Admin Navigation | Medium | AdminNavbar, AdminHeader |

**Example Test - Login Flow:**
```jsx
// src/pages/__tests__/LoginPage.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import LoginPage from '../LoginPage';

describe('LoginPage', () => {
  const renderLoginPage = () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('renders login form', () => {
    renderLoginPage();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    renderLoginPage();
    const emailInput = screen.getByLabelText(/email/i);

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });
});
```

### 11.3 E2E Testing (Future)

**Priority:** P3 | **Effort:** XL (3-5 days) | **Dependencies:** 11.1, 11.2

**Recommended Tool:** Playwright or Cypress

```bash
npm install -D @playwright/test
npx playwright install
```

**Documentation:**
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright](https://playwright.dev/)

---

## Section 12: Accessibility (a11y)

### 12.1 Accessibility Audit

**Priority:** P3 | **Effort:** M (4-8 hours) | **Dependencies:** None

**Current Issues Found:**

| Component | Issue | Fix |
|-----------|-------|-----|
| `AdminNavbar.jsx` | ✅ Good ARIA labels on toggle | - |
| `AdminHeader.jsx` | Missing ARIA on dropdowns | Add `aria-expanded`, `aria-haspopup` |
| `LoginPage.jsx` | Missing form labels | Associate labels with inputs |
| `LandingPage.jsx` | Missing alt text on logo | Add `alt` attribute |
| All modals | Missing focus trap | Implement focus management |

### 12.2 Fix Critical Issues

**Priority:** P3 | **Effort:** S (2-4 hours) | **Dependencies:** None

**1. Fix Image Alt Text:**
```jsx
// src/pages/LandingPage.jsx - Line 36
// Before
<img src="src/assets/logo_h.png"></img>

// After
<img src={logoImage} alt="ShipMyParcel Logo" />
```

**2. Add ARIA to Dropdowns:**
```jsx
// src/components/AdminHeader.jsx
<button
  onClick={() => setShowDropdown(!showDropdown)}
  aria-expanded={showDropdown}
  aria-haspopup="menu"
  aria-label="User menu"
>
```

**3. Add Skip Navigation Link:**
```jsx
// Add to layout components
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
             bg-primary text-white px-4 py-2 rounded z-50"
>
  Skip to main content
</a>

// Add id to main content area
<main id="main-content">
```

### 12.3 Keyboard Navigation

**Priority:** P3 | **Effort:** M (4-8 hours) | **Dependencies:** 12.2

**Components Needing Keyboard Support:**
- Dropdown menus (Escape to close, Arrow keys to navigate)
- Modal dialogs (Tab trap, Escape to close)
- Sidebar navigation

**Example - Keyboard Accessible Dropdown:**
```jsx
const handleKeyDown = (e) => {
  switch (e.key) {
    case 'Escape':
      setShowDropdown(false);
      buttonRef.current?.focus();
      break;
    case 'ArrowDown':
      e.preventDefault();
      // Focus next item
      break;
    case 'ArrowUp':
      e.preventDefault();
      // Focus previous item
      break;
  }
};
```

### 12.4 Color Contrast

**Priority:** P3 | **Effort:** S (2-4 hours) | **Dependencies:** None

**Check CSS Variables:**
```scss
// src/index.scss - Verify contrast ratios
--color-primary: #006666;     // Check against white text
--sidebar-text-muted: #6b7280; // May need darker shade
```

**Tools:**
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Browser DevTools Accessibility panel

**Documentation:**
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Accessibility](https://react.dev/reference/react-dom/components/common#aria-props)

---

## Implementation Timeline

### Week 1-2: P0 Critical Items (Foundation)

| Day | Task | Effort |
|-----|------|--------|
| 1 | [3.1] Fix hardcoded API URL, create .env files | XS |
| 1-2 | [4.1] Add Axios interceptors | M |
| 2-3 | [1.2] Create AuthContext | M |
| 3-4 | [1.1] Create ProtectedRoute component | S |
| 4-5 | [5.1] Add route guards to App.jsx | S |

### Week 3-4: P1 High Priority Items

| Day | Task | Effort |
|-----|------|--------|
| 1-2 | [4.2] Standardize all API calls to axios | M |
| 2-3 | [1.3] Implement token refresh mechanism | M |
| 3-4 | [2.1] Set up context structure | M |
| 4-5 | Update LoginPage & RegisterPage to use AuthContext | M |

### Week 5-6: P2 Medium Priority Items

| Day | Task | Effort |
|-----|------|--------|
| 1-2 | [9.1] Implement global error boundary | S |
| 2-3 | [9.2] Add loading states and skeletons | M |
| 3-4 | [9.3] Standardize toast notifications | S |
| 4-5 | [8.1] Add React.memo optimizations | M |
| 5-6 | [5.2] Create NotFoundPage and UnauthorizedPage | S |

### Week 7+: P3 Nice to Have Items

- Testing infrastructure setup
- React Hook Form integration
- Code organization refactoring
- Accessibility improvements
- React Query integration

---

## Dependency Graph

```
[3.1] Environment Config
    └── [4.1] Axios Interceptors
            └── [1.2] AuthContext
                    ├── [1.1] ProtectedRoute
                    │       └── [5.1] Route Guards
                    │               └── [1.4] RBAC
                    └── [4.2] Standardize API Calls
                            └── [1.3] Token Refresh

[Independent Tasks - Can Start Anytime]
├── [7.1] Code Organization
├── [9.1] Error Boundary
├── [11.1] Testing Infrastructure
└── [12.1] Accessibility Audit
```

---

## Quick Reference: Files to Create

| File | Section | Priority |
|------|---------|----------|
| `src/context/AuthContext.jsx` | 1.2 | P0 |
| `src/components/ProtectedRoute.jsx` | 1.1 | P0 |
| `src/components/LoadingSpinner.jsx` | 1.1 | P0 |
| `.env.example` | 3.2 | P0 |
| `.env.development` | 3.2 | P0 |
| `.env.production` | 3.2 | P0 |
| `src/context/NotificationContext.jsx` | 2.2 | P2 |
| `src/components/ErrorBoundary.jsx` | 9.1 | P2 |
| `src/components/common/Skeleton.jsx` | 9.2 | P2 |
| `src/components/common/Button.jsx` | 7.2 | P2 |
| `src/pages/NotFoundPage.jsx` | 5.2 | P2 |
| `src/pages/UnauthorizedPage.jsx` | 5.2 | P2 |
| `src/hooks/useLocalStorage.js` | 7.3 | P2 |
| `src/hooks/useDebounce.js` | 7.3 | P2 |
| `src/utils/sanitize.js` | 10.2 | P2 |
| `src/test/setup.js` | 11.1 | P3 |

---

## Quick Reference: Files to Modify

| File | Changes | Priority |
|------|---------|----------|
| `src/api/axiosInstance.js` | Add interceptors, use env var | P0 |
| `src/main.jsx` | Add AuthProvider, ToastContainer, ErrorBoundary | P0/P2 |
| `src/App.jsx` | Add route guards, lazy loading | P1 |
| `src/pages/LoginPage.jsx` | Use AuthContext, axios, toast | P1 |
| `src/pages/RegisterPage.jsx` | Use axios, toast | P1 |
| `src/pages/DashboardPage.jsx` | Remove hardcoded URL, add auth check | P1 |
| `src/components/AdminHeader.jsx` | Use real auth state | P1 |
| `src/components/AdminNavbar.jsx` | Add logout handler, memo | P1/P2 |
| `src/pages/LandingPage.jsx` | Fix image alt text | P3 |
| `vite.config.js` | Add test config | P3 |

---

## Additional Resources

### Official Documentation
- [React 18 Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router v6](https://reactrouter.com/en/main)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zod Documentation](https://zod.dev/)

### Security Resources
- [OWASP React Security Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/React_Security_Cheat_Sheet.html)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

### Performance Resources
- [React Performance Optimization](https://react.dev/learn/thinking-in-react#step-5-add-inverse-data-flow)
- [Vite Build Optimization](https://vitejs.dev/guide/build.html)

---

*Document created: 2026-02-04*
*Last updated: 2026-02-04*
*Author: AI Assistant based on codebase audit*

