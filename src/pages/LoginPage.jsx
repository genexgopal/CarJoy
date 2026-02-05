import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import loginBg from "../assets/images/login_bg.jpg";

const LoginPage = ({ onBack, embedded = false }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    // Get the redirect path from location state, or default to dashboard
    const from = location.state?.from?.pathname || '/dashboard';

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate('/');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login(email, password);
            toast.success('Login successful! Welcome back.');
            navigate(from, { replace: true });
        } catch (error) {
            toast.error(error.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Eye icon for password visibility toggle
    const EyeIcon = ({ visible }) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {visible ? (
                <>
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="3" stroke="#9ca3af" strokeWidth="2" />
                </>
            ) : (
                <>
                    <path d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.68192 3.96914 7.65663 6.06 6.06M9.9 4.24C10.5883 4.0789 11.2931 3.99836 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2048 20.84 15.19M14.12 14.12C13.8454 14.4148 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.4811 9.80385 14.1962C9.51897 13.9113 9.29439 13.5719 9.14351 13.1984C8.99262 12.8248 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2218 9.18488 10.8538C9.34884 10.4859 9.58525 10.1546 9.88 9.88" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M1 1L23 23" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </>
            )}
        </svg>
    );

    // Social icons
    const LinkedInIcon = () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
    );

    const TwitterIcon = () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
    );

    const FacebookIcon = () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
    );

    // Embedded mode - simple form for use inside LandingPage card
    if (embedded) {
        return (
            <div className="w-full">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-sm"
                                style={{ '--tw-ring-color': 'var(--color-primary)' }}
                                placeholder="Test@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <div className="flex justify-between mb-1 ml-1">
                            <label className="block text-sm font-medium text-slate-700">
                                Password
                            </label>
                            <a
                                href="#"
                                className="text-xs font-semibold transition-colors"
                                style={{ color: 'var(--color-primary)' }}
                            >
                                Forgot password?
                            </a>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-3 pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-sm"
                                style={{ '--tw-ring-color': 'var(--color-primary)' }}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <EyeIcon visible={showPassword} />
                            </button>
                        </div>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center space-x-2 ml-1">
                        <input
                            type="checkbox"
                            id="remember-embedded"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 border-gray-300 rounded"
                            style={{ accentColor: 'var(--color-primary)' }}
                        />
                        <label htmlFor="remember-embedded" className="text-sm text-gray-600">
                            Remember password
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full text-white font-semibold py-3 px-4 rounded-lg shadow-md active:transform active:scale-[0.98] transition-all duration-150 flex items-center justify-center space-x-2 disabled:opacity-70"
                        style={{
                            backgroundColor: 'var(--color-primary)',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
                    >
                        {isLoading ? (
                            <span>Signing in...</span>
                        ) : (
                            <>
                                <span>Sign in</span>
                                <span className="material-icons text-sm">arrow_forward</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Social Login Separator */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-400 text-xs font-medium">
                            Or Sign in with
                        </span>
                    </div>
                </div>

                {/* Social Buttons */}
                <div className="flex justify-center gap-3">
                    <button type="button" className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-sm text-gray-600">
                        <LinkedInIcon /> Linkedin
                    </button>
                    <button type="button" className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-sm text-gray-600">
                        <TwitterIcon /> twitter
                    </button>
                    <button type="button" className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-sm text-gray-600">
                        <FacebookIcon /> facebook
                    </button>
                </div>

                {/* Sign Up Link */}
                <p className="text-center mt-6 text-sm text-gray-500">
                    Don't have account?{" "}
                    <Link to="/register" className="font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>
                        Create Account
                    </Link>
                </p>
            </div>
        );
    }

    // Full page centered layout matching the screenshot design
    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative"
            style={{
                backgroundImage: `url(${loginBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Loading overlay */}
            {isLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                    <div
                        className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mb-3"
                        style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
                    ></div>
                    <p className="text-sm font-medium text-gray-600">Signing you in...</p>
                </div>
            )}

            {/* Logo at top */}
            <div
                className="flex items-center gap-2 mb-8 cursor-pointer group"
                onClick={handleBack}
            >
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: 'var(--yellow-color)' }}
                >
                    <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-xl font-bold" style={{ color: 'var(--color-secondary)' }}>
                    CarJoy
                </span>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8 md:p-10">
                {/* Heading */}
                <div className="mb-6">
                    <h1 className="text-xl font-semibold text-gray-800 mb-1">Sign in to account</h1>
                    <p className="text-sm text-gray-500">Enter your email & password to login</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 transition-all text-gray-700 placeholder:text-gray-400"
                            style={{ '--tw-ring-color': 'var(--color-primary-ring)' }}
                            placeholder="Test@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-3 pr-16 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 transition-all text-gray-700 placeholder:text-gray-400"
                                style={{ '--tw-ring-color': 'var(--color-primary-ring)' }}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-sm font-medium transition-colors"
                                style={{ color: 'var(--color-primary)' }}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 'hide' : 'show'}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 border-gray-300 rounded"
                                style={{ accentColor: 'var(--color-primary)' }}
                            />
                            <label htmlFor="remember" className="text-sm text-gray-600">
                                Remember password
                            </label>
                        </div>
                        <a
                            href="#"
                            className="text-sm font-medium transition-colors hover:underline"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            Forgot password?
                        </a>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full text-white py-3 rounded-md font-medium text-base transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-70"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>

                    {/* Social Login Separator */}
                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-4 bg-white text-gray-500 text-sm">
                                Or Sign in with
                            </span>
                        </div>
                    </div>

                    {/* Social Buttons */}
                    <div className="flex justify-center gap-3">
                        <button
                            type="button"
                            className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-sm text-gray-600"
                        >
                            <LinkedInIcon /> Linkedin
                        </button>
                        <button
                            type="button"
                            className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-sm text-gray-600"
                        >
                            <TwitterIcon /> twitter
                        </button>
                        <button
                            type="button"
                            className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-sm text-gray-600"
                        >
                            <FacebookIcon /> facebook
                        </button>
                    </div>
                </form>

                {/* Sign Up Link */}
                <p className="text-center mt-6 text-sm text-gray-500">
                    Don't have account?{" "}
                    <Link
                        to="/register"
                        className="font-semibold hover:underline transition-colors"
                        style={{ color: 'var(--color-primary)' }}
                    >
                        Create Account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;