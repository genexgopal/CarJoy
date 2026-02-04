import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import loginBg from "../assets/images/login_bg.jpg";

const RegisterPage = ({ onBack, onSuccess }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
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

    // Social icons (matching LoginPage)
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

    // Step info for progress indicator
    const steps = [
        { num: 1, label: "Profile" },
        { num: 2, label: "Business" },
        { num: 3, label: "Security" }
    ];

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
                    <p className="text-sm font-medium text-gray-600">Setting up your account...</p>
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

            {/* Registration Card */}
            <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8 md:p-10">
                {/* Heading */}
                <div className="mb-6">
                    <h1 className="text-xl font-semibold text-gray-800 mb-1">Create an account</h1>
                    <p className="text-sm text-gray-500">Fill in your details to get started</p>
                </div>

                {/* Step Progress Indicator */}
                <div className="flex items-center justify-between mb-6">
                    {steps.map((s, index) => (
                        <div key={s.num} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                                        step > s.num
                                            ? 'bg-green-500 text-white'
                                            : step === s.num
                                                ? 'text-white'
                                                : 'bg-gray-100 text-gray-400'
                                    }`}
                                    style={step === s.num ? { backgroundColor: 'var(--color-primary)' } : {}}
                                >
                                    {step > s.num ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        s.num
                                    )}
                                </div>
                                <span className={`text-xs mt-1 ${step >= s.num ? 'text-gray-700' : 'text-gray-400'}`}>
                                    {s.label}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`w-24 h-0.5 mx-2 mb-5 ${
                                        step > s.num ? 'bg-green-500' : 'bg-gray-200'
                                    }`}
                                ></div>
                            )}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* STEP 1: PERSONAL INFO */}
                    {step === 1 && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 transition-all text-gray-700 placeholder:text-gray-400"
                                    style={{ '--tw-ring-color': 'var(--color-primary-ring)' }}
                                    placeholder="e.g. Rahul Sharma"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 transition-all text-gray-700 placeholder:text-gray-400"
                                    style={{ '--tw-ring-color': 'var(--color-primary-ring)' }}
                                    placeholder="test@gmail.com"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={nextStep}
                                className="w-full text-white py-3 rounded-md font-medium text-base transition-all hover:opacity-90 active:scale-[0.98]"
                                style={{ backgroundColor: 'var(--color-primary)' }}
                            >
                                Continue
                            </button>
                        </>
                    )}

                    {/* STEP 2: BUSINESS INFO */}
                    {step === 2 && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Business Name
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 transition-all text-gray-700 placeholder:text-gray-400"
                                    style={{ '--tw-ring-color': 'var(--color-primary-ring)' }}
                                    placeholder="e.g. UrbanGlow Stores"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Store Platform
                                </label>
                                <select
                                    name="storeType"
                                    value={formData.storeType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 transition-all text-gray-700"
                                    style={{ '--tw-ring-color': 'var(--color-primary-ring)' }}
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
                                    className="flex-1 text-gray-600 py-3 rounded-md font-medium text-base transition-all hover:bg-gray-100 border border-gray-200"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex-1 text-white py-3 rounded-md font-medium text-base transition-all hover:opacity-90 active:scale-[0.98]"
                                    style={{ backgroundColor: 'var(--color-primary)' }}
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    required
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 transition-all text-gray-700 placeholder:text-gray-400"
                                    style={{ '--tw-ring-color': 'var(--color-primary-ring)' }}
                                    placeholder="+91 99999 99999"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        required
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 pr-16 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 transition-all text-gray-700 placeholder:text-gray-400"
                                        style={{ '--tw-ring-color': 'var(--color-primary-ring)' }}
                                        placeholder="••••••••"
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

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex-1 text-gray-600 py-3 rounded-md font-medium text-base transition-all hover:bg-gray-100 border border-gray-200"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 text-white py-3 rounded-md font-medium text-base transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-70"
                                    style={{ backgroundColor: 'var(--color-primary)' }}
                                >
                                    {isLoading ? 'Creating...' : 'Create Account'}
                                </button>
                            </div>

                            {/* Social Signup Separator */}
                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="px-4 bg-white text-gray-500 text-sm">
                                        Or Sign up with
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

                            <p className="text-xs text-gray-400 text-center pt-2">
                                By signing up you agree to our{" "}
                                <span className="underline cursor-pointer" style={{ color: 'var(--color-primary)' }}>Terms</span> &{" "}
                                <span className="underline cursor-pointer" style={{ color: 'var(--color-primary)' }}>Privacy Policy</span>
                            </p>
                        </>
                    )}
                </form>

                {/* Sign In Link */}
                <p className="text-center mt-6 text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-semibold hover:underline transition-colors"
                        style={{ color: 'var(--color-primary)' }}
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;