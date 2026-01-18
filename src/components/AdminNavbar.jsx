import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IconLibrary, IconSizes, IconColors } from "./IconLibrary.jsx";

function AdminNavbar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();

  const isActive = (path) => location.pathname === path || (path !== "/admin" && location.pathname.startsWith(path));

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: IconLibrary.Dashboard },
    { path: "/admin/form", label: "Add Orders", icon: IconLibrary.Plus },
    { path: "/admin/shipments", label: "Shipments", icon: IconLibrary.Truck },
    { path: "/admin/wallet", label: "Wallet", icon: IconLibrary.Wallet },
    { path: "/admin/ndr", label: "NDR", icon: IconLibrary.Alert },
    { path: "/admin/reports", label: "Reports", icon: IconLibrary.BarChart },
    { path: "/admin/billing", label: "Billing", icon: IconLibrary.FileText },
  ];

  // Create a context/provider to pass sidebar state to pages
  React.useEffect(() => {
    // Store state in session storage so pages can access it
    sessionStorage.setItem('sidebarExpanded', isExpanded);
  }, [isExpanded]);

  return (
    <>
      <style>{`
        .sidebar-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .sidebar-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
        }
        .sidebar-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.6);
          border-radius: 3px;
        }
        .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.8);
        }
      `}</style>
      
      <div 
        className={`bg-gradient-to-b from-[#001a4d] to-[#003366] text-white min-h-screen fixed left-0 top-0 border-r border-slate-700 flex flex-col transition-all duration-300 ease-in-out z-50`}
        style={{ width: isExpanded ? "200px" : "60px" }}
      >
        {/* Logo Section */}
        <div className={`py-6 text-center border-b border-slate-700 bg-gradient-to-b from-[#001a4d] via-[#002855] to-[#003366] transition-all duration-300 flex flex-col items-center justify-center ${
          isExpanded ? "px-6" : "px-2"
        }`}>
          <div className={`flex justify-center mb-3 transition-all duration-300 ${
            isExpanded ? "p-3" : "p-2"
          }`}>
            <div className={`relative transition-all duration-300 ${
              isExpanded ? "h-32 w-32" : "h-20 w-20"
            }`}>
              {/* Glow effect background */}
              <div className="absolute inset-0 bg-white/20 blur-lg rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Logo with shadow effect */}
              <img 
                src={isExpanded ? "/src/assets/logo_i_admin.png" : "/src/assets/logo_i_a_64.png"}
                alt="ShipMyParcel Logo"
                className={`relative h-full w-full transition-all duration-300 hover:scale-110 drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] hover:drop-shadow-[0_0_20px_rgba(242,101,34,0.4)]`}
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
          {isExpanded && (
            <>
              <Link to="/admin" className="text-lg font-black hover:opacity-80 transition-opacity block">
                ShipMyParcel
              </Link>
              <p className="text-slate-300 text-xs mt-2 font-medium">Admin Dashboard</p>
            </>
          )}
        </div>

        {/* Navigation Items - Scrollable */}
        <nav 
          className="flex-1 py-4 overflow-y-auto sidebar-scrollbar transition-all duration-300"
          style={{ paddingLeft: isExpanded ? "1.25rem" : "0.5rem", paddingRight: isExpanded ? "1.25rem" : "0.5rem" }}
        >
          <div className={`space-y-2 ${!isExpanded && "flex flex-col items-center"}`}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                title={!isExpanded ? item.label : ""}
                className={`flex flex-col items-center justify-center transition-all duration-300 group rounded-xl ${
                  isExpanded 
                    ? "py-4 px-3 min-h-20" 
                    : "py-3 px-2 h-14 w-12"
                } ${
                  isActive(item.path)
                    ? "bg-gradient-to-br from-[#f26522] to-[#d4541a] text-white shadow-lg shadow-orange-500/40"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <div className="group-hover:scale-125 transition-transform duration-200">
                  <item.icon 
                    size={isExpanded ? 32 : 28}
                    color="currentColor"
                    strokeWidth={isExpanded ? 2 : 2.5}
                  />
                </div>
                {isExpanded && (
                  <span className="text-xs font-bold text-center leading-tight mt-2">{item.label}</span>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Divider */}
        <div className="border-t border-slate-700"></div>

        {/* Toggle & Logout Section */}
        <div className={`p-3 space-y-2 bg-slate-900/20 transition-all duration-300 ${
          isExpanded ? "px-4" : "px-2"
        }`}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse" : "Expand"}
            className={`w-full p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold transition-all flex items-center justify-center ${
              isExpanded ? "text-sm gap-2" : "text-lg"
            }`}
          >
            {isExpanded ? (
              <>
                <IconLibrary.ChevronLeft size={18} color="white" />
                Collapse
              </>
            ) : (
              <IconLibrary.ChevronRight size={18} color="white" />
            )}
          </button>
          <button 
            title="Logout"
            className={`w-full p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all flex items-center justify-center ${
              isExpanded ? "text-sm gap-2" : "text-lg"
            }`}
          >
            <IconLibrary.LogOut size={isExpanded ? 16 : 18} color="white" />
            {isExpanded && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Spacer that adjusts with sidebar */}
      <div 
        className="transition-all duration-300"
        style={{ width: isExpanded ? "200px" : "60px" }}
      />
    </>
  );
}

export default AdminNavbar;
