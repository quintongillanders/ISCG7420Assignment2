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
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/create-reservation" element={<AdminCreateReservation />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
