import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Public Pages
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";

// Protected Pages
import AdminPage from "./pages/AdminPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";

// Admin Pages (Protected)
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
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected User Routes */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                } />
                <Route path="/report" element={
                    <ProtectedRoute>
                        <ReportsPage />
                    </ProtectedRoute>
                } />

                {/* Protected Admin Routes */}
                <Route path="/admin" element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/admin/orders" element={
                    <ProtectedRoute>
                        <AdminOrders />
                    </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                    <ProtectedRoute>
                        <AdminUsers />
                    </ProtectedRoute>
                } />
                <Route path="/admin/form" element={
                    <ProtectedRoute>
                        <AdminForm />
                    </ProtectedRoute>
                } />
                <Route path="/admin/shipments" element={
                    <ProtectedRoute>
                        <AdminShipments />
                    </ProtectedRoute>
                } />
                <Route path="/admin/wallet" element={
                    <ProtectedRoute>
                        <AdminWallet />
                    </ProtectedRoute>
                } />
                <Route path="/admin/ndr" element={
                    <ProtectedRoute>
                        <AdminNDR />
                    </ProtectedRoute>
                } />
                <Route path="/admin/reports" element={
                    <ProtectedRoute>
                        <AdminReports />
                    </ProtectedRoute>
                } />
                <Route path="/admin/billing" element={
                    <ProtectedRoute>
                        <AdminBilling />
                    </ProtectedRoute>
                } />
                <Route path="/admin-old" element={
                    <ProtectedRoute>
                        <AdminPage />
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;
