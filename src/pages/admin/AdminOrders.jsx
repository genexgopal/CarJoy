import React, { useState, useMemo } from "react";
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

  const filteredOrders = useMemo(() => {
    return orders
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
  }, [orders, filterStatus, searchTerm, sortBy]);

  const getStatusStyles = (status) => {
    switch (status) {
      case "Delivered":
        return { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", icon: IconLibrary.Check };
      case "In-Transit":
        return { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", icon: IconLibrary.Truck };
      case "Processing":
        return { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", icon: IconLibrary.Clock };
      case "Pending":
        return { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400", icon: IconLibrary.Clock };
      default:
        return { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400", icon: IconLibrary.Clock };
    }
  };

  const statusOptions = ["All", "Pending", "Processing", "In-Transit", "Delivered"];

  // Get counts for status badges
  const statusCounts = useMemo(() => {
    const counts = { All: orders.length };
    statusOptions.slice(1).forEach(status => {
      counts[status] = orders.filter(o => o.status === status).length;
    });
    return counts;
  }, [orders]);

  const selectedOrder = useMemo(() => {
    return showDetails ? filteredOrders.find((o) => o.id === showDetails) : null;
  }, [showDetails, filteredOrders]);

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
              <h1 className="text-2xl font-bold text-slate-800">Orders Management</h1>
              <p className="text-sm text-slate-500 mt-1">View and manage all customer orders</p>
            </div>
            <Link
              to="/admin/form"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#f26522] to-[#d4541a] text-white rounded-xl font-semibold shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              <IconLibrary.Plus size={18} color="white" strokeWidth={2} />
              New Order
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Orders", value: orders.length, color: "from-blue-500 to-blue-600", bg: "bg-blue-50" },
              { label: "Delivered", value: statusCounts.Delivered, color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50" },
              { label: "In Transit", value: statusCounts["In-Transit"], color: "from-purple-500 to-purple-600", bg: "bg-purple-50" },
              { label: "Pending", value: statusCounts.Pending + statusCounts.Processing, color: "from-amber-500 to-amber-600", bg: "bg-amber-50" },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 border border-slate-100 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center shadow-md mb-3`}>
                  <IconLibrary.Package size={20} color="white" strokeWidth={2} />
                </div>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Search & Filters Card */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 mb-6 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <IconLibrary.Search size={18} color="currentColor" strokeWidth={2} />
                </div>
                <input
                  type="text"
                  placeholder="Search by order ID, customer, or tracking number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f26522]/20 focus:border-[#f26522] focus:bg-white transition-all duration-200"
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-2 flex-wrap">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      filterStatus === status
                        ? "bg-gradient-to-r from-[#f26522] to-[#d4541a] text-white shadow-md shadow-orange-500/25"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {status}
                    <span className={`ml-1.5 px-1.5 py-0.5 rounded-md text-xs ${
                      filterStatus === status ? "bg-white/20" : "bg-slate-200"
                    }`}>
                      {statusCounts[status]}
                    </span>
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#f26522]/20 focus:border-[#f26522] transition-all duration-200 cursor-pointer"
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="id">Sort by ID</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Courier</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => {
                      const statusStyles = getStatusStyles(order.status);
                      const isExpanded = showDetails === order.id;
                      return (
                        <React.Fragment key={order.id}>
                          <tr className={`hover:bg-slate-50/50 transition-colors group ${isExpanded ? 'bg-slate-50/50' : ''}`}>
                            <td className="px-6 py-4">
                              <p className="font-semibold text-slate-800 font-mono">{order.id}</p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-xs font-semibold text-slate-600">
                                  {order.customer.split(' ').map(n => n[0]).join('')}
                                </div>
                                <p className="font-medium text-slate-700">{order.customer}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-bold text-slate-800">₹{order.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-slate-100 rounded-md flex items-center justify-center">
                                  <IconLibrary.Truck size={14} color="#64748b" strokeWidth={2} />
                                </div>
                                <p className="text-slate-600 text-sm font-medium">{order.courier}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusStyles.bg} ${statusStyles.text}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot}`}></span>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-slate-500 text-sm font-medium">{order.date}</p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setShowDetails(isExpanded ? null : order.id)}
                                  className={`p-2 rounded-lg transition-all duration-200 ${
                                    isExpanded
                                      ? 'bg-[#f26522] text-white shadow-md'
                                      : 'text-slate-400 hover:text-[#f26522] hover:bg-orange-50'
                                  }`}
                                  title={isExpanded ? "Hide Details" : "View Details"}
                                >
                                  <IconLibrary.Eye size={18} color="currentColor" strokeWidth={2} />
                                </button>
                                <button
                                  className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                  title="Edit Order"
                                >
                                  <IconLibrary.Edit size={18} color="currentColor" strokeWidth={2} />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expanded Order Details Row */}
                          {isExpanded && selectedOrder && (
                            <tr>
                              <td colSpan="7" className="px-0 py-0">
                                <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-t border-b border-slate-200 p-6 animate-in slide-in-from-top-2 duration-200">
                                  <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Order Info */}
                                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                                      <div className="bg-white rounded-xl p-4 border border-slate-100">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Order ID</p>
                                        <p className="font-mono font-bold text-slate-800">{selectedOrder.id}</p>
                                      </div>
                                      <div className="bg-white rounded-xl p-4 border border-slate-100">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Tracking Number</p>
                                        <p className="font-mono font-bold text-slate-800 text-sm">{selectedOrder.tracking}</p>
                                      </div>
                                      <div className="bg-white rounded-xl p-4 border border-slate-100">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Total Amount</p>
                                        <p className="font-bold text-emerald-600">₹{selectedOrder.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                                      </div>
                                      <div className="bg-white rounded-xl p-4 border border-slate-100">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Order Date</p>
                                        <p className="font-bold text-slate-800">{selectedOrder.date}</p>
                                      </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="flex flex-row lg:flex-col gap-2">
                                      <button className="flex-1 lg:flex-none px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 flex items-center justify-center gap-2">
                                        <IconLibrary.Eye size={16} color="currentColor" />
                                        Track Order
                                      </button>
                                      <button className="flex-1 lg:flex-none px-4 py-2.5 bg-gradient-to-r from-[#f26522] to-[#d4541a] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
                                        <IconLibrary.Edit size={16} color="white" />
                                        Edit Order
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <IconLibrary.Package size={32} color="#94a3b8" strokeWidth={1.5} />
                          </div>
                          <p className="text-slate-600 font-semibold mb-1">No orders found</p>
                          <p className="text-slate-400 text-sm">Try adjusting your search or filter criteria</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            {filteredOrders.length > 0 && (
              <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-sm text-slate-500">
                  Showing <span className="font-semibold text-slate-700">{filteredOrders.length}</span> of{" "}
                  <span className="font-semibold text-slate-700">{orders.length}</span> orders
                </p>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                    Previous
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminOrders;
