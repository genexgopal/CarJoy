import React, { useState } from "react";
import AdminNavbar from "../../components/AdminNavbar.jsx";
import AdminHeader from "../../components/AdminHeader.jsx";
import ResponsiveContainer from "../../components/ResponsiveContainer.jsx";
import { IconLibrary } from "../../components/IconLibrary.jsx";

function AdminReports() {
  const [reportType, setReportType] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState("March 2025");

  const monthlyStats = [
    { month: "January 2025", orders: 1245, revenue: 125000, deliveries: 1198, failed: 47 },
    { month: "February 2025", orders: 1876, revenue: 187600, deliveries: 1821, failed: 55 },
    { month: "March 2025", orders: 2340, revenue: 234000, deliveries: 2287, failed: 53 },
  ];

  const currentStats = monthlyStats.find(s => s.month === selectedMonth) || monthlyStats[2];

  const reports = [
    { name: "Monthly Revenue Report", description: "Detailed revenue breakdown by month", date: "Updated Mar 18, 2025" },
    { name: "Delivery Performance", description: "On-time delivery metrics and analysis", date: "Updated Mar 18, 2025" },
    { name: "Customer Analytics", description: "User engagement and order patterns", date: "Updated Mar 17, 2025" },
    { name: "Shipping Cost Report", description: "Courier charges and optimization", date: "Updated Mar 17, 2025" },
    { name: "Fraud Detection", description: "Suspicious activities and anomalies", date: "Updated Mar 16, 2025" },
    { name: "Inventory Report", description: "Stock levels and warehouse status", date: "Updated Mar 16, 2025" },
  ];

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
          {/* Report Type Selector */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => setReportType("monthly")}
                  className={`px-6 py-2 rounded-lg font-bold transition-all ${
                    reportType === "monthly"
                      ? "bg-[#f26522] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setReportType("weekly")}
                  className={`px-6 py-2 rounded-lg font-bold transition-all ${
                    reportType === "weekly"
                      ? "bg-[#f26522] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setReportType("custom")}
                  className={`px-6 py-2 rounded-lg font-bold transition-all ${
                    reportType === "custom"
                      ? "bg-[#f26522] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Custom
                </button>
              </div>
              {reportType === "monthly" && (
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-medium"
                >
                  {monthlyStats.map((s) => (
                    <option key={s.month} value={s.month}>
                      {s.month}
                    </option>
                  ))}
                </select>
              )}
              <button className="ml-auto px-6 py-2 bg-[#f26522] text-white rounded-lg font-bold hover:bg-[#d4541a] transition-all">
                Download Report
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-all">
              <p className="text-slate-500 text-sm font-bold mb-2">Total Orders</p>
              <p className="text-4xl font-black text-slate-900">{currentStats.orders}</p>
              <p className="text-xs text-slate-500 mt-2">in {selectedMonth}</p>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-all">
              <p className="text-slate-500 text-sm font-bold mb-2">Total Revenue</p>
              <p className="text-4xl font-black text-emerald-600">₹{currentStats.revenue.toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-2">in {selectedMonth}</p>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-all">
              <p className="text-slate-500 text-sm font-bold mb-2">Successful Deliveries</p>
              <p className="text-4xl font-black text-blue-600">{currentStats.deliveries}</p>
              <p className="text-xs text-slate-500 mt-2">{((currentStats.deliveries / currentStats.orders) * 100).toFixed(1)}% success rate</p>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-all">
              <p className="text-slate-500 text-sm font-bold mb-2">Failed Deliveries</p>
              <p className="text-4xl font-black text-red-600">{currentStats.failed}</p>
              <p className="text-xs text-slate-500 mt-2">{((currentStats.failed / currentStats.orders) * 100).toFixed(1)}% failure rate</p>
            </div>
          </div>

          {/* Available Reports */}
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-6">Available Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report, idx) => (
                <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-all group cursor-pointer">
                  <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">📊</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{report.name}</h3>
                  <p className="text-slate-600 text-sm mb-4">{report.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-500">{report.date}</p>
                    <button className="px-4 py-2 bg-[#f26522] text-white rounded-lg text-xs font-bold hover:bg-[#d4541a] transition-all">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminReports;
