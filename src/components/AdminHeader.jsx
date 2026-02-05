import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IconLibrary } from "./IconLibrary.jsx";
import { useAuth } from "../context/AuthContext";

function AdminHeader() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();

  // Get user data from auth context with fallback
  const user = {
    name: authUser?.name || authUser?.email?.split('@')[0] || "User",
    email: authUser?.email || "",
    role: authUser?.role || "User",
    initials: authUser?.name
      ? authUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : authUser?.email?.charAt(0).toUpperCase() || "U",
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Mock notifications
  const notifications = [
    { id: 1, title: "New order received", message: "Order #ORD-006 from Sarah Wilson", time: "2 min ago", unread: true, type: "order" },
    { id: 2, title: "Shipment delivered", message: "Order #ORD-001 has been delivered", time: "15 min ago", unread: true, type: "success" },
    { id: 3, title: "Payment received", message: "$450.00 payment confirmed", time: "1 hour ago", unread: false, type: "payment" },
    { id: 4, title: "NDR Alert", message: "3 shipments need attention", time: "2 hours ago", unread: false, type: "alert" },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order": return { icon: IconLibrary.Package, bg: "bg-blue-100", color: "#3b82f6" };
      case "success": return { icon: IconLibrary.CheckCircle, bg: "bg-emerald-100", color: "#10b981" };
      case "payment": return { icon: IconLibrary.DollarSign, bg: "bg-purple-100", color: "#a855f7" };
      case "alert": return { icon: IconLibrary.Alert, bg: "bg-amber-100", color: "#f59e0b" };
      default: return { icon: IconLibrary.Info, bg: "bg-slate-100", color: "#64748b" };
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40">
      <div className="flex justify-between items-center px-6 py-4">
        {/* Left Section - Page Title & Breadcrumb */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-xs text-slate-500 font-medium">Welcome back, {user.name.split(' ')[0]}!</p>
          </div>
        </div>

        {/* Center Section - Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className={`relative transition-all duration-300 ${searchFocused ? 'scale-105' : ''}`}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <IconLibrary.Search
                size={18}
                color={searchFocused ? "var(--color-primary)" : "#94a3b8"}
                strokeWidth={2}
              />
            </div>
            <input
              type="text"
              placeholder="Search orders, customers, shipments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={`w-full pl-11 pr-4 py-2.5 bg-slate-50 border-2 rounded-xl text-sm font-medium text-slate-700 placeholder-slate-400 outline-none transition-all duration-300 ${
                searchFocused
                  ? 'border-primary bg-white shadow-lg shadow-primary'
                  : 'border-transparent hover:border-slate-200'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Section - Actions & User */}
        <div className="flex items-center gap-2">
          {/* Quick Action Buttons */}
          <button
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-primary transition-all duration-200 group"
            title="Refresh"
          >
            <IconLibrary.RefreshCw
              size={20}
              color="currentColor"
              strokeWidth={2}
              className="group-hover:rotate-180 transition-transform duration-500"
            />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2.5 rounded-xl transition-all duration-200 relative ${
                showNotifications
                  ? 'bg-primary text-white'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-primary'
              }`}
              title="Notifications"
            >
              <IconLibrary.Alert
                size={20}
                color="currentColor"
                strokeWidth={2}
              />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-secondary p-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-white">Notifications</h3>
                    <p className="text-xs text-slate-300">{unreadCount} unread</p>
                  </div>
                  <button className="text-xs font-medium text-orange-300 hover:text-orange-200 transition-colors">
                    Mark all read
                  </button>
                </div>

                {/* Notification Items */}
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => {
                    const { icon: NotifIcon, bg, color } = getNotificationIcon(notification.type);
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${
                          notification.unread ? 'bg-orange-50/50' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <NotifIcon size={18} color={color} strokeWidth={2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold text-slate-800 truncate">{notification.title}</p>
                              {notification.unread && (
                                <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5"></span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 truncate">{notification.message}</p>
                            <p className="text-[10px] text-slate-400 mt-1 font-medium">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="p-3 bg-slate-50 border-t border-slate-100">
                  <button className="w-full py-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-slate-200 mx-2"></div>

          {/* User Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                showDropdown ? 'bg-slate-100' : 'hover:bg-slate-50'
              }`}
              title="User Menu"
            >
              {/* User Avatar */}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-primary-diagonal rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {user.initials}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>

              {/* User Info */}
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">{user.role}</p>
              </div>

              {/* Dropdown Arrow */}
              <IconLibrary.ChevronDown
                size={16}
                color="#94a3b8"
                className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
              />
            </button>

            {/* User Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-3 w-60 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                {/* User Info Header */}
                <div className="bg-gradient-primary p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {user.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{user.name}</p>
                      <p className="text-xs text-orange-100">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  {[
                    { icon: IconLibrary.User, label: "My Profile" },
                    { icon: IconLibrary.Settings, label: "Settings" },
                    { icon: IconLibrary.Lock, label: "Change Password" },
                    { icon: IconLibrary.Clock, label: "Activity Log" },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-3 group"
                    >
                      <item.icon size={18} color="var(--color-primary)" strokeWidth={2} />
                      <span className="group-hover:translate-x-0.5 transition-transform">{item.label}</span>
                    </button>
                  ))}
                </div>

                {/* Logout Button */}
                <div className="border-t border-slate-200 p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 group rounded-xl"
                  >
                    <IconLibrary.LogOut size={18} color="#dc2626" strokeWidth={2} />
                    <span className="group-hover:translate-x-0.5 transition-transform">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHeader;
