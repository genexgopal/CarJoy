import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar.jsx";
import AdminHeader from "../../components/AdminHeader.jsx";
import ResponsiveContainer from "../../components/ResponsiveContainer.jsx";
import { IconLibrary } from "../../components/IconLibrary.jsx";

function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "User", status: "Active", joinDate: "Jan 15, 2025" },
    { id: 2, name: "Sarah Smith", email: "sarah@example.com", role: "Admin", status: "Active", joinDate: "Feb 10, 2025" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "User", status: "Inactive", joinDate: "Mar 5, 2025" },
    { id: 4, name: "Emily Brown", email: "emily@example.com", role: "User", status: "Active", joinDate: "Mar 12, 2025" },
    { id: 5, name: "Robert Davis", email: "robert@example.com", role: "Admin", status: "Active", joinDate: "Feb 20, 2025" },
    { id: 6, name: "Jessica Wilson", email: "jessica@example.com", role: "User", status: "Active", joinDate: "Mar 1, 2025" },
    { id: 7, name: "Thomas Garcia", email: "thomas@example.com", role: "User", status: "Inactive", joinDate: "Jan 28, 2025" },
    { id: 8, name: "Lisa Martinez", email: "lisa@example.com", role: "User", status: "Active", joinDate: "Mar 8, 2025" },
  ];

  const filteredUsers = users
    .filter((user) => filterRole === "All" || user.role === filterRole)
    .filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getRoleColor = (role) => {
    return role === "Admin" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600";
  };

  const getStatusColor = (status) => {
    return status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-600";
  };

  const handleDelete = (id) => {
    // Implement delete logic
    console.log("Delete user:", id);
    setShowDeleteConfirm(null);
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
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f26522] focus:border-transparent"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-lg text-slate-700 font-medium hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#f26522]"
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Join Date</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{user.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-600 text-sm">{user.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm">{user.joinDate}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            title="Edit"
                          >
                            <IconLibrary.Edit size={18} color="currentColor" strokeWidth={2} />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(user.id)}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            title="Delete"
                          >
                            <IconLibrary.Trash size={18} color="currentColor" strokeWidth={2} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <p className="text-slate-500 font-medium">No users found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 rounded-2xl">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-xl font-black text-slate-900 mb-2">Delete User?</h3>
              <p className="text-slate-600 mb-6">This action cannot be undone. Are you sure you want to delete this user?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminUsers;
