import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

// User pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AllRooms from "./pages/AllRooms";
import MyReservations from "./pages/MyReservations";
import BookRoom from "./pages/BookRoom";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminRooms from "./pages/admin/AdminRooms";
import AdminReservations from "./pages/admin/AdminReservations";

// Utility functions
const isAdmin = () =>
  localStorage.getItem("is_admin") === "true" ||
  localStorage.getItem("is_staff") === "true";

const isAuthenticated = () =>
  !!localStorage.getItem("token") || !!localStorage.getItem("access");

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected User Routes */}
        {isAuthenticated() ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/rooms" element={<AllRooms />} />
            <Route path="/book" element={<BookRoom />} />
            <Route path="/my-reservations" element={<MyReservations />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" replace />} />
        )}

        {/* Admin Routes */}
        {isAdmin() ? (
          <>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/rooms" element={<AdminRooms />} />
            <Route path="/admin/reservations" element={<AdminReservations />} />
          </>
        ) : (
          <>
            <Route
              path="/admin-dashboard"
              element={<Navigate to="/dashboard" replace />}
            />
            <Route
              path="/admin/*"
              element={<Navigate to="/dashboard" replace />}
            />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
