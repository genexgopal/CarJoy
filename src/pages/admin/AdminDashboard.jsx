import { useState } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar.jsx";
import AdminHeader from "../../components/AdminHeader.jsx";
import ResponsiveContainer from "../../components/ResponsiveContainer.jsx";
import { IconLibrary } from "../../components/IconLibrary.jsx";

function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("month");

  const stats = [
    { label: "Total Orders", value: "2,450", change: "+12%", trend: "up", icon: IconLibrary.Package, color: "bg-indigo-50 text-indigo-600", iconBg: "from-indigo-500 to-indigo-600" },
    { label: "Revenue", value: "$45,231", change: "+8%", trend: "up", icon: IconLibrary.DollarSign, color: "bg-orange-50 text-orange-600", iconBg: "from-orange-500 to-orange-600" },
    { label: "Active Users", value: "1,234", change: "+15%", trend: "up", icon: IconLibrary.Users, color: "bg-blue-50 text-blue-600", iconBg: "from-blue-500 to-blue-600" },
    { label: "Shipments", value: "892", change: "+5%", trend: "up", icon: IconLibrary.Truck, color: "bg-primary-50 text-primary", iconBg: "bg-gradient-primary" },
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
        return { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" };
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
                      ? "bg-primary text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="relative bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1),0_8px_32px_-8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_-4px_rgba(79,70,229,0.15),0_16px_40px_-8px_rgba(0,0,0,0.12)] hover:-translate-y-2 hover:border-indigo-200 transition-all duration-300 group overflow-hidden"
              >
                {/* Gradient accent top border */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.iconBg.startsWith('bg-') ? 'from-indigo-500 to-blue-500' : stat.iconBg} opacity-80 group-hover:opacity-100 transition-opacity`}></div>

                {/* Subtle background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 via-transparent to-blue-50/0 group-hover:from-indigo-50/30 group-hover:to-blue-50/20 transition-all duration-300 pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-5">
                    <div className={`w-14 h-14 ${stat.iconBg.startsWith('bg-') ? stat.iconBg : `bg-gradient-to-br ${stat.iconBg}`} rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-xl group-hover:shadow-indigo-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <stat.icon size={26} color="white" strokeWidth={2} />
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm ${
                      stat.trend === "up"
                        ? "text-green-700 bg-green-50 border border-green-100"
                        : "text-red-700 bg-red-50 border border-red-100"
                    }`}>
                      <span className={`w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent ${
                        stat.trend === "up"
                          ? "border-b-[6px] border-b-green-500"
                          : "border-t-[6px] border-t-red-500"
                      }`}></span>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide mb-1.5">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-800 group-hover:text-indigo-700 transition-colors">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders Section */}
          <div className="relative bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1),0_8px_32px_-8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_-4px_rgba(79,70,229,0.12),0_16px_40px_-8px_rgba(0,0,0,0.1)] transition-all duration-300 overflow-hidden mb-8 group/table">
            {/* Gradient accent top border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 opacity-80 group-hover/table:opacity-100 transition-opacity"></div>

            {/* Header */}
            <div className="px-6 py-6 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-indigo-50/30 relative">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  {/* Icon container */}
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                    <IconLibrary.Package size={22} color="white" strokeWidth={2} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Recent Orders</h2>
                    <p className="text-slate-500 text-sm mt-0.5">Latest transactions from your platform</p>
                  </div>
                </div>
                <Link
                  to="/admin/orders"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all duration-200 group shadow-sm hover:shadow-md"
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
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80">
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order, idx) => {
                    const statusStyles = getStatusStyles(order.status);
                    return (
                      <tr key={idx} className="hover:bg-gradient-to-r hover:from-indigo-50/40 hover:to-transparent transition-all duration-200 group">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{order.id}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-700 border border-indigo-200/50 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                              {order.customer.split(' ').map(n => n[0]).join('')}
                            </div>
                            <p className="text-slate-700 font-semibold">{order.customer}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800">{order.amount}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border ${statusStyles.bg} ${statusStyles.text} border-current/10`}>
                            <span className={`w-2 h-2 rounded-full ${statusStyles.dot} animate-pulse`}></span>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 text-sm font-medium">{order.date}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-gradient-to-br hover:from-indigo-500 hover:to-blue-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 opacity-0 group-hover:opacity-100">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                to: "/admin/users",
                icon: IconLibrary.Users,
                title: "Manage Users",
                desc: "View and manage all registered users",
                color: "indigo",
                gradient: "from-indigo-500 to-indigo-600",
                shadowColor: "shadow-indigo-500/25",
                hoverShadowColor: "hover:shadow-indigo-500/30",
                borderHover: "hover:border-indigo-200"
              },
              {
                to: "/admin/form",
                icon: IconLibrary.Plus,
                title: "Create Order",
                desc: "Create and manage new shipments",
                color: "orange",
                gradient: "from-orange-500 to-orange-600",
                shadowColor: "shadow-orange-500/25",
                hoverShadowColor: "hover:shadow-orange-500/30",
                borderHover: "hover:border-orange-200"
              },
              {
                to: "/admin/reports",
                icon: IconLibrary.BarChart,
                title: "Reports",
                desc: "Generate analytics and reports",
                color: "blue",
                gradient: "from-blue-500 to-blue-600",
                shadowColor: "shadow-blue-500/25",
                hoverShadowColor: "hover:shadow-blue-500/30",
                borderHover: "hover:border-blue-200"
              },
            ].map((link, idx) => (
              <Link
                key={idx}
                to={link.to}
                className={`relative bg-white rounded-2xl p-7 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1),0_8px_32px_-8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_-4px_rgba(79,70,229,0.15),0_16px_40px_-8px_rgba(0,0,0,0.12)] hover:-translate-y-2 ${link.borderHover} transition-all duration-300 group overflow-hidden`}
              >
                {/* Gradient accent top border */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${link.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}></div>

                {/* Subtle background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${link.color}-50/0 via-transparent to-${link.color}-50/0 group-hover:from-${link.color}-50/30 group-hover:to-${link.color}-50/20 transition-all duration-300 pointer-events-none`}></div>

                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${link.gradient} rounded-xl flex items-center justify-center shadow-lg ${link.shadowColor} group-hover:shadow-xl ${link.hoverShadowColor} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 mb-5`}>
                    <link.icon size={30} color="white" strokeWidth={2} />
                  </div>
                  <h3 className={`text-xl font-bold text-slate-800 mb-2 group-hover:text-${link.color}-600 transition-colors`}>{link.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{link.desc}</p>
                  <div className={`mt-5 flex items-center gap-2 text-sm font-semibold text-${link.color}-600 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1`}>
                    Go to {link.title.toLowerCase()}
                    <IconLibrary.ChevronRight size={16} color="currentColor" className="group-hover:translate-x-1 transition-transform" />
                  </div>
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
