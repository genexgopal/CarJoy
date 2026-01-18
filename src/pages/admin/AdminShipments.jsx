import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar.jsx";
import AdminHeader from "../../components/AdminHeader.jsx";
import ResponsiveContainer from "../../components/ResponsiveContainer.jsx";
import { IconLibrary } from "../../components/IconLibrary.jsx";

function AdminShipments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourier, setFilterCourier] = useState("All");

  const shipments = [
    { id: "SHP-001", tracking: "DL123456789", courier: "Delhivery", weight: "2.5 kg", status: "Delivered", from: "New York", to: "Los Angeles", date: "Mar 18, 2025" },
    { id: "SHP-002", tracking: "BD987654321", courier: "BlueDart", weight: "1.2 kg", status: "In-Transit", from: "Chicago", to: "Houston", date: "Mar 17, 2025" },
    { id: "SHP-003", tracking: "FX456123789", courier: "FedEx", weight: "3.8 kg", status: "Picked", from: "Phoenix", to: "Philadelphia", date: "Mar 16, 2025" },
    { id: "SHP-004", tracking: "EX555666777", courier: "Ecom Express", weight: "0.9 kg", status: "Pending", from: "San Antonio", to: "San Diego", date: "Mar 15, 2025" },
    { id: "SHP-005", tracking: "DL888999000", courier: "Delhivery", weight: "2.1 kg", status: "Delivered", from: "Dallas", to: "San Jose", date: "Mar 14, 2025" },
  ];

  const filteredShipments = shipments
    .filter((s) => filterCourier === "All" || s.courier === filterCourier)
    .filter((s) =>
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.tracking.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-600";
      case "In-Transit":
        return "bg-blue-50 text-blue-600";
      case "Picked":
        return "bg-purple-50 text-purple-600";
      case "Pending":
        return "bg-yellow-50 text-yellow-600";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

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
          {/* Filters */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by ID or tracking number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f26522] focus:border-transparent"
                />
              </div>
              <select
                value={filterCourier}
                onChange={(e) => setFilterCourier(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-lg text-slate-700 font-medium hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#f26522]"
              >
                <option value="All">All Couriers</option>
                <option value="Delhivery">Delhivery</option>
                <option value="BlueDart">BlueDart</option>
                <option value="FedEx">FedEx</option>
                <option value="Ecom Express">Ecom Express</option>
              </select>
            </div>
          </div>

          {/* Shipments Table */}
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Tracking</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Courier</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Weight</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Route</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShipments.length > 0 ? (
                    filteredShipments.map((shipment, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900 font-mono">{shipment.id}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-slate-600 text-sm font-mono">{shipment.tracking}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-700">{shipment.courier}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-slate-600">{shipment.weight}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-slate-600 text-sm">{shipment.from} → {shipment.to}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(shipment.status)}`}>
                            {shipment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-sm">{shipment.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <p className="text-slate-500 font-medium">No shipments found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminShipments;
