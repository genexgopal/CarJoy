import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar.jsx";
import AdminHeader from "../../components/AdminHeader.jsx";
import ResponsiveContainer from "../../components/ResponsiveContainer.jsx";
import { IconLibrary } from "../../components/IconLibrary.jsx";

function AdminForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Order Details
    orderNumber: "",
    orderDate: "",
    
    // Sender Details
    senderName: "",
    senderEmail: "",
    senderPhone: "",
    senderAddress: "",
    senderCity: "",
    senderState: "",
    senderPincode: "",
    
    // Receiver Details
    receiverName: "",
    receiverEmail: "",
    receiverPhone: "",
    receiverAddress: "",
    receiverCity: "",
    receiverState: "",
    receiverPincode: "",
    
    // Shipment Details
    weight: "",
    itemDescription: "",
    itemValue: "",
    courier: "Delhivery",
    serviceType: "Standard",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.orderNumber) newErrors.orderNumber = "Order number is required";
      if (!formData.orderDate) newErrors.orderDate = "Order date is required";
      if (!formData.senderName) newErrors.senderName = "Sender name is required";
      if (!formData.senderEmail) newErrors.senderEmail = "Sender email is required";
      if (!formData.senderPhone) newErrors.senderPhone = "Sender phone is required";
      if (!formData.senderAddress) newErrors.senderAddress = "Sender address is required";
      if (!formData.senderPincode) newErrors.senderPincode = "Sender pincode is required";
    }
    
    if (step === 2) {
      if (!formData.receiverName) newErrors.receiverName = "Receiver name is required";
      if (!formData.receiverEmail) newErrors.receiverEmail = "Receiver email is required";
      if (!formData.receiverPhone) newErrors.receiverPhone = "Receiver phone is required";
      if (!formData.receiverAddress) newErrors.receiverAddress = "Receiver address is required";
      if (!formData.receiverPincode) newErrors.receiverPincode = "Receiver pincode is required";
    }
    
    if (step === 3) {
      if (!formData.weight) newErrors.weight = "Weight is required";
      if (!formData.itemDescription) newErrors.itemDescription = "Item description is required";
      if (!formData.itemValue) newErrors.itemValue = "Item value is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(3)) {
      console.log("Form submitted:", formData);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          orderNumber: "",
          orderDate: "",
          senderName: "",
          senderEmail: "",
          senderPhone: "",
          senderAddress: "",
          senderCity: "",
          senderState: "",
          senderPincode: "",
          receiverName: "",
          receiverEmail: "",
          receiverPhone: "",
          receiverAddress: "",
          receiverCity: "",
          receiverState: "",
          receiverPincode: "",
          weight: "",
          itemDescription: "",
          itemValue: "",
          courier: "Delhivery",
          serviceType: "Standard",
        });
        setCurrentStep(1);
      }, 2000);
    }
  };

  const FormField = ({ label, name, type = "text", required = false, placeholder = "" }) => (
    <div className="mb-6">
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f26522] focus:border-transparent transition-all ${
          errors[name] ? "border-red-500" : "border-slate-200"
        }`}
      />
      {errors[name] && <p className="text-red-600 text-xs font-bold mt-1">{errors[name]}</p>}
    </div>
  );

  const [sidebarExpanded, setSidebarExpanded] = React.useState(true);

  React.useEffect(() => {
    const checkSidebar = () => {
      const expanded = sessionStorage.getItem('sidebarExpanded') !== 'false';
      setSidebarExpanded(expanded);
    };
    checkSidebar();
    const interval = setInterval(checkSidebar, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <AdminNavbar />
      <div className="flex-1 transition-all duration-300" style={{ marginLeft: sidebarExpanded ? '200px' : '60px' }}>
        <AdminHeader />
        
        {/* Main Content */}
        <ResponsiveContainer>
        {submitted && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 animate-in fade-in">
            <div className="flex items-start gap-4">
              <div className="text-2xl">✓</div>
              <div>
                <h3 className="font-bold text-emerald-900">Shipment Created Successfully!</h3>
                <p className="text-emerald-700 text-sm mt-1">Your shipment has been registered in the system.</p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    currentStep >= step
                      ? "bg-[#f26522] text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      currentStep > step ? "bg-[#f26522]" : "bg-slate-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <span className="text-xs font-bold text-slate-600">Sender Info</span>
            <span className="text-xs font-bold text-slate-600">Receiver Info</span>
            <span className="text-xs font-bold text-slate-600">Shipment Details</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white border border-slate-100 rounded-2xl p-8">
            {/* Step 1: Sender Details */}
            {currentStep === 1 && (
              <div className="animate-in fade-in">
                <h2 className="text-2xl font-black text-slate-900 mb-8">Order & Sender Information</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <FormField label="Order Number" name="orderNumber" required placeholder="e.g., ORD-001" />
                  <FormField label="Order Date" name="orderDate" type="date" required />
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-6 pt-4 border-t border-slate-200">Sender Details</h3>
                
                <FormField label="Sender Name" name="senderName" required placeholder="John Doe" />
                <FormField label="Sender Email" name="senderEmail" type="email" required placeholder="john@example.com" />
                <FormField label="Sender Phone" name="senderPhone" required placeholder="+91 98765 43210" />
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <FormField label="Sender City" name="senderCity" placeholder="New York" />
                  <FormField label="Sender State" name="senderState" placeholder="NY" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <FormField label="Sender Address" name="senderAddress" required placeholder="123 Main Street" />
                  <FormField label="Sender Pincode" name="senderPincode" required placeholder="100001" />
                </div>
              </div>
            )}

            {/* Step 2: Receiver Details */}
            {currentStep === 2 && (
              <div className="animate-in fade-in">
                <h2 className="text-2xl font-black text-slate-900 mb-8">Receiver Information</h2>
                
                <FormField label="Receiver Name" name="receiverName" required placeholder="Jane Smith" />
                <FormField label="Receiver Email" name="receiverEmail" type="email" required placeholder="jane@example.com" />
                <FormField label="Receiver Phone" name="receiverPhone" required placeholder="+91 98765 43210" />
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <FormField label="Receiver City" name="receiverCity" placeholder="Los Angeles" />
                  <FormField label="Receiver State" name="receiverState" placeholder="CA" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <FormField label="Receiver Address" name="receiverAddress" required placeholder="456 Oak Avenue" />
                  <FormField label="Receiver Pincode" name="receiverPincode" required placeholder="900001" />
                </div>
              </div>
            )}

            {/* Step 3: Shipment Details */}
            {currentStep === 3 && (
              <div className="animate-in fade-in">
                <h2 className="text-2xl font-black text-slate-900 mb-8">Shipment Details</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <FormField label="Weight (kg)" name="weight" type="number" required placeholder="1.5" />
                  <FormField label="Item Value (₹)" name="itemValue" type="number" required placeholder="5000" />
                </div>

                <FormField label="Item Description" name="itemDescription" required placeholder="Electronics, Clothing, etc." />

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Courier Service</label>
                    <select
                      name="courier"
                      value={formData.courier}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f26522]"
                    >
                      <option value="Delhivery">Delhivery</option>
                      <option value="BlueDart">BlueDart</option>
                      <option value="FedEx">FedEx</option>
                      <option value="Ecom Express">Ecom Express</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Service Type</label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f26522]"
                    >
                      <option value="Standard">Standard Delivery</option>
                      <option value="Express">Express Delivery</option>
                      <option value="Overnight">Overnight Delivery</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-between gap-4 mt-8 pt-8 border-t border-slate-200">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${
                  currentStep === 1
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                ← Previous
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-[#f26522] text-white rounded-lg font-bold hover:bg-[#d4541a] transition-all"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-all"
                >
                  Create Shipment
                </button>
              )}
            </div>
          </div>
        </form>
      </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminForm;
