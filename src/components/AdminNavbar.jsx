import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { IconLibrary } from "./IconLibrary.jsx";

function AdminNavbar() {
  // Initialize isExpanded from sessionStorage (persist across page navigation)
  const [isExpanded, setIsExpanded] = useState(() => {
    const stored = sessionStorage.getItem('sidebarExpanded');
    return stored === null ? true : stored === 'true';
  });
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isToggleHovered, setIsToggleHovered] = useState(false);
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
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // On mobile, always collapse; on desktop, respect the stored preference
      if (mobile) {
        setIsExpanded(false);
      } else {
        // Restore desktop preference from storage
        const stored = sessionStorage.getItem('sidebarExpanded');
        if (stored !== null) {
          setIsExpanded(stored === 'true');
        }
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Store state in session storage so pages can access it (desktop only)
  useEffect(() => {
    if (!isMobile) {
      sessionStorage.setItem('sidebarExpanded', isExpanded);
    }
  }, [isExpanded, isMobile]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Toggle sidebar with keyboard support
  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  // Handle keyboard navigation for toggle button
  const handleToggleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSidebar();
    }
  };

  const sidebarWidth = isExpanded ? "240px" : "72px";

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-[60] p-2.5 bg-secondary text-white rounded-xl shadow-lg hover:bg-secondary-dark transition-all duration-200"
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
        className={`bg-gradient-sidebar text-white h-screen fixed left-0 top-0 flex flex-col z-[56] shadow-2xl overflow-hidden ${isMobile
            ? mobileMenuOpen ? 'translate-x-0 sidebar-animate' : '-translate-x-full'
            : ''
          }
        ${isExpanded ? 'expanded-menu' : 'collapsed-menu'}
        `}
        style={{
          width: isMobile ? "280px" : sidebarWidth,
          transition: isMobile ? 'transform 0.3s ease' : 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Logo Section */}
        <div className={`py-5 border-b border-white/10 transition-all duration-300 ${isExpanded || isMobile ? "px-5" : "px-3"
          }`}>
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className={`relative transition-all duration-300 ${isExpanded || isMobile ? "w-12 h-12" : "w-10 h-10"
              }`}>
              {/* Logo Container with Glow */}
              <div className="absolute inset-0 bg-gradient-primary-diagonal rounded-xl opacity-80 blur-md group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-full h-full bg-gradient-primary-diagonal rounded-xl flex items-center justify-center shadow-lg">
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
                className={`nav-item relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${isActive(item.path)
                    ? "sidebar-nav-active text-white"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
              >
                {/* Icon */}
                <div className={`flex-shrink-0 transition-transform duration-200 ${hoveredItem === item.path && !isActive(item.path) ? 'scale-110' : ''
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
                      <p className="text-[10px] text-white truncate group-hover:text-white transition-colors">
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
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 ${!isExpanded && !isMobile ? "justify-center w-12" : ""
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
              onKeyDown={handleToggleKeyDown}
              onMouseEnter={() => setIsToggleHovered(true)}
              onMouseLeave={() => setIsToggleHovered(false)}
              className={`group flex items-center gap-2 px-3 py-2.5 w-full rounded-xl transition-all duration-300 ${!isExpanded ? "justify-center" : ""
                } ${isToggleHovered
                  ? "bg-primary-ring text-primary border border-primary/30"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-transparent"
                }`}
              title={isExpanded ? "Collapse Sidebar (Click to minimize)" : "Expand Sidebar (Click to expand)"}
              aria-label={isExpanded ? "Collapse sidebar navigation" : "Expand sidebar navigation"}
              aria-expanded={isExpanded}
              role="button"
              tabIndex={0}
            >
              {/* Animated Icon Container */}
              <div className={`relative flex items-center justify-center w-6 h-6 transition-all duration-300 ${isToggleHovered ? 'scale-110' : ''
                }`}>
                {/* Double Chevron for better visual */}
                <div className={`flex items-center transition-transform duration-300 ease-out ${isExpanded ? '' : 'rotate-180'
                  }`}>
                  <IconLibrary.ChevronLeft size={18} color="currentColor" strokeWidth={2.5} />
                </div>
              </div>

              {/* Label with animation */}
              {isExpanded && (
                <span className="text-sm font-medium overflow-hidden whitespace-nowrap transition-all duration-200">
                  {isToggleHovered ? "Click to collapse" : "Collapse"}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {!isExpanded && isToggleHovered && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg shadow-xl whitespace-nowrap z-50">
                  Click to expand
                  <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                </div>
              )}
            </button>
          )}

          {/* Logout Button */}
          <button
            className={`flex items-center gap-2 px-3 py-2.5 w-full rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200 ${!isExpanded && !isMobile ? "justify-center" : ""
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
