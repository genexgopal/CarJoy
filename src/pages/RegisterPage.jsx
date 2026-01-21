import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = ({ onBack, onSuccess }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isloading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        businessName: "",
        email: "",
        phone: "",
        storeType: "Shopify",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

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

        if (!formData.email.includes('@')) {
            alert('Please enter a valid email');
            setIsLoading(false);
            return;
        }

        try {
            const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';

            const response = await fetch(`${API_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    businessName: formData.businessName,
                    storeType: formData.storeType,
                    phone: formData.phone,
                    password: formData.password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            const data = await response.json();

            if (typeof onSuccess === 'function') {
                onSuccess({ userData: formData, apiResponse: data });
            } else {
                console.log('Registration successful (no onSuccess prop):', data);
                alert('Registration successful!');
                navigate('/');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert(error.message || 'Unable to register. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // User icon component
    const UserIcon = () => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="4" stroke="#735dff" strokeWidth="2" />
            <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke="#735dff" strokeWidth="2" strokeLinecap="round" />
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

    // Step descriptions for tooltips
    const stepDescriptions = {
        1: "Enter your name and email to get started",
        2: "Tell us about your business and store",
        3: "Secure your account with a strong password"
    };

    const [hoveredStep, setHoveredStep] = useState(null);

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
                @keyframes pulse-ring {
                    0% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
                @keyframes checkmark-draw {
                    0% { stroke-dashoffset: 24; }
                    100% { stroke-dashoffset: 0; }
                }
                @keyframes slide-in {
                    0% { opacity: 0; transform: translateX(-10px); }
                    100% { opacity: 1; transform: translateX(0); }
                }
                @keyframes glow {
                    0%, 100% { box-shadow: 0 0 5px rgba(255,255,255,0.3); }
                    50% { box-shadow: 0 0 20px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.4); }
                }
                @keyframes progress-fill {
                    0% { height: 0%; }
                    100% { height: 100%; }
                }
                @keyframes tooltip-appear {
                    0% { opacity: 0; transform: translateX(10px); }
                    100% { opacity: 1; transform: translateX(0); }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
                .animate-pulse-ring { animation: pulse-ring 2s ease-out infinite; }
                .animate-checkmark { animation: checkmark-draw 0.5s ease-out forwards; }
                .animate-slide-in { animation: slide-in 0.3s ease-out forwards; }
                .animate-glow { animation: glow 2s ease-in-out infinite; }
                .animate-tooltip { animation: tooltip-appear 0.2s ease-out forwards; }
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
                        Start your<br />
                        <span className="text-purple-200 inline-block animate-slide-in">Growth Journey</span>
                    </h2>
                    <p className="text-purple-100/70 text-sm max-w-xs transition-all duration-500">
                        {step === 3 ? (
                            <span className="text-green-300">Almost there! Just one more step.</span>
                        ) : (
                            <>Complete {3 - step + 1} more step{3 - step + 1 !== 1 ? 's' : ''} to access your logistics dashboard.</>
                        )}
                    </p>
                </div>

                {/* Enhanced Progress Indicators with connecting lines */}
                <div className="relative z-10">
                    {/* Vertical connecting line */}
                    {/* <div className="absolute left-[18px] top-[20px] w-0.5 h-[calc(100%-40px)] bg-white/10 rounded-full overflow-hidden">
                         
                        <div
                            className="w-full bg-gradient-to-b from-white to-purple-200 rounded-full transition-all duration-700 ease-out"
                            style={{ height: `${((step - 1) / 2) * 100}%` }}
                        ></div>
                    </div> */}

                    <div className="space-y-8 inline-block">
                        {[
                            { num: 1, label: "Profile Setup", icon: "👤" },
                            { num: 2, label: "Store Details", icon: "🏪" },
                            { num: 3, label: "Account Security", icon: "🔐" }
                        ].map((item) => (
                            <div
                                key={item.num}
                                className="flex items-center space-x-4 group cursor-pointer relative"
                                onMouseEnter={() => setHoveredStep(item.num)}
                                onMouseLeave={() => setHoveredStep(null)}
                            >
                                {/* Step indicator with animations */}
                                <div className="relative">
                                    {/* Pulse ring for current step */}
                                    {step === item.num && (
                                        <div className="absolute inset-0 w-10 h-10 rounded-xl bg-white/30 animate-pulse-ring"></div>
                                    )}

                                    {/* Main step circle */}
                                    <div
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-500 relative z-10 ${
                                            step > item.num
                                                ? "bg-green-400 text-white shadow-lg shadow-green-400/30 scale-100"
                                                : step === item.num
                                                    ? "bg-white text-purple-600 shadow-lg shadow-white/30 scale-110"
                                                    : "bg-white/10 text-white/50 border border-white/20 group-hover:bg-white/20 group-hover:border-white/40 group-hover:scale-105"
                                        }`}
                                    >
                                        {step > item.num ? (
                                            <svg
                                                className="w-5 h-5 animate-checkmark"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                style={{ strokeDasharray: 24, strokeDashoffset: 0 }}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <span className={`transition-all duration-300 ${step === item.num ? 'scale-110' : 'group-hover:scale-110'}`}>
                                                {item.num}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Step label with slide-in animation */}
                                <div className="flex flex-col">
                                    <span className={`text-sm font-medium transition-all duration-300 ${
                                        step >= item.num
                                            ? "text-white"
                                            : "text-white/50 group-hover:text-white/80"
                                    } ${step === item.num ? 'animate-slide-in' : ''}`}>
                                        {item.label}
                                    </span>

                                    {/* Status text */}
                                    <span className={`text-xs transition-all duration-300 ${
                                        step > item.num
                                            ? "text-green-300"
                                            : step === item.num
                                                ? "text-purple-200"
                                                : "text-white/30"
                                    }`}>
                                        {step > item.num ? "✓ Completed" : step === item.num ? "In progress..." : "Pending"}
                                    </span>
                                </div>

                                {/* Interactive tooltip on hover */}
                                {hoveredStep === item.num && (
                                    <div className="absolute left-full ml-4 bg-white/95 backdrop-blur-sm text-purple-900 text-xs py-2 px-3 rounded-lg shadow-xl animate-tooltip whitespace-nowrap z-20">
                                        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-white/95 rotate-45"></div>
                                        <span className="mr-2">{item.icon}</span>
                                        {stepDescriptions[item.num]}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Enhanced bottom section */}
                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-purple-100/50 group cursor-default">
                        <span className="text-lg group-hover:animate-bounce">🛡️</span>
                        <span className="group-hover:text-purple-100/70 transition-colors">Secured with ISO 27001</span>
                    </div>

                    {/* Progress percentage */}
                    <div className="flex items-center space-x-2">
                        <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-white to-purple-200 rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${(step / 3) * 100}%` }}
                            ></div>
                        </div>
                        <span className="text-xs text-white/70 font-medium">{Math.round((step / 3) * 100)}%</span>
                    </div>
                </div>
            </div>

            {/* --- RIGHT SIDE: THE FORM PANEL --- */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white relative">
                {isloading && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                        <div
                            className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mb-3"
                            style={{ borderColor: '#735dff', borderTopColor: 'transparent' }}
                        ></div>
                        <p className="text-sm font-medium text-gray-600">Setting up your account...</p>
                    </div>
                )}

                <div className="max-w-sm w-full">
                    {/* User icon at top */}
                    <div className="flex justify-center mb-6">
                        <div className="w-14 h-14 bg-purple-50 rounded-xl border-2 border-purple-100 flex items-center justify-center">
                            <UserIcon />
                        </div>
                    </div>

                    {/* Sign Up heading */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">Sign Up</h1>
                        <p className="text-sm text-gray-500">Step {step} of 3</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* STEP 1: PERSONAL INFO */}
                        {step === 1 && (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all text-gray-700 placeholder:text-gray-400"
                                        placeholder="e.g. Rahul Sharma"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Work Email
                                    </label>
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all text-gray-700 placeholder:text-gray-400"
                                        placeholder="rahul@business.com"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="w-full text-white py-3.5 rounded-lg font-semibold text-base transition-all hover:opacity-90 active:scale-[0.98] shadow-lg"
                                    style={{ backgroundColor: '#735dff' }}
                                >
                                    Continue
                                </button>
                            </>
                        )}

                        {/* STEP 2: BUSINESS INFO */}
                        {step === 2 && (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Brand Name
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all text-gray-700 placeholder:text-gray-400"
                                        placeholder="e.g. UrbanGlow Stores"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Primary Store Platform
                                    </label>
                                    <select
                                        name="storeType"
                                        value={formData.storeType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all text-gray-700"
                                    >
                                        <option>Shopify</option>
                                        <option>WooCommerce</option>
                                        <option>Amazon India</option>
                                        <option>Custom API Integration</option>
                                    </select>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex-1 text-gray-600 py-3.5 rounded-lg font-semibold text-base transition-all hover:bg-gray-100 border border-gray-200"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="flex-1 text-white py-3.5 rounded-lg font-semibold text-base transition-all hover:opacity-90 active:scale-[0.98] shadow-lg"
                                        style={{ backgroundColor: '#735dff' }}
                                    >
                                        Continue
                                    </button>
                                </div>
                            </>
                        )}

                        {/* STEP 3: SECURITY */}
                        {step === 3 && (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        required
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all text-gray-700 placeholder:text-gray-400"
                                        placeholder="+91 99999 99999"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Set Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            required
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 pr-12 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all text-gray-700 placeholder:text-gray-400"
                                            placeholder="••••••••"
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

                                {/* Social Signup Separator */}
                                <div className="relative py-2">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="px-4 bg-white text-gray-400 text-sm">
                                            OR Signup With
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

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex-1 text-gray-600 py-3.5 rounded-lg font-semibold text-base transition-all hover:bg-gray-100 border border-gray-200"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isloading}
                                        className="flex-1 text-white py-3.5 rounded-lg font-semibold text-base transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-70 shadow-lg"
                                        style={{ backgroundColor: '#735dff' }}
                                    >
                                        {isloading ? 'Creating...' : 'Create Account'}
                                    </button>
                                </div>

                                <p className="text-xs text-gray-400 text-center">
                                    By signing up you agree to our{" "}
                                    <span className="text-gray-600 underline cursor-pointer">Terms</span> &{" "}
                                    <span className="text-gray-600 underline cursor-pointer">Privacy Policy</span>
                                </p>
                            </>
                        )}
                    </form>

                    {/* Sign In Link */}
                    <p className="text-center mt-6 text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-blue-600 hover:underline transition-colors"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;