import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminAddRoom.css';

const AdminAddRoom = () => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddRoom = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Get the token from localStorage
      const token = localStorage.getItem('access_token');
      if (!token) {
        setMessage('You must be logged in to add a room.');
        setLoading(false);
        return;
      }

      const response = await axios.post(
        'http://localhost:8000/api/rooms/', // note the trailing slash
        {
          name: roomName,
          capacity: Number(capacity),
          location,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // send token in header
          },
        }
      );

      const newRoom = response.data;
      setMessage(`Room added successfully! ID: ${newRoom.id}`);
      setRoomName('');
      setCapacity('');
      setLocation('');
    } catch (error) {
      console.error('Add room failed:', error.response?.data || error.message);

      if (error.response?.status === 401) {
        setMessage('Unauthorized: Please log in as an admin.');
      } else {
        setMessage('Error adding room.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin'); // Navigate back to Admin Panel
  };

  return (
    <div className="admin-create-room-container">
      <h3>Add New Room</h3>

      <div className="admin-create-room-card">
        <form onSubmit={handleAddRoom}>
          <div className="form-row">
            <label htmlFor="roomName">Room Name:</label>
            <input
              type="text"
              id="roomName"
              className="form-control"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="capacity">Capacity:</label>
            <input
              type="number"
              id="capacity"
              className="form-control"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
              min="1"
            />
          </div>

          <div className="form-row">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              className="form-control"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="button-row">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Add Room'}
            </button>
            <button type="button" className="btn-secondary" onClick={handleCancel}>
              Back to Admin Panel
            </button>
          </div>

          {message && (
            <p style={{ textAlign: 'center', marginTop: '15px', color: 'green' }}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminAddRoom;
