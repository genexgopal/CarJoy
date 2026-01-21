import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = ({ onBack, embedded = false }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

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
            const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';

            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));

                navigate('/dashboard');
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Lock icon component
    const LockIcon = () => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="#735dff" strokeWidth="2" />
            <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="#735dff" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="16" r="1.5" fill="#735dff" />
        </svg>
    );

    // Eye icon for password visibility
    const EyeIcon = ({ visible }) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

    // Embedded mode - simple form for use inside LandingPage card
    if (embedded) {
        return (
            <div className="w-full">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Username Field */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">
                            User Name
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-sm"
                                style={{ '--tw-ring-color': 'var(--color-primary)' }}
                                placeholder="Enter User Name"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
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
                                style={{ color: '#f97316' }}
                            >
                                Forget password ?
                            </a>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-3 pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-sm"
                                style={{ '--tw-ring-color': 'var(--color-primary)' }}
                                placeholder="password"
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
                            Remember password ?
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
                                <span>Login to My Account</span>
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
                            OR Signin With
                        </span>
                    </div>
                </div>

                {/* Social Buttons */}
                <div className="flex justify-center gap-3">
                    <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                        <span className="text-white text-sm font-bold">G</span>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center hover:bg-orange-600 transition-colors">
                        <span className="text-white text-sm">✉</span>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 transition-colors">
                        <span className="text-white text-sm">📞</span>
                    </button>
                </div>

                {/* Sign Up Link */}
                <p className="text-center mt-6 text-sm text-gray-500">
                    Dont have an account?{" "}
                    <Link to="/register" className="font-semibold text-blue-600 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        );
    }

    // Full page two-column layout matching the screenshot design
    return (
        <div className="min-h-screen flex flex-col md:flex-row overflow-hidden relative">
            {/* CSS Keyframe animations */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(-5deg); }
                }
                @keyframes glow {
                    0%, 100% { box-shadow: 0 0 5px rgba(255,255,255,0.3); }
                    50% { box-shadow: 0 0 20px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.4); }
                }
                @keyframes slide-in {
                    0% { opacity: 0; transform: translateX(-10px); }
                    100% { opacity: 1; transform: translateX(0); }
                }
                @keyframes pulse-subtle {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 0.8; }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
                .animate-glow { animation: glow 2s ease-in-out infinite; }
                .animate-slide-in { animation: slide-in 0.3s ease-out forwards; }
                .animate-pulse-subtle { animation: pulse-subtle 3s ease-in-out infinite; }
            `}</style>

            {/* Background pattern - diagonal lines */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]"
                    style={{
                        backgroundImage: `repeating-linear-gradient(
                            45deg,
                            #735dff 0px,
                            #735dff 1px,
                            transparent 1px,
                            transparent 20px
                        )`
                    }}
                ></div>
            </div>

            {/* --- LEFT SIDE: THE BRAND PANEL --- */}
            <div className="hidden md:flex w-full md:w-[45%] relative overflow-hidden flex-col justify-between p-8"
                style={{
                    background: 'linear-gradient(135deg, #735dff 0%, #5b45e0 50%, #4a37c9 100%)'
                }}
            >
                {/* Animated floating background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Floating circles */}
                    <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full animate-float blur-xl"></div>
                    <div className="absolute bottom-32 right-10 w-24 h-24 bg-white/5 rounded-full animate-float-delayed blur-lg"></div>
                    <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full animate-float blur-md" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-purple-300/10 rounded-full animate-float-delayed blur-lg" style={{ animationDelay: '2s' }}></div>

                    {/* Diagonal pattern overlay */}
                    <div className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `repeating-linear-gradient(
                                45deg,
                                transparent 0px,
                                transparent 10px,
                                rgba(255,255,255,0.1) 10px,
                                rgba(255,255,255,0.1) 20px
                            )`
                        }}
                    ></div>
                </div>

                {/* Top content */}
                <div className="relative z-10">
                    {/* Interactive Logo */}
                    <div
                        className="flex items-center space-x-3 cursor-pointer mb-12 group w-fit"
                        onClick={handleBack}
                    >
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30 group-hover:shadow-lg group-hover:shadow-white/20 animate-glow">
                            <span className="text-white font-bold text-lg transition-transform duration-300 group-hover:scale-110">S</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white text-lg font-semibold transition-all duration-300 group-hover:tracking-wider">ShipMyParcel</span>
                            <span className="text-purple-200/60 text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 -mt-1">← Back to home</span>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-white leading-tight mb-4">
                        Welcome<br />
                        <span className="text-purple-200 inline-block animate-slide-in">Back!</span>
                    </h2>
                    <p className="text-purple-100/70 text-sm max-w-xs">
                        Sign in to access your logistics dashboard and manage your shipments.
                    </p>
                </div>

                {/* Center content - Feature highlights */}
                <div className="relative z-10 space-y-4">
                    {[
                        { icon: "📦", text: "Track all your shipments in real-time" },
                        { icon: "📊", text: "Access detailed analytics & reports" },
                        { icon: "🚀", text: "Streamline your delivery operations" }
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center space-x-3 group cursor-default"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <span className="text-lg group-hover:scale-125 transition-transform duration-300">{item.icon}</span>
                            <span className="text-white/70 text-sm group-hover:text-white transition-colors duration-300">{item.text}</span>
                        </div>
                    ))}
                </div>

                {/* Enhanced bottom section */}
                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-purple-100/50 group cursor-default">
                        <span className="text-lg group-hover:animate-bounce transition-transform">🛡️</span>
                        <span className="group-hover:text-purple-100/70 transition-colors">Secured with ISO 27001</span>
                    </div>

                    {/* Animated decorative element */}
                    <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-subtle"></div>
                        <span className="text-xs text-white/50">System Online</span>
                    </div>
                </div>
            </div>

            {/* --- RIGHT SIDE: THE FORM PANEL --- */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                        <div
                            className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mb-3"
                            style={{ borderColor: '#735dff', borderTopColor: 'transparent' }}
                        ></div>
                        <p className="text-sm font-medium text-gray-600">Signing you in...</p>
                    </div>
                )}

                <div className="max-w-sm w-full">
                    {/* Lock icon at top */}
                    <div className="flex justify-center mb-6">
                        <div className="w-14 h-14 bg-purple-50 rounded-xl border-2 border-purple-100 flex items-center justify-center">
                            <LockIcon />
                        </div>
                    </div>

                    {/* Sign In heading */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">Sign In</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                User Name
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all text-gray-700 placeholder:text-gray-400"
                                placeholder="Enter User Name"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Password
                                </label>
                                <a href="#" className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors">
                                    Forget password ?
                                </a>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full px-4 py-3 pr-12 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all text-gray-700 placeholder:text-gray-400"
                                    placeholder="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <EyeIcon visible={showPassword} />
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 border-gray-300 rounded text-purple-600 focus:ring-purple-500"
                                style={{ accentColor: '#735dff' }}
                            />
                            <label htmlFor="remember" className="text-sm text-gray-600">
                                Remember password ?
                            </label>
                        </div>

                        {/* Social Login Separator */}
                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-4 bg-white text-gray-400 text-sm">
                                    OR Signin With
                                </span>
                            </div>
                        </div>

                        {/* Social Buttons */}
                        <div className="flex justify-center gap-4">
                            <button
                                type="button"
                                className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors shadow-md"
                            >
                                <span className="text-white font-bold">G</span>
                            </button>
                            <button
                                type="button"
                                className="w-11 h-11 rounded-full bg-orange-500 flex items-center justify-center hover:bg-orange-600 transition-colors shadow-md"
                            >
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                className="w-11 h-11 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 transition-colors shadow-md"
                            >
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full text-white py-3.5 rounded-lg font-semibold text-base transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-70 shadow-lg"
                            style={{ backgroundColor: '#735dff' }}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <p className="text-center mt-6 text-sm text-gray-500">
                        Dont have an account?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-blue-600 hover:underline transition-colors"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;