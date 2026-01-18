import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar.jsx";
import AdminHeader from "../../components/AdminHeader.jsx";
import ResponsiveContainer from "../../components/ResponsiveContainer.jsx";
import { IconLibrary } from "../../components/IconLibrary.jsx";

function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("month");

  const stats = [
    { label: "Total Orders", value: "2,450", change: "+12%", icon: IconLibrary.Package, color: "bg-blue-50 text-blue-600" },
    { label: "Revenue", value: "$45,231", change: "+8%", icon: IconLibrary.DollarSign, color: "bg-emerald-50 text-emerald-600" },
    { label: "Active Users", value: "1,234", change: "+15%", icon: IconLibrary.Users, color: "bg-purple-50 text-purple-600" },
    { label: "Shipments", value: "892", change: "+5%", icon: IconLibrary.Truck, color: "bg-orange-50 text-orange-600" },
  ];

  const recentOrders = [
    { id: "ORD-001", customer: "John Doe", amount: "$250.00", status: "Delivered", date: "Mar 18, 2025" },
    { id: "ORD-002", customer: "Sarah Smith", amount: "$180.50", status: "In-Transit", date: "Mar 17, 2025" },
    { id: "ORD-003", customer: "Mike Johnson", amount: "$420.00", status: "Processing", date: "Mar 16, 2025" },
    { id: "ORD-004", customer: "Emily Brown", amount: "$95.25", status: "Pending", date: "Mar 15, 2025" },
    { id: "ORD-005", customer: "Robert Davis", amount: "$560.00", status: "Delivered", date: "Mar 14, 2025" },
  ];

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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon size={28} color="currentColor" strokeWidth={1.5} />
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
          <div className="px-6 py-6 border-b border-slate-100">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-900">Recent Orders</h2>
                <p className="text-slate-500 text-sm mt-1">Latest transactions from your platform</p>
              </div>
              <Link
                to="/admin/orders"
                className="text-sm font-bold text-[#f26522] hover:text-[#d4541a] transition-colors"
              >
                View All →
              </Link>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{order.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-700">{order.customer}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{order.amount}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Link
            to="/admin/users"
            className="bg-white border border-slate-100 rounded-2xl p-8 hover:shadow-lg hover:border-slate-200 transition-all group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform flex items-center justify-center w-12 h-12 rounded-lg bg-purple-50 text-purple-600">
              <IconLibrary.Users size={32} color="currentColor" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">Manage Users</h3>
            <p className="text-slate-500 text-sm">View and manage all registered users</p>
          </Link>

          <Link
            to="/admin/form"
            className="bg-white border border-slate-100 rounded-2xl p-8 hover:shadow-lg hover:border-slate-200 transition-all group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50 text-blue-600">
              <IconLibrary.Plus size={32} color="currentColor" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">Create Order</h3>
            <p className="text-slate-500 text-sm">Create and manage new shipments</p>
          </Link>

          <Link
            to="/admin/reports"
            className="bg-white border border-slate-100 rounded-2xl p-8 hover:shadow-lg hover:border-slate-200 transition-all group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform flex items-center justify-center w-12 h-12 rounded-lg bg-orange-50 text-orange-600">
              <IconLibrary.BarChart size={32} color="currentColor" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">Reports</h3>
            <p className="text-slate-500 text-sm">Generate analytics and reports</p>
          </Link>
        </div>
      </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminDashboard;
