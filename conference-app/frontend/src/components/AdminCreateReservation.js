import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminCreateReservation.css';

const AdminCreateReservation = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    user: '',
    room: '',
    date: '',
    start_time: '',
    end_time: ''
  });

  // Fetch users and rooms
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, usersRes] = await Promise.all([
          axios.get('http://localhost:8000/api/rooms/'),
          axios.get('http://localhost:8000/api/users/')
        ]);
        setRooms(roomsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/reservations/', {
        ...formData,
        user: parseInt(formData.user),
        room: parseInt(formData.room),
      });
      navigate('/admin/manage-reservations');
    } catch (error) {
      console.error('Error creating reservation:', error.response?.data || error.message);
    }
  };

  return (
    <div className="admin-create-reservation-container">
        <h3>Make a Reservation for a User</h3>

        <div className="admin-create-reservation-card">
          <Form onSubmit={handleSubmit}>
            <div className="form-row">
              <label>User:</label>
              <Form.Select
                name="user"
                value={formData.user}
                onChange={handleInputChange}
                required
              >
                <option value="">----------</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </Form.Select>
            </div>

            <div className="form-row">
              <label>Room:</label>
              <Form.Select
                name="room"
                value={formData.room}
                onChange={handleInputChange}
                required
              >
                <option value="">----------</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </Form.Select>
            </div>

            <div className="form-row">
              <label>Date:</label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <label>Start Time:</label>
              <Form.Control
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <label>End Time:</label>
              <Form.Control
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="button-row">
              <Button type="submit" className="btn-primary">
                Make Reservation
              </Button>
              <Button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/admin')}
              >
                Back to Admin Panel
              </Button>
            </div>
          </Form>
        </div>
      </div>
  );
};

export default AdminCreateReservation;
