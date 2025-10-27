import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RoomList from './components/RoomList';
import Login from './components/Login';
import Register from './components/Register';
import MakeReservation from './components/MakeReservation';
import AdminPanel from './components/AdminPanel';
import AdminCreateReservation from './components/AdminCreateReservation';
import ManageUsers from './components/ManageUsers';
import ManageReservations from './components/ManageReservations';
import ManageRooms from './components/ManageRooms';
import AdminAddUser from './components/AdminAddUser';
import AdminAddRoom from './components/AdminAddRoom';
import ReservationList from "./components/ReservationList";
import EditRoom from "./components/EditRoom";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<RoomList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/make-reservation/:roomId" element={<MakeReservation />} />
        <Route path="/make-reservation" element={<MakeReservation />} />
        <Route path="/reservation-list" element={<ReservationList />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/create-reservation" element={<AdminCreateReservation />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />
          <Route path="/admin/manage-reservations" element={<ManageReservations />} />
          <Route path="/admin/manage-rooms" element={<ManageRooms />} />
          <Route path="/admin/create-user" element={<AdminAddUser />} />
          <Route path="/admin/create-room" element={<AdminAddRoom />} />
          <Route path="/admin/edit-room/:roomId" element={<EditRoom />} />
        </Route>

        {/* Catch all other routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;