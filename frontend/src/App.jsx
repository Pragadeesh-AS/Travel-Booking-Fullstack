import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminLogin from "./pages/auth/AdminLogin";

// User Pages
import Home from "./pages/Home";
import SearchBuses from "./pages/SearchBuses";
import SeatSelection from "./pages/SeatSelection";
import Payment from "./pages/Payment";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import ManageBuses from "./pages/admin/ManageBuses";
import ManageRoutes from "./pages/admin/ManageRoutes";
import ManageSeatLayouts from "./pages/admin/ManageSeatLayouts";
import ViewBookings from "./pages/admin/ViewBookings";

import "./styles/App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected User Routes */}
              <Route path="/search" element={<SearchBuses />} />
              <Route
                path="/seat-selection/:busId/:routeId"
                element={<SeatSelection />}
              />
              <Route
                path="/booking-form"
                element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/buses"
                element={
                  <AdminRoute>
                    <ManageBuses />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/routes"
                element={
                  <AdminRoute>
                    <ManageRoutes />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/seat-layouts"
                element={
                  <AdminRoute>
                    <ManageSeatLayouts />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/bookings"
                element={
                  <AdminRoute>
                    <ViewBookings />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
