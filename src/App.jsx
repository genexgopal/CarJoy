import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminForm from "./pages/admin/AdminForm.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminShipments from "./pages/admin/AdminShipments.jsx";
import AdminWallet from "./pages/admin/AdminWallet.jsx";
import AdminNDR from "./pages/admin/AdminNDR.jsx";
import AdminReports from "./pages/admin/AdminReports.jsx";
import AdminBilling from "./pages/admin/AdminBilling.jsx";

function App() {
    return (
        <Router>
            <Routes>

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/form" element={<AdminForm />} />
                <Route path="/admin/shipments" element={<AdminShipments />} />
                <Route path="/admin/wallet" element={<AdminWallet />} />
                <Route path="/admin/ndr" element={<AdminNDR />} />
                <Route path="/admin/reports" element={<AdminReports />} />
                <Route path="/admin/billing" element={<AdminBilling />} />
                <Route path="/admin-old" element={<AdminPage />} />
                <Route path="/report" element={<ReportsPage />} />
                <Route path="/" element={<LandingPage />} />
            </Routes>
        </Router>
    );
}

export default App;
