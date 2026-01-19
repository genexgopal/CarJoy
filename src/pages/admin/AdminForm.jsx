import { useState, useEffect, useMemo, memo } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar.jsx";
import AdminHeader from "../../components/AdminHeader.jsx";
import ResponsiveContainer from "../../components/ResponsiveContainer.jsx";
import { IconLibrary } from "../../components/IconLibrary.jsx";

// Zod validation imports
import { stepFields } from "../../schemas/shipmentValidation";
import { validateStep as zodValidateStep, validateField as zodValidateField, validateFullForm } from "../../utils/validation";

// FormField component defined OUTSIDE AdminForm to prevent re-creation on every render
const FormField = memo(({
  label,
  name,
  type = "text",
  required = false,
  placeholder = "",
  icon: Icon,
  helpText = "",
  value,
  error,
  isTouched,
  isFocused,
  onChange,
  onFocus,
  onBlur
}) => {
  const hasError = error && isTouched;
  const hasValue = value && value.toString().trim() !== '';
  const isValid = hasValue && !error && isTouched;

  return (
    <div className="relative group">
      <label
        htmlFor={name}
        className={`block text-sm font-semibold mb-2 transition-colors duration-200 ${
          isFocused ? 'text-[#f26522]' : hasError ? 'text-red-600' : 'text-slate-700'
        }`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
            isFocused ? 'text-[#f26522]' : hasError ? 'text-red-400' : 'text-slate-400'
          }`}>
            <Icon size={18} color="currentColor" />
          </div>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : helpText ? `${name}-help` : undefined}
          className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-10 py-3.5 bg-white border-2 rounded-xl transition-all duration-200 outline-none
            ${hasError
              ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
              : isFocused
                ? 'border-[#f26522] ring-4 ring-[#f26522]/10'
                : isValid
                  ? 'border-emerald-300 bg-emerald-50/30'
                  : 'border-slate-200 hover:border-slate-300 focus:border-[#f26522] focus:ring-4 focus:ring-[#f26522]/10'
            }`}
        />
        {/* Validation indicator */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {hasError && (
            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 text-xs font-bold">!</span>
            </div>
          )}
          {isValid && (
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
              <IconLibrary.Check size={12} color="#10b981" strokeWidth={3} />
            </div>
          )}
        </div>
      </div>
      {/* Error message */}
      {hasError && (
        <p id={`${name}-error`} className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1.5">
          <IconLibrary.Alert size={14} color="currentColor" />
          {error}
        </p>
      )}
      {/* Help text */}
      {helpText && !hasError && (
        <p id={`${name}-help`} className="mt-2 text-xs text-slate-500">{helpText}</p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

function AdminForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [touchedFields, setTouchedFields] = useState({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Generate order number automatically
  const generateOrderNumber = () => {
    const date = new Date();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${random}`;
  };

  const initialFormData = {
    orderNumber: generateOrderNumber(),
    orderDate: new Date().toISOString().split('T')[0],
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
  };

  const [formData, setFormData] = useState(() => {
    // Try to load draft from localStorage
    const savedDraft = localStorage.getItem('shipmentFormDraft');
    if (savedDraft) {
      try {
        return JSON.parse(savedDraft);
      } catch {
        return initialFormData;
      }
    }
    return initialFormData;
  });

  const [errors, setErrors] = useState({});

  // Auto-save draft to localStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('shipmentFormDraft', JSON.stringify(formData));
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [formData]);

  // =============================================================================
  // INPUT HANDLERS
  // =============================================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /**
   * Handle field blur - validates field using Zod
   * Provides real-time validation feedback
   */
  const handleBlur = (name) => {
    setFocusedField(null);
    setTouchedFields(prev => ({ ...prev, [name]: true }));

    // Validate field using Zod
    const error = zodValidateField(name, formData[name], formData);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    } else {
      // Clear error if field is now valid
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Validate a specific form step using Zod schemas
   * @param {number} step - The step number to validate (1, 2, or 3)
   * @returns {boolean} - True if step is valid
   */
  const validateStep = (step) => {
    const { isValid, errors: stepErrors } = zodValidateStep(step, formData);
    setErrors(stepErrors);
    return isValid;
  };

  /**
   * Handle navigation to next step
   * Validates current step using Zod before proceeding
   */
  const handleNext = () => {
    // Mark current step fields as touched so errors show
    const fieldsToTouch = stepFields[currentStep] || [];
    const newTouched = { ...touchedFields };
    fieldsToTouch.forEach(field => { newTouched[field] = true; });
    setTouchedFields(newTouched);

    // Validate using Zod
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setFormData({
      ...initialFormData,
      orderNumber: generateOrderNumber(),
      orderDate: new Date().toISOString().split('T')[0],
    });
    setErrors({});
    setTouchedFields({});
    setCurrentStep(1);
    setShowResetConfirm(false);
    localStorage.removeItem('shipmentFormDraft');
  };

  /**
   * Handle form submission
   * Uses Zod validateFullForm for complete validation
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched so validation errors show
    const allFields = [
      ...stepFields[1],
      ...stepFields[2],
      ...stepFields[3]
    ];
    const allTouched = {};
    allFields.forEach(field => { allTouched[field] = true; });
    setTouchedFields(allTouched);

    // Validate entire form using Zod
    const { isValid, errors: validationErrors, firstErrorStep } = validateFullForm(formData);

    if (!isValid) {
      setErrors(validationErrors);

      // Navigate to the first step with errors
      if (firstErrorStep) {
        setCurrentStep(firstErrorStep);
      }
      return;
    }

    // Clear any existing errors
    setErrors({});
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log("Form submitted:", formData);
    setIsSubmitting(false);
    setSubmitted(true);
    localStorage.removeItem('shipmentFormDraft');

    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        ...initialFormData,
        orderNumber: generateOrderNumber(),
        orderDate: new Date().toISOString().split('T')[0],
      });
      setErrors({});
      setTouchedFields({});
      setCurrentStep(1);
    }, 3000);
  };

  // Calculate step completion percentage
  const getStepProgress = useMemo(() => {
    const step1Fields = ['orderNumber', 'orderDate', 'senderName', 'senderEmail', 'senderPhone', 'senderAddress', 'senderPincode'];
    const step2Fields = ['receiverName', 'receiverEmail', 'receiverPhone', 'receiverAddress', 'receiverPincode'];
    const step3Fields = ['weight', 'itemDescription', 'itemValue'];

    const calculateProgress = (fields) => {
      const filled = fields.filter(f => formData[f] && formData[f].toString().trim() !== '').length;
      return Math.round((filled / fields.length) * 100);
    };

    return {
      1: calculateProgress(step1Fields),
      2: calculateProgress(step2Fields),
      3: calculateProgress(step3Fields),
    };
  }, [formData]);

  // Step configuration
  const steps = [
    { number: 1, title: "Sender Info", subtitle: "Order & sender details", icon: IconLibrary.User },
    { number: 2, title: "Receiver Info", subtitle: "Delivery destination", icon: IconLibrary.MapPin },
    { number: 3, title: "Shipment", subtitle: "Package details", icon: IconLibrary.Package },
  ];

  // Helper function to render FormField with all required props
  const renderField = (props) => (
    <FormField
      {...props}
      value={formData[props.name]}
      error={errors[props.name]}
      isTouched={touchedFields[props.name]}
      isFocused={focusedField === props.name}
      onChange={handleInputChange}
      onFocus={() => setFocusedField(props.name)}
      onBlur={() => handleBlur(props.name)}
    />
  );

  // Courier options with icons
  const courierOptions = [
    { value: "Delhivery", label: "Delhivery", description: "Fast domestic delivery" },
    { value: "BlueDart", label: "BlueDart", description: "Premium express service" },
    { value: "FedEx", label: "FedEx", description: "International shipping" },
    { value: "Ecom Express", label: "Ecom Express", description: "E-commerce specialist" },
  ];

  const serviceOptions = [
    { value: "Standard", label: "Standard Delivery", description: "3-5 business days", price: "₹50" },
    { value: "Express", label: "Express Delivery", description: "1-2 business days", price: "₹120" },
    { value: "Overnight", label: "Overnight Delivery", description: "Next business day", price: "₹250" },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <AdminNavbar />
      <div className="flex-1 flex flex-col min-h-screen">
        <AdminHeader />

        {/* Main Content */}
        <ResponsiveContainer>
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Create New Shipment</h1>
              <p className="text-sm text-slate-500 mt-1">Fill in the details to create a new order</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Draft saved indicator */}
              {draftSaved && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium animate-in fade-in duration-300">
                  <IconLibrary.Check size={14} color="currentColor" />
                  Draft saved
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-all duration-200 flex items-center gap-2"
              >
                <IconLibrary.RefreshCw size={16} color="currentColor" />
                Reset Form
              </button>
            </div>
          </div>

          {/* Success Message */}
          {submitted && (
            <div className="mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 shadow-lg shadow-emerald-100/50 animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <IconLibrary.CheckCircle size={24} color="white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-emerald-900 text-lg">Shipment Created Successfully!</h3>
                  <p className="text-emerald-700 text-sm mt-1">Your shipment has been registered. Tracking ID: <span className="font-mono font-bold">{formData.orderNumber}</span></p>
                  <div className="mt-4 flex gap-3">
                    <Link to="/admin/orders" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors">
                      View Orders
                    </Link>
                    <button className="px-4 py-2 bg-white text-emerald-700 border border-emerald-200 rounded-lg text-sm font-semibold hover:bg-emerald-50 transition-colors">
                      Print Label
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reset Confirmation Modal */}
          {showResetConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                  <IconLibrary.Alert size={24} color="#f59e0b" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Reset Form?</h3>
                <p className="text-slate-600 text-sm mb-6">This will clear all entered data and start fresh. This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                  >
                    Reset Form
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modern Progress Stepper */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 mb-8 shadow-sm">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (

                <div key={step.number} className={`flex items-center ${steps.length !== step.number ? "flex-1" : ""} `}>
                  
                  {/* Step Circle */}
                  <button
                    type="button"
                    onClick={() => {
                      // Allow going back to completed steps
                      if (step.number < currentStep) {
                        setCurrentStep(step.number);
                      }
                    }}
                    disabled={step.number > currentStep}
                    className={`relative flex flex-col items-center group ${step.number <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${currentStep === step.number
                        ? 'bg-gradient-to-br from-[#f26522] to-[#d4541a] shadow-lg shadow-orange-500/30 scale-110'
                        : currentStep > step.number
                          ? 'bg-emerald-500 shadow-md'
                          : 'bg-slate-100 group-hover:bg-slate-200'
                      }`}>
                      {currentStep > step.number ? (
                        <IconLibrary.Check size={24} color="white" strokeWidth={3} />
                      ) : (
                        <step.icon size={24} color={currentStep >= step.number ? 'white' : '#94a3b8'} />
                      )}
                    </div>
                    {/* Step Label */}
                    <div className="mt-3 text-center">
                      <p className={`text-sm font-bold transition-colors ${currentStep === step.number ? 'text-[#f26522]' : currentStep > step.number ? 'text-emerald-600' : 'text-slate-500'
                        }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">{step.subtitle}</p>
                    </div>
                    {/* Progress percentage badge */}
                    {currentStep === step.number && getStepProgress[step.number] > 0 && getStepProgress[step.number] < 100 && (
                      <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-[#f26522] text-white text-xs font-bold rounded-full">
                        {getStepProgress[step.number]}%
                      </div>
                    )}
                  </button>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="flex-1 mx-4 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ease-out ${currentStep > step.number ? 'bg-emerald-500' : 'bg-slate-100'
                          }`}
                        style={{ width: currentStep > step.number ? '100%' : '0%' }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
              {/* Step 1: Order & Sender Details */}
              {currentStep === 1 && (
                <div className="animate-in slide-in-from-right-4 duration-300">
                  {/* Section Header */}
                  <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <IconLibrary.User size={24} color="white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-800">Order & Sender Information</h2>
                        <p className="text-sm text-slate-500 mt-0.5">Enter order details and pickup location</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    {/* Order Details */}
                    <div className="mb-8">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <IconLibrary.Package size={16} color="currentColor" />
                        Order Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderField({
                          label: "Order Number",
                          name: "orderNumber",
                          required: true,
                          placeholder: "Auto-generated",
                          icon: IconLibrary.Package,
                          helpText: "Auto-generated order ID"
                        })}
                        {renderField({
                          label: "Order Date",
                          name: "orderDate",
                          type: "date",
                          required: true,
                          icon: IconLibrary.Calendar
                        })}
                      </div>
                    </div>

                    {/* Sender Details */}
                    <div className="pt-6 border-t border-slate-100">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <IconLibrary.User size={16} color="currentColor" />
                        Sender Details
                      </h3>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {renderField({
                            label: "Full Name",
                            name: "senderName",
                            required: true,
                            placeholder: "John Doe",
                            icon: IconLibrary.User
                          })}
                          {renderField({
                            label: "Email Address",
                            name: "senderEmail",
                            type: "email",
                            required: true,
                            placeholder: "john@example.com",
                            icon: IconLibrary.Mail
                          })}
                        </div>
                        {renderField({
                          label: "Phone Number",
                          name: "senderPhone",
                          required: true,
                          placeholder: "+91 98765 43210",
                          icon: IconLibrary.Phone,
                          helpText: "Include country code for international"
                        })}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {renderField({
                            label: "City",
                            name: "senderCity",
                            placeholder: "Mumbai",
                            icon: IconLibrary.MapPin
                          })}
                          {renderField({
                            label: "State",
                            name: "senderState",
                            placeholder: "Maharashtra",
                            icon: IconLibrary.MapPin
                          })}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-2">
                            {renderField({
                              label: "Street Address",
                              name: "senderAddress",
                              required: true,
                              placeholder: "123 Main Street, Apartment 4B",
                              icon: IconLibrary.MapPin
                            })}
                          </div>
                          {renderField({
                            label: "Pincode",
                            name: "senderPincode",
                            required: true,
                            placeholder: "400001",
                            icon: IconLibrary.MapPin,
                            helpText: "6-digit postal code"
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Receiver Details */}
              {currentStep === 2 && (
                <div className="animate-in slide-in-from-right-4 duration-300">
                  {/* Section Header */}
                  <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <IconLibrary.MapPin size={24} color="white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-800">Receiver Information</h2>
                        <p className="text-sm text-slate-500 mt-0.5">Enter delivery destination details</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderField({
                          label: "Full Name",
                          name: "receiverName",
                          required: true,
                          placeholder: "Jane Smith",
                          icon: IconLibrary.User
                        })}
                        {renderField({
                          label: "Email Address",
                          name: "receiverEmail",
                          type: "email",
                          required: true,
                          placeholder: "jane@example.com",
                          icon: IconLibrary.Mail
                        })}
                      </div>
                      {renderField({
                        label: "Phone Number",
                        name: "receiverPhone",
                        required: true,
                        placeholder: "+91 98765 43210",
                        icon: IconLibrary.Phone,
                        helpText: "Recipient will receive SMS updates"
                      })}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderField({
                          label: "City",
                          name: "receiverCity",
                          placeholder: "Delhi",
                          icon: IconLibrary.MapPin
                        })}
                        {renderField({
                          label: "State",
                          name: "receiverState",
                          placeholder: "Delhi",
                          icon: IconLibrary.MapPin
                        })}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                          {renderField({
                            label: "Street Address",
                            name: "receiverAddress",
                            required: true,
                            placeholder: "456 Oak Avenue, Building C",
                            icon: IconLibrary.MapPin
                          })}
                        </div>
                        {renderField({
                          label: "Pincode",
                          name: "receiverPincode",
                          required: true,
                          placeholder: "110001",
                          icon: IconLibrary.MapPin,
                          helpText: "6-digit postal code"
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Shipment Details */}
              {currentStep === 3 && (
                <div className="animate-in slide-in-from-right-4 duration-300">
                  {/* Section Header */}
                  <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#f26522] to-[#d4541a] rounded-xl flex items-center justify-center shadow-lg">
                        <IconLibrary.Package size={24} color="white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-800">Shipment Details</h2>
                        <p className="text-sm text-slate-500 mt-0.5">Package information and delivery options</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    {/* Package Info */}
                    <div className="mb-8">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <IconLibrary.Package size={16} color="currentColor" />
                        Package Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderField({
                          label: "Weight (kg)",
                          name: "weight",
                          type: "number",
                          required: true,
                          placeholder: "1.5",
                          icon: IconLibrary.Package,
                          helpText: "Volumetric weight may apply"
                        })}
                        {renderField({
                          label: "Declared Value (₹)",
                          name: "itemValue",
                          type: "number",
                          required: true,
                          placeholder: "5000",
                          icon: IconLibrary.DollarSign,
                          helpText: "For insurance purposes"
                        })}
                      </div>
                      <div className="mt-6">
                        {renderField({
                          label: "Item Description",
                          name: "itemDescription",
                          required: true,
                          placeholder: "Electronics, Clothing, Documents, etc.",
                          icon: IconLibrary.FileText,
                          helpText: "Brief description of package contents"
                        })}
                      </div>
                    </div>

                    {/* Courier Selection */}
                    <div className="pt-6 border-t border-slate-100 mb-8">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <IconLibrary.Truck size={16} color="currentColor" />
                        Select Courier
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {courierOptions.map((courier) => (
                          <button
                            key={courier.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, courier: courier.value }))}
                            className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${formData.courier === courier.value
                                ? 'border-[#f26522] bg-orange-50 shadow-md'
                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                              }`}
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${formData.courier === courier.value ? 'bg-[#f26522]' : 'bg-slate-100'
                              }`}>
                              <IconLibrary.Truck size={20} color={formData.courier === courier.value ? 'white' : '#64748b'} />
                            </div>
                            <p className={`font-bold text-sm ${formData.courier === courier.value ? 'text-[#f26522]' : 'text-slate-800'}`}>
                              {courier.label}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">{courier.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Service Type Selection */}
                    <div className="pt-6 border-t border-slate-100">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <IconLibrary.Clock size={16} color="currentColor" />
                        Delivery Speed
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {serviceOptions.map((service) => (
                          <button
                            key={service.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, serviceType: service.value }))}
                            className={`p-5 rounded-xl border-2 text-left transition-all duration-200 ${formData.serviceType === service.value
                                ? 'border-[#f26522] bg-orange-50 shadow-md'
                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                              }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <p className={`font-bold ${formData.serviceType === service.value ? 'text-[#f26522]' : 'text-slate-800'}`}>
                                {service.label}
                              </p>
                              <span className={`px-2 py-1 rounded-lg text-sm font-bold ${formData.serviceType === service.value ? 'bg-[#f26522] text-white' : 'bg-slate-100 text-slate-600'
                                }`}>
                                {service.price}
                              </span>
                            </div>
                            <p className="text-sm text-slate-500">{service.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Footer / Navigation */}
              <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-200 ${currentStep === 1
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                  >
                    <IconLibrary.ChevronLeft size={18} color="currentColor" />
                    Previous
                  </button>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#f26522] to-[#d4541a] text-white rounded-xl font-semibold shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all duration-200"
                    >
                      Continue
                      <IconLibrary.ChevronRight size={18} color="white" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${isSubmitting
                          ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5'
                        }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <IconLibrary.Check size={18} color="white" />
                          Create Shipment
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminForm;
