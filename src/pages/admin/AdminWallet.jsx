import { useState } from "react";
import AdminNavbar from "../../components/AdminNavbar.jsx";
import AdminHeader from "../../components/AdminHeader.jsx";
import ResponsiveContainer from "../../components/ResponsiveContainer.jsx";

function AdminWallet() {
  const [transactions] = useState([
    { id: "TXN-001", type: "Credit", amount: 5000, description: "Shipment refund", date: "Mar 18, 2025", status: "Completed" },
    { id: "TXN-002", type: "Debit", amount: 2500, description: "Shipping charges", date: "Mar 17, 2025", status: "Completed" },
    { id: "TXN-003", type: "Credit", amount: 1000, description: "Cashback reward", date: "Mar 16, 2025", status: "Completed" },
    { id: "TXN-004", type: "Debit", amount: 3500, description: "COD charges", date: "Mar 15, 2025", status: "Pending" },
    { id: "TXN-005", type: "Credit", amount: 2000, description: "Promo credit", date: "Mar 14, 2025", status: "Completed" },
  ]);

  const balance = 45230.50;
  const totalCredit = transactions.filter(t => t.type === "Credit").reduce((sum, t) => sum + t.amount, 0);
  const totalDebit = transactions.filter(t => t.type === "Debit").reduce((sum, t) => sum + t.amount, 0);

  const getStatusColor = (status) => {
    return status === "Completed" ? "bg-emerald-50 text-emerald-600" : "bg-yellow-50 text-yellow-600";
  };

  const getTypeColor = (type) => {
    return type === "Credit" ? "text-emerald-600" : "text-red-600";
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <AdminNavbar />
      <div className="flex-1 flex flex-col min-h-screen">
        <AdminHeader />
        
        {/* Main Content */}
        <ResponsiveContainer>
          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Current Balance */}
            <div className="bg-gradient-primary-diagonal text-white rounded-2xl p-8 shadow-lg">
              <p className="text-slate-100 text-sm font-bold mb-2">Current Balance</p>
              <p className="text-4xl font-black mb-4">₹{balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
              <button className="w-full bg-white text-primary font-bold py-2 rounded-lg hover:bg-slate-50 transition-colors">
                Add Funds
              </button>
            </div>

            {/* Total Credits */}
            <div className="bg-white border border-slate-100 rounded-2xl p-8 hover:shadow-lg transition-all">
              <p className="text-slate-500 text-sm font-bold mb-2">Total Credits</p>
              <p className="text-4xl font-black text-emerald-600 mb-2">₹{totalCredit.toLocaleString()}</p>
              <p className="text-xs text-slate-500">{transactions.filter(t => t.type === "Credit").length} transactions</p>
            </div>

            {/* Total Debits */}
            <div className="bg-white border border-slate-100 rounded-2xl p-8 hover:shadow-lg transition-all">
              <p className="text-slate-500 text-sm font-bold mb-2">Total Debits</p>
              <p className="text-4xl font-black text-red-600 mb-2">₹{totalDebit.toLocaleString()}</p>
              <p className="text-xs text-slate-500">{transactions.filter(t => t.type === "Debit").length} transactions</p>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
            <div className="px-6 py-6 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-900">Recent Transactions</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Description</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 font-mono">{txn.id}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`font-bold ${getTypeColor(txn.type)}`}>
                          {txn.type === "Credit" ? "+" : "-"}₹{txn.amount}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">₹{txn.amount.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-600">{txn.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(txn.status)}`}>
                          {txn.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm">{txn.date}</td>
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

export default AdminWallet;
