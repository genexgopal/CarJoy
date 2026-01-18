import React, { useState, useRef, useEffect } from "react";
import { IconLibrary, IconSizes } from "./IconLibrary.jsx";

function AdminHeader() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Mock user data
  const user = {
    name: "Admin User",
    email: "admin@shipmyparcel.com",
    role: "Administrator",
  };

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="flex justify-between items-center px-8 py-5">
        <div className="flex-1"></div>

        {/* User Info & Settings */}
        <div className="flex items-center gap-4">
          {/* User Info */}
          <div className="text-right pr-4 border-r border-slate-200">
            <p className="text-sm font-bold text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500 font-medium">{user.email}</p>
          </div>

          {/* User Icon with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center justify-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-all duration-200 group"
              title="User Menu"
            >
              {/* User Avatar Circle */}
              <div className="relative">
                <div className="w-11 h-11 bg-gradient-to-br from-[#f26522] via-orange-500 to-[#d4541a] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-lg transition-shadow">
                  <IconLibrary.User 
                    size={24} 
                    color="white"
                    strokeWidth={2}
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
              </div>

              {/* Settings Icon */}
              <div className="p-1 rounded-lg group-hover:bg-orange-50 transition-colors duration-200">
                <IconLibrary.Settings 
                  size={22}
                  color="#94a3b8"
                  className="group-hover:text-[#f26522] group-hover:rotate-90 transition-all duration-300"
                  strokeWidth={2}
                />
              </div>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden">
                {/* User Info Header */}
                <div className="bg-gradient-to-r from-[#f26522] to-orange-500 p-4">
                  <p className="text-sm font-bold text-white">{user.name}</p>
                  <p className="text-xs text-orange-100">{user.role}</p>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-3 group">
                    <IconLibrary.User 
                      size={20} 
                      color="#f26522"
                      strokeWidth={2}
                    />
                    <span className="group-hover:translate-x-0.5 transition-transform">My Profile</span>
                  </button>
                  <button className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-3 group">
                    <IconLibrary.Settings 
                      size={20}
                      color="#f26522"
                      strokeWidth={2}
                    />
                    <span className="group-hover:translate-x-0.5 transition-transform">Settings</span>
                  </button>
                  <button className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-3 group">
                    <IconLibrary.Lock 
                      size={20}
                      color="#f26522"
                      strokeWidth={2}
                    />
                    <span className="group-hover:translate-x-0.5 transition-transform">Change Password</span>
                  </button>
                  <button className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-3 group">
                    <IconLibrary.Clock 
                      size={20}
                      color="#f26522"
                      strokeWidth={2}
                    />
                    <span className="group-hover:translate-x-0.5 transition-transform">Activity Log</span>
                  </button>
                </div>

                {/* Logout Button */}
                <div className="border-t border-slate-200 p-2">
                  <button className="w-full px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 group rounded-lg">
                    <IconLibrary.LogOut 
                      size={20}
                      color="#dc2626"
                      strokeWidth={2}
                    />
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
