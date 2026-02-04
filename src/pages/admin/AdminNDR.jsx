import { useState } from "react";
import AdminNavbar from "../../components/AdminNavbar.jsx";
import AdminHeader from "../../components/AdminHeader.jsx";
import ResponsiveContainer from "../../components/ResponsiveContainer.jsx";

function AdminNDR() {
  const [ndrRecords] = useState([
    { id: "NDR-001", trackingId: "DL123456789", reason: "Recipient Not Available", address: "123 Main St, NY", date: "Mar 18, 2025", status: "Pending", attempts: 1 },
    { id: "NDR-002", trackingId: "BD987654321", reason: "Address Incomplete", address: "456 Oak Ave, CA", date: "Mar 17, 2025", status: "Resolved", attempts: 2 },
    { id: "NDR-003", trackingId: "FX456123789", reason: "Recipient Refused", address: "789 Pine Rd, IL", date: "Mar 16, 2025", status: "Pending", attempts: 1 },
    { id: "NDR-004", trackingId: "EX555666777", reason: "Location Not Found", address: "321 Elm St, TX", date: "Mar 15, 2025", status: "Resolved", attempts: 3 },
    { id: "NDR-005", trackingId: "DL888999000", reason: "Recipient Not Available", address: "654 Maple Dr, FL", date: "Mar 14, 2025", status: "Pending", attempts: 1 },
  ]);

  const pendingCount = ndrRecords.filter(r => r.status === "Pending").length;
  const resolvedCount = ndrRecords.filter(r => r.status === "Resolved").length;

  const getStatusColor = (status) => {
    return status === "Resolved" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600";
  };

  const getReasonColor = (reason) => {
    switch (reason) {
      case "Recipient Not Available":
        return "bg-blue-50 text-blue-600";
      case "Address Incomplete":
        return "bg-yellow-50 text-yellow-600";
      case "Recipient Refused":
        return "bg-red-50 text-red-600";
      case "Location Not Found":
        return "bg-purple-50 text-purple-600";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <AdminNavbar />
      <div className="flex-1 flex flex-col min-h-screen">
        <AdminHeader />
        
        {/* Main Content */}
        <ResponsiveContainer>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-all">
              <p className="text-slate-500 text-sm font-bold mb-2">Total NDR</p>
              <p className="text-4xl font-black text-slate-900">{ndrRecords.length}</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
              <p className="text-orange-700 text-sm font-bold mb-2">Pending</p>
              <p className="text-4xl font-black text-orange-600">{pendingCount}</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <p className="text-emerald-700 text-sm font-bold mb-2">Resolved</p>
              <p className="text-4xl font-black text-emerald-600">{resolvedCount}</p>
            </div>
          </div>

          {/* NDR Table */}
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
            <div className="px-6 py-6 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-900">NDR Records</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">NDR ID</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Tracking</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Reason</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Address</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Attempts</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ndrRecords.map((ndr, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 font-mono">{ndr.id}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-600 text-sm font-mono">{ndr.trackingId}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getReasonColor(ndr.reason)}`}>
                          {ndr.reason}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-600 text-sm">{ndr.address}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{ndr.attempts}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(ndr.status)}`}>
                          {ndr.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm">{ndr.date}</td>
                      <td className="px-6 py-4">
                        <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors">
                          Resolve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminNDR;
