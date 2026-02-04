import { useState } from "react";
import AdminNavbar from "../../components/AdminNavbar.jsx";
import AdminHeader from "../../components/AdminHeader.jsx";
import ResponsiveContainer from "../../components/ResponsiveContainer.jsx";

function AdminBilling() {
  const [invoices] = useState([
    { id: "INV-001", date: "Mar 18, 2025", amount: 5250.00, status: "Paid", dueDate: "Mar 25, 2025", items: 45 },
    { id: "INV-002", date: "Mar 11, 2025", amount: 3870.50, status: "Paid", dueDate: "Mar 18, 2025", items: 32 },
    { id: "INV-003", date: "Mar 04, 2025", amount: 4200.00, status: "Paid", dueDate: "Mar 11, 2025", items: 38 },
    { id: "INV-004", date: "Feb 25, 2025", amount: 2950.75, status: "Pending", dueDate: "Mar 04, 2025", items: 28 },
    { id: "INV-005", date: "Feb 18, 2025", amount: 6100.00, status: "Overdue", dueDate: "Feb 25, 2025", items: 52 },
  ]);

  const totalBilled = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = invoices.filter(inv => inv.status === "Paid").reduce((sum, inv) => sum + inv.amount, 0);
  const totalPending = invoices.filter(inv => inv.status === "Pending").reduce((sum, inv) => sum + inv.amount, 0);

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-50 text-emerald-600";
      case "Pending":
        return "bg-yellow-50 text-yellow-600";
      case "Overdue":
        return "bg-red-50 text-red-600";
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
          {/* Billing Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-all">
              <p className="text-slate-500 text-sm font-bold mb-2">Total Billed</p>
              <p className="text-4xl font-black text-slate-900">₹{totalBilled.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <p className="text-emerald-700 text-sm font-bold mb-2">Total Paid</p>
              <p className="text-4xl font-black text-emerald-600">₹{totalPaid.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <p className="text-red-700 text-sm font-bold mb-2">Outstanding</p>
              <p className="text-4xl font-black text-red-600">₹{totalPending.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
            <div className="px-6 py-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-900">Recent Invoices</h2>
              <button className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-all">
                + New Invoice
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Invoice ID</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Items</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Due Date</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 font-mono">{invoice.id}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-600">{invoice.date}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">₹{invoice.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-600 font-medium">{invoice.items} items</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-600">{invoice.dueDate}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors">
                            View
                          </button>
                          {invoice.status !== "Paid" && (
                            <button className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors">
                              Pay
                            </button>
                          )}
                        </div>
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

export default AdminBilling;
