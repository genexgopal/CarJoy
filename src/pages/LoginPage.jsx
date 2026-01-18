import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = ({ onBack, embedded = false }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
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
                body: JSON.stringify({ email, password })
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

    // Embedded mode - simple form for use inside LandingPage card
    if (embedded) {
        return (
            <div className="w-full">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <span className="material-icons text-sm">email</span>
                            </span>
                            <input
                                type="email"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f26522] focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-sm"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <div className="flex justify-between mb-1 ml-1">
                            <label className="block text-sm font-bold text-slate-700">
                                Password
                            </label>
                            <a href="#" className="text-xs font-semibold text-[#003366] hover:text-[#f26522]">
                                Forgot Password?
                            </a>
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <span className="material-icons text-sm">lock</span>
                            </span>
                            <input
                                type="password"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f26522] focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center space-x-2 ml-1">
                        <input
                            type="checkbox"
                            id="remember-embedded"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 text-[#f26522] border-gray-300 rounded focus:ring-[#f26522]"
                        />
                        <label htmlFor="remember-embedded" className="text-sm text-gray-600">
                            Keep me logged in
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#f26522] text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-[#d4541a] active:transform active:scale-[0.98] transition-all duration-150 flex items-center justify-center space-x-2 disabled:opacity-70"
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
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-400 uppercase tracking-widest text-[10px] font-bold">
                            Or login with
                        </span>
                    </div>
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <img src="https://www.svgrepo.com/show/355037/google.svg" className="h-4 w-4 mr-2" alt="Google" />
                        <span className="text-xs font-bold text-gray-600">Google</span>
                    </button>
                    <button className="flex items-center justify-center py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <img src="https://www.svgrepo.com/show/448234/linkedin.svg" className="h-4 w-4 mr-2" alt="LinkedIn" />
                        <span className="text-xs font-bold text-gray-600">LinkedIn</span>
                    </button>
                </div>
            </div>
        );
    }

    // Full page two-column layout
    return (
        <div className="min-h-screen bg-[#FBFDFF] flex flex-col md:flex-row font-sans overflow-hidden">
            {/* --- LEFT SIDE: THE BRAND PANEL --- */}
            <div className="w-full md:w-[450px] bg-[#003366] p-12 text-white flex flex-col justify-between relative overflow-hidden">
                {/* Decorative background circle */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#f26522] rounded-full opacity-10 blur-3xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center space-x-3 cursor-pointer mb-16" onClick={handleBack}>
                        <div className="w-10 h-10 bg-[#f26522] rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <span className="text-2xl font-black tracking-tighter uppercase">ShipMy<span className="text-[#f26522]">Parcel</span></span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black leading-[1.1] mb-6">
                        Welcome <br />
                        <span className="text-[#f26522]">Back!</span>
                    </h2>
                    <p className="text-slate-400 font-medium max-w-xs leading-relaxed">
                        Sign in to access your dashboard and manage your shipments with ease.
                    </p>
                </div>

                {/* Feature Highlights */}
                <div className="space-y-6 relative z-10">
                    {[
                        { icon: "📦", label: "Track Shipments" },
                        { icon: "📊", label: "View Analytics" },
                        { icon: "⚡", label: "Quick Actions" }
                    ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 group">
                            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg bg-[#f26522]/20 border-2 border-[#f26522]/30">
                                {item.icon}
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-white">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] relative z-10">
                    🛡️ ISO 27001 SECURED DATA
                </div>
            </div>

            {/* --- RIGHT SIDE: THE FORM PANEL --- */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-24 relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 border-4 border-[#f26522] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#003366]">Signing you in...</p>
                    </div>
                )}

                <div className="max-w-md w-full">
                    <button
                        onClick={handleBack}
                        className="group text-[10px] font-black text-slate-400 hover:text-[#f26522] transition-colors uppercase tracking-[0.2em] mb-12 flex items-center"
                    >
                        <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
                        Return Home
                    </button>

                    <h3 className="text-3xl font-black text-[#003366] tracking-tight mb-8">Sign in to your account</h3>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-[20px] focus:border-[#f26522] focus:bg-white outline-none transition-all font-bold text-slate-700"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1 mr-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Password
                                </label>
                                <a href="#" className="text-[10px] font-black text-[#003366] hover:text-[#f26522] uppercase tracking-widest transition-colors">
                                    Forgot Password?
                                </a>
                            </div>
                            <input
                                type="password"
                                className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-[20px] focus:border-[#f26522] focus:bg-white outline-none transition-all font-bold text-slate-700"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center space-x-3 ml-1">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 text-[#f26522] border-2 border-slate-200 rounded focus:ring-[#f26522] accent-[#f26522]"
                            />
                            <label htmlFor="remember" className="text-xs font-bold text-slate-500">
                                Keep me logged in
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full bg-[#f26522] text-white py-5 rounded-[20px] font-black text-xs tracking-[0.2em] hover:bg-[#d4541a] transition-all shadow-2xl hover:scale-[1.02] active:scale-95 uppercase"
                            >
                                Sign In
                            </button>
                        </div>
                    </form>

                    {/* Social Login Separator */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t-2 border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-4 bg-[#FBFDFF] text-slate-400 uppercase tracking-[0.2em] text-[10px] font-black">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    {/* Social Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] hover:border-[#f26522] hover:bg-white transition-all group">
                            <img src="https://www.svgrepo.com/show/355037/google.svg" className="h-5 w-5 mr-3" alt="Google" />
                            <span className="text-xs font-black text-slate-600 group-hover:text-[#003366]">Google</span>
                        </button>
                        <button className="flex items-center justify-center py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] hover:border-[#f26522] hover:bg-white transition-all group">
                            <img src="https://www.svgrepo.com/show/448234/linkedin.svg" className="h-5 w-5 mr-3" alt="LinkedIn" />
                            <span className="text-xs font-black text-slate-600 group-hover:text-[#003366]">LinkedIn</span>
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <p className="text-center mt-8 text-xs font-bold text-slate-400">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-[#f26522] hover:text-[#003366] font-black transition-colors">
                            Create one now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;