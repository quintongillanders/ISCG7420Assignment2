import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { getRooms } from '../services/api';
import './MakeReservation.css';

const MakeReservation = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    room: roomId || '',
    date: '',
    startTime: '',
    endTime: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getRooms().then(res => setRooms(res.data));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  if (!formData.room || !formData.date || !formData.startTime || !formData.endTime) {
    setError('Please fill in all fields');
    return;
  }

  try {
    const token = localStorage.getItem('access_token');
    const userId = localStorage.getItem('user_id');

    const payload = {
      room: formData.room,
      user: userId,
      date: formData.date,
      start_time: formData.startTime,
      end_time: formData.endTime
    };

    await axios.post('http://localhost:8000/api/reservations/', payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setSuccess('✅ Reservation created successfully!');
    setTimeout(() => navigate('/'), 1500);
  } catch (err) {
    console.error('Reservation error:', err.response ? err.response.data : err);
    setError('Failed to make reservation');
  }
};
  return (
    <div style={{ maxWidth: '500px', margin: '50px auto' }}>
      <h2>Make Reservation</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label>Room:</label>
        <select name="room" value={formData.room} onChange={handleChange} required>
          <option value="">Select a room</option>
          {rooms.map(room => (
            <option key={room._id} value={room._id}>{room.name} (Capacity: {room.capacity})</option>
          ))}
        </select>

        <label>Date:</label>
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />

        <label>Start Time:</label>
        <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />

        <label>End Time:</label>
        <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />

        <button
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#f60505',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reserve
        </button>
      </form>
    </div>
  );
};

export default MakeReservation;
