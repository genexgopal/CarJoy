import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { IconLibrary } from "./IconLibrary.jsx";

function AdminNavbar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path || (path !== "/admin" && location.pathname.startsWith(path));

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: IconLibrary.Dashboard, description: "Overview & Stats" },
    { path: "/admin/form", label: "Add Orders", icon: IconLibrary.Plus, description: "Create new orders" },
    { path: "/admin/shipments", label: "Shipments", icon: IconLibrary.Truck, description: "Track deliveries" },
    { path: "/admin/wallet", label: "Wallet", icon: IconLibrary.Wallet, description: "Payments & Balance" },
    { path: "/admin/ndr", label: "NDR", icon: IconLibrary.Alert, description: "Failed deliveries" },
    { path: "/admin/reports", label: "Reports", icon: IconLibrary.BarChart, description: "Analytics" },
    { path: "/admin/billing", label: "Billing", icon: IconLibrary.FileText, description: "Invoices" },
  ];

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Store state in session storage so pages can access it
  useEffect(() => {
    sessionStorage.setItem('sidebarExpanded', isExpanded);
  }, [isExpanded]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const sidebarWidth = isExpanded ? "240px" : "72px";

  return (
    <>
      <style>{`
        .sidebar-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }
        .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.4);
        }
        .nav-item-tooltip {
          opacity: 0;
          visibility: hidden;
          transform: translateX(-8px);
          transition: all 0.2s ease;
        }
        .nav-item:hover .nav-item-tooltip {
          opacity: 1;
          visibility: visible;
          transform: translateX(0);
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .sidebar-animate {
          animation: slideIn 0.3s ease-out;
        }
        .overlay-animate {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>

      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-[60] p-2.5 bg-[#003366] text-white rounded-xl shadow-lg hover:bg-[#002855] transition-all duration-200"
        >
          {mobileMenuOpen ? (
            <IconLibrary.ChevronLeft size={24} color="white" />
          ) : (
            <IconLibrary.Dashboard size={24} color="white" />
          )}
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[55] overlay-animate"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`bg-gradient-to-b from-[#001a4d] via-[#002855] to-[#003366] text-white h-screen fixed left-0 top-0 flex flex-col z-[56] shadow-2xl overflow-hidden ${
          isMobile
            ? mobileMenuOpen ? 'translate-x-0 sidebar-animate' : '-translate-x-full'
            : ''
        }`}
        style={{
          width: isMobile ? "280px" : sidebarWidth,
          transition: isMobile ? 'transform 0.3s ease' : 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Logo Section */}
        <div className={`py-5 border-b border-white/10 transition-all duration-300 ${
          isExpanded || isMobile ? "px-5" : "px-3"
        }`}>
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className={`relative transition-all duration-300 ${
              isExpanded || isMobile ? "w-12 h-12" : "w-10 h-10"
            }`}>
              {/* Logo Container with Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#f26522] to-[#d4541a] rounded-xl opacity-80 blur-md group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-[#f26522] to-[#d4541a] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">S</span>
              </div>
            </div>
            {(isExpanded || isMobile) && (
              <div className="overflow-hidden">
                <h1 className="text-lg font-bold text-white truncate">ShipMyParcel</h1>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Admin Panel</p>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Section Label */}
        {(isExpanded || isMobile) && (
          <div className="px-5 pt-6 pb-2">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Navigation</p>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 min-h-0 overflow-y-auto sidebar-scrollbar px-3 py-2">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                title={!isExpanded && !isMobile ? item.label : ""}
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`nav-item relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-[#f26522] to-[#d4541a] text-white shadow-lg shadow-orange-500/30"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {/* Icon */}
                <div className={`flex-shrink-0 transition-transform duration-200 ${
                  hoveredItem === item.path && !isActive(item.path) ? 'scale-110' : ''
                }`}>
                  <item.icon
                    size={22}
                    color="currentColor"
                    strokeWidth={2}
                  />
                </div>

                {/* Label & Description */}
                {(isExpanded || isMobile) && (
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="text-sm font-semibold truncate">{item.label}</p>
                    {(isExpanded || isMobile) && (
                      <p className="text-[10px] text-slate-400 truncate group-hover:text-slate-300 transition-colors">
                        {item.description}
                      </p>
                    )}
                  </div>
                )}

                {/* Active Indicator */}
                {isActive(item.path) && (
                  <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full"></div>
                )}

                {/* Tooltip for collapsed state */}
                {!isExpanded && !isMobile && (
                  <div className="nav-item-tooltip absolute left-full ml-3 px-3 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg shadow-xl whitespace-nowrap z-50">
                    {item.label}
                    <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Divider */}
        <div className="mx-3 border-t border-white/10"></div>

        {/* Bottom Section */}
        <div className={`p-3 space-y-2 ${isExpanded || isMobile ? "" : "flex flex-col items-center"}`}>
          {/* Settings Link */}
          <Link
            to="/admin/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 ${
              !isExpanded && !isMobile ? "justify-center w-12" : ""
            }`}
            title="Settings"
          >
            <IconLibrary.Settings size={20} color="currentColor" strokeWidth={2} />
            {(isExpanded || isMobile) && <span className="text-sm font-medium">Settings</span>}
          </Link>

          {/* Toggle Button (Desktop only) */}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className={`flex items-center gap-2 px-3 py-2.5 w-full rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all duration-200 ${
                !isExpanded ? "justify-center" : ""
              }`}
              title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              <div className={`transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`}>
                <IconLibrary.ChevronLeft size={18} color="currentColor" />
              </div>
              {isExpanded && <span className="text-sm font-medium">Collapse</span>}
            </button>
          )}

          {/* Logout Button */}
          <button
            className={`flex items-center gap-2 px-3 py-2.5 w-full rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200 ${
              !isExpanded && !isMobile ? "justify-center" : ""
            }`}
            title="Logout"
          >
            <IconLibrary.LogOut size={18} color="currentColor" />
            {(isExpanded || isMobile) && <span className="text-sm font-semibold">Logout</span>}
          </button>
        </div>
      </div>

      {/* Spacer that adjusts with sidebar (Desktop only) */}
      {!isMobile && (
        <div
          style={{
            width: sidebarWidth,
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      )}
    </>
  );
}

export default AdminNavbar;
