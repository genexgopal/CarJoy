import React, { useState, useEffect } from "react";
import LoginPage from "./LoginPage.jsx";
import TrackingPage from "./TrackingPage.jsx";
import RegisterPage from "./RegisterPage.jsx"; // Assuming this exists
import bodyImg from "../assets/images/body.jpg"; 

const LandingPage = () => {
    const [activeTab, setActiveTab] = useState("login");
    const [weight, setWeight] = useState(0.5);
    const [view, setView] = useState("landing"); // State to handle navigation

    // If user clicks signup, we change the view
    if (view === "register") {
        return <RegisterPage onBack={() => setView("landing")} />;
    }

    return (
        <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-[#FBFDFF] scroll-smooth">
            {/* --- TOP ANNOUNCEMENT BAR --- */}
            <div className="bg-[#003366] text-white py-2.5 text-center text-[10px] font-black tracking-[0.2em] uppercase">
                🚀 Industry Lead: Delivering to over 29,000+ Pincodes daily
            </div>

            {/* --- NAV BAR --- */}
            <header className="w-full bg-white/90 backdrop-blur-md border-b border-slate-100 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView("landing")}>
                    {/* <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg"><img src="src/assets/logo_l.png"></img></span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black leading-none text-[#003366] tracking-tighter">
                            SHIPMY<span className="text-[#f26522]">PARCEL</span>
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 tracking-[0.25em] uppercase">Logistics Intelligence</span>
                    </div> */}
                    <img src="src/assets/logo_h.png"></img>
                </div>
                
                <nav className="hidden lg:block">
                    <ul className="flex space-x-10 text-[12px] font-black text-slate-500 uppercase tracking-widest">
                        <li><a href="#calculator" className="hover:text-[#f26522] transition-colors">Rates</a></li>
                        <li><a href="#features" className="hover:text-[#f26522] transition-colors">Features</a></li>
                        <li><a href="#workflow" className="hover:text-[#f26522] transition-colors">Workflow</a></li>
                    </ul>
                </nav>

                <button 
                    onClick={() => setView("register")}
                    className="bg-[#f26522] text-white text-[11px] font-black px-8 py-3 rounded-full shadow-lg shadow-orange-100 hover:bg-[#d4541a] transition-all transform hover:scale-105 active:scale-95">
                    SIGN UP FREE
                </button>
            </header>

            {/* --- HERO & LOGIN SECTION --- */}
            <main className="relative pt-12 pb-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-16 items-center">
                    <div className="lg:col-span-7 space-y-8">
                        <div className="inline-block px-4 py-1.5 bg-orange-50 border border-orange-100 rounded-full">
                            <span className="text-[10px] font-bold text-[#f26522] uppercase tracking-widest">✨ Now with AI Route Optimization</span>
                        </div>
                        <h1 className="text-6xl md:text-[80px] font-black text-[#003366] leading-[0.95] tracking-tighter">
                            Ship smarter. <br />
                            <span className="text-[#f26522]">Grow faster.</span>
                        </h1>
                        <p className="text-xl text-slate-500 max-w-lg font-medium leading-relaxed">
                            Everything you need to manage your e-commerce logistics. Automated, integrated, and reliable.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                           <button onClick={() => setView("register")} className="bg-[#003366] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#002244] transition-all shadow-xl">Start Shipping Now</button>
                           <a href="#calculator" className="px-8 py-4 rounded-2xl font-bold border border-slate-200 hover:bg-slate-50 transition-all text-center">Calculate Rates</a>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100 p-2 transform hover:rotate-1 transition-transform duration-500">
                             <div className="flex bg-slate-50 rounded-[32px] p-1.5 mb-2">
                                <button onClick={() => setActiveTab("login")} className={`flex-1 py-4 text-xs font-black rounded-[28px] transition-all ${activeTab === "login" ? "bg-white text-[#003366] shadow-sm" : "text-slate-400"}`}>LOGIN</button>
                                <button onClick={() => setActiveTab("track")} className={`flex-1 py-4 text-xs font-black rounded-[28px] transition-all ${activeTab === "track" ? "bg-white text-[#003366] shadow-sm" : "text-slate-400"}`}>TRACK</button>
                             </div>
                             <div className="p-8">
                                {activeTab === "login" ? <LoginPage embedded={true} /> : <TrackingPage />}
                             </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* --- FEATURES GRID (Interactive Cards) --- */}
            <section id="features" className="py-24 bg-[#FBFDFF]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { title: "Zero Setup Fee", icon: "💰", desc: "Start shipping without any initial investment or hidden security deposits." },
                            { title: "NDR Management", icon: "⚡", desc: "Reduce RTO by up to 45% with our automated NDR workflow and IVR." },
                            { title: "Fast COD Remittance", icon: "🏦", desc: "Get your money back in your bank account twice a week, guaranteed." },
                            { title: "API Integration", icon: "🔌", desc: "One-click integration with Shopify, WooCommerce, and custom APIs." }
                        ].map((feat, i) => (
                            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 hover:border-[#f26522] hover:shadow-2xl hover:shadow-orange-100 transition-all group">
                                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{feat.icon}</div>
                                <h4 className="font-black text-[#003366] mb-3 uppercase tracking-tighter">{feat.title}</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SHIPPING RATE CALCULATOR --- */}
            <section id="calculator" className="py-24 bg-white border-y border-slate-100">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="bg-[#003366] rounded-[40px] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f26522] blur-[120px] opacity-20 -mr-32 -mt-32"></div>

                        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="text-4xl font-black mb-4">Check Shipping Rates</h3>
                                <p className="text-slate-300 mb-8">Instant estimates for your domestic shipments. No hidden fuel surcharges.</p>
                                
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between items-end mb-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Package Weight</label>
                                            <span className="font-black text-[#f26522] text-2xl">{weight} kg</span>
                                        </div>
                                        <input 
                                            type="range" min="0.5" max="10" step="0.5" value={weight} 
                                            onChange={(e) => setWeight(parseFloat(e.target.value))}
                                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#f26522]" 
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="number" placeholder="Pickup PIN" className="bg-slate-800 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#f26522] outline-none" />
                                        <input type="number" placeholder="Delivery PIN" className="bg-slate-800 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#f26522] outline-none" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/10 text-center transform hover:scale-105 transition-all">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Estimated Rate</p>
                                <h4 className="text-7xl font-black text-[#f26522]">₹{Math.floor(weight * 42)}*</h4>
                                <p className="text-[10px] text-slate-400 mt-4 italic uppercase tracking-widest">*Subject to Zone & volumetric weight</p>
                                <button 
                                    onClick={() => setView("register")}
                                    className="mt-8 w-full bg-[#f26522] py-4 rounded-xl font-black text-xs tracking-[0.2em] hover:bg-[#d4541a] transition shadow-lg">
                                    GET STARTED
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PROCESS WORKFLOW --- */}
            <section id="workflow" className="bg-white py-24">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="text-center mb-20">
                        <h2 className="text-[11px] font-black text-[#f26522] tracking-[0.4em] uppercase mb-4">The Workflow</h2>
                        <h3 className="text-4xl font-black text-[#003366]">Three steps to scale your brand</h3>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-16 relative mt-16">
                        {[
                            { step: "01", title: "Integrate Store", desc: "Connect Shopify, Amazon, or your custom store in 2 clicks." },
                            { step: "02", title: "Select Courier", desc: "Compare 17+ carriers based on cost, speed, and RTO risk." },
                            { step: "03", title: "Ship & Track", desc: "Print labels and notify customers with branded tracking pages." }
                        ].map((item, i) => (
                            <div key={i} className="relative group p-6 rounded-3xl hover:bg-slate-50 transition-all">
                                <span className="text-8xl font-black text-slate-50 absolute -top-12 -left-4 z-0 transition-colors group-hover:text-[#f26522]/5">{item.step}</span>
                                <div className="relative z-10">
                                    <h4 className="text-xl font-black text-[#003366] mb-4 group-hover:text-[#f26522] transition-colors">{item.title}</h4>
                                    <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="bg-[#003366] py-32 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: `url(${bodyImg})`, backgroundSize: 'cover' }}></div>
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <h2 className="text-5xl md:text-6xl font-black text-white mb-10 leading-tight">Ready to ship <br/> with confidence?</h2>
                    <button 
                        onClick={() => setView("register")}
                        className="bg-[#f26522] text-white px-12 py-6 rounded-full font-black text-sm tracking-[0.2em] hover:bg-white hover:text-[#003366] transition-all shadow-2xl hover:scale-110 active:scale-95">
                        JOIN THE REVOLUTION
                    </button>
                    <p className="text-slate-400 mt-12 text-[10px] font-black uppercase tracking-[0.4em]">Integrates with Shopify • WooCommerce • Magento • Amazon</p>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-[#001a33] py-16 text-slate-500 text-[10px] font-black text-center border-t border-white/5 uppercase tracking-[0.3em]">
                <div className="flex justify-center space-x-8 mb-8 opacity-50">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-white transition-colors">Contact Us</a>
                </div>
                © 2026 shipmyparcel.in | Logistics Simplified for India
            </footer>
        </div>
    );
}

export default LandingPage;