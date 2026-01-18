import { useState } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar.jsx";
import AdminHeader from "../../components/AdminHeader.jsx";
import ResponsiveContainer from "../../components/ResponsiveContainer.jsx";
import { IconLibrary } from "../../components/IconLibrary.jsx";

function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("month");

  const stats = [
    { label: "Total Orders", value: "2,450", change: "+12%", trend: "up", icon: IconLibrary.Package, color: "bg-blue-50 text-blue-600", iconBg: "from-blue-500 to-blue-600" },
    { label: "Revenue", value: "$45,231", change: "+8%", trend: "up", icon: IconLibrary.DollarSign, color: "bg-emerald-50 text-emerald-600", iconBg: "from-emerald-500 to-emerald-600" },
    { label: "Active Users", value: "1,234", change: "+15%", trend: "up", icon: IconLibrary.Users, color: "bg-purple-50 text-purple-600", iconBg: "from-purple-500 to-purple-600" },
    { label: "Shipments", value: "892", change: "+5%", trend: "up", icon: IconLibrary.Truck, color: "bg-orange-50 text-orange-600", iconBg: "from-[#f26522] to-[#d4541a]" },
  ];

  const recentOrders = [
    { id: "ORD-001", customer: "John Doe", amount: "$250.00", status: "Delivered", date: "Mar 18, 2025" },
    { id: "ORD-002", customer: "Sarah Smith", amount: "$180.50", status: "In-Transit", date: "Mar 17, 2025" },
    { id: "ORD-003", customer: "Mike Johnson", amount: "$420.00", status: "Processing", date: "Mar 16, 2025" },
    { id: "ORD-004", customer: "Emily Brown", amount: "$95.25", status: "Pending", date: "Mar 15, 2025" },
    { id: "ORD-005", customer: "Robert Davis", amount: "$560.00", status: "Delivered", date: "Mar 14, 2025" },
  ];

  const getStatusStyles = (status) => {
    switch (status) {
      case "Delivered":
        return { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" };
      case "In-Transit":
        return { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" };
      case "Processing":
        return { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" };
      case "Pending":
        return { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" };
      default:
        return { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" };
    }
  };

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
              <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
              <p className="text-sm text-slate-500 mt-1">Monitor your business metrics and recent activity</p>
            </div>

            {/* Time Range Filter */}
            <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
              {["today", "week", "month", "year"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    timeRange === range
                      ? "bg-[#f26522] text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon size={24} color="white" strokeWidth={2} />
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                    stat.trend === "up" ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50"
                  }`}>
                    {stat.trend === "up" ? "↑" : "↓"} {stat.change}
                  </span>
                </div>
                <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Orders Section */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-8">
            <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>
                  <p className="text-slate-500 text-sm mt-0.5">Latest transactions from your platform</p>
                </div>
                <Link
                  to="/admin/orders"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#f26522] hover:text-[#d4541a] transition-colors group"
                >
                  View All Orders
                  <IconLibrary.ChevronRight size={16} color="currentColor" className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/80">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order, idx) => {
                    const statusStyles = getStatusStyles(order.status);
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-800">{order.id}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-semibold text-slate-600">
                              {order.customer.split(' ').map(n => n[0]).join('')}
                            </div>
                            <p className="text-slate-700 font-medium">{order.customer}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-800">{order.amount}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusStyles.bg} ${statusStyles.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot}`}></span>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-sm font-medium">{order.date}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 rounded-lg text-slate-400 hover:text-[#f26522] hover:bg-orange-50 transition-all opacity-0 group-hover:opacity-100">
                            <IconLibrary.Eye size={18} color="currentColor" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                to: "/admin/users",
                icon: IconLibrary.Users,
                title: "Manage Users",
                desc: "View and manage all registered users",
                color: "purple",
                gradient: "from-purple-500 to-purple-600"
              },
              {
                to: "/admin/form",
                icon: IconLibrary.Plus,
                title: "Create Order",
                desc: "Create and manage new shipments",
                color: "blue",
                gradient: "from-blue-500 to-blue-600"
              },
              {
                to: "/admin/reports",
                icon: IconLibrary.BarChart,
                title: "Reports",
                desc: "Generate analytics and reports",
                color: "orange",
                gradient: "from-[#f26522] to-[#d4541a]"
              },
            ].map((link, idx) => (
              <Link
                key={idx}
                to={link.to}
                className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${link.gradient} rounded-xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <link.icon size={28} color="white" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-[#f26522] transition-colors">{link.title}</h3>
                <p className="text-slate-500 text-sm">{link.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[#f26522] opacity-0 group-hover:opacity-100 transition-opacity">
                  Go to {link.title.toLowerCase()}
                  <IconLibrary.ChevronRight size={16} color="currentColor" />
                </div>
              </Link>
            ))}
          </div>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminDashboard;
