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

    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('No authentication token found. Please log in.');
      return;
    }

    if (!formData.room || !formData.date || !formData.startTime || !formData.endTime) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await axios.post(
        'http://localhost:8000/api/reservations/',
        {
          room: formData.room,
          date: formData.date,
          start_time: formData.startTime,
          end_time: formData.endTime
        },
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess('Reservation created successfully!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error('Reservation error:', err.response?.data || err.message);
      setError(err.response?.data?.detail || 'Failed to create reservation');
    }
  };

  return (
    <div className="make-reservation-container">
      <h2>Make Reservation</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <div className="make-reservation-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Room:</label>
            <select name="room" value={formData.room} onChange={handleChange} required>
              <option value="">Select a room</option>
              {rooms.map(room => (
                <option key={room._id} value={room._id}>
                  {room.name} (Capacity: {room.capacity})
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label>Date:</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <label>Start Time:</label>
            <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <label>End Time:</label>
            <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />
          </div>

          <div className="button-row">
            <button type="submit" className="btn-primary">Reserve</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MakeReservation;
