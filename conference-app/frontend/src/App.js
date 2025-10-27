import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
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
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/create-reservation" element={<AdminCreateReservation />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />
          <Route path="/admin/manage-reservations" element={<ManageReservations />} />
          <Route path="/admin/manage-rooms" element={<ManageRooms />} />
          <Route path="/admin/create-user" element={<AdminAddUser />} />
          <Route path="/admin/create-room" element={<AdminAddRoom />} />

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
