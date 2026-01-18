import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar.jsx";
import AdminHeader from "../../components/AdminHeader.jsx";
import ResponsiveContainer from "../../components/ResponsiveContainer.jsx";
import { IconLibrary } from "../../components/IconLibrary.jsx";

function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [showDetails, setShowDetails] = useState(null);

  const orders = [
    { id: "ORD-001", customer: "John Doe", amount: 5250.00, status: "Delivered", date: "Mar 18, 2025", courier: "Delhivery", tracking: "DL123456789" },
    { id: "ORD-002", customer: "Sarah Smith", amount: 1850.50, status: "In-Transit", date: "Mar 17, 2025", courier: "BlueDart", tracking: "BD987654321" },
    { id: "ORD-003", customer: "Mike Johnson", amount: 4200.00, status: "Processing", date: "Mar 16, 2025", courier: "FedEx", tracking: "FX456123789" },
    { id: "ORD-004", customer: "Emily Brown", amount: 952.25, status: "Pending", date: "Mar 15, 2025", courier: "Delhivery", tracking: "DL111222333" },
    { id: "ORD-005", customer: "Robert Davis", amount: 5600.00, status: "Delivered", date: "Mar 14, 2025", courier: "Ecom Express", tracking: "EX555666777" },
    { id: "ORD-006", customer: "Jessica Wilson", amount: 3200.00, status: "In-Transit", date: "Mar 13, 2025", courier: "Delhivery", tracking: "DL888999000" },
    { id: "ORD-007", customer: "Thomas Garcia", amount: 2150.00, status: "Processing", date: "Mar 12, 2025", courier: "BlueDart", tracking: "BD222333444" },
    { id: "ORD-008", customer: "Lisa Martinez", amount: 4800.00, status: "Delivered", date: "Mar 11, 2025", courier: "FedEx", tracking: "FX666777888" },
    { id: "ORD-009", customer: "James Wilson", amount: 1200.50, status: "Pending", date: "Mar 10, 2025", courier: "Delhivery", tracking: "DL444555666" },
    { id: "ORD-010", customer: "Patricia Lee", amount: 3850.00, status: "Delivered", date: "Mar 9, 2025", courier: "Ecom Express", tracking: "EX999111222" },
  ];

  const filteredOrders = orders
    .filter((order) => filterStatus === "All" || order.status === filterStatus)
    .filter((order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.tracking.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.date) - new Date(a.date);
      if (sortBy === "amount") return b.amount - a.amount;
      return a.id.localeCompare(b.id);
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-600";
      case "In-Transit":
        return "bg-blue-50 text-blue-600";
      case "Processing":
        return "bg-yellow-50 text-yellow-600";
      case "Pending":
        return "bg-slate-50 text-slate-600";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  const statusOptions = ["All", "Pending", "Processing", "In-Transit", "Delivered"];

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
        {/* Filters & Search */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by order ID, customer, or tracking number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f26522] focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-lg text-slate-700 font-medium hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#f26522]"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-lg text-slate-700 font-medium hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#f26522]"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="id">Sort by ID</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Courier</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 font-mono">{order.id}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-700">{order.customer}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">₹{order.amount.toFixed(2)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-600 text-sm">{order.courier}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm">{order.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowDetails(showDetails === order.id ? null : order.id)}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            title="View Details"
                          >
                            <IconLibrary.Eye size={18} color="currentColor" strokeWidth={2} />
                          </button>
                          <button 
                            className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Edit"
                          >
                            <IconLibrary.Edit size={18} color="currentColor" strokeWidth={2} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <p className="text-slate-500 font-medium">No orders found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Order Details */}
          {showDetails && (
            <div className="bg-slate-50 border-t border-slate-100 p-6">
              {filteredOrders.find((o) => o.id === showDetails) && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Order ID</p>
                    <p className="font-mono font-bold text-slate-900">{showDetails}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Tracking Number</p>
                    <p className="font-mono font-bold text-slate-900">{filteredOrders.find((o) => o.id === showDetails)?.tracking}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Amount</p>
                    <p className="font-bold text-slate-900">₹{filteredOrders.find((o) => o.id === showDetails)?.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Last Updated</p>
                    <p className="font-bold text-slate-900">{filteredOrders.find((o) => o.id === showDetails)?.date}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminOrders;
