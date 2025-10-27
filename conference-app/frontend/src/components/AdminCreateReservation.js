import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/reservations/', {
        ...formData,
        user: parseInt(formData.user),
        room: parseInt(formData.room)
      });
      navigate('/manage-reservations'); // go back to reservations list
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Create New Reservation</h3>
      <form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>User</Form.Label>
          <Form.Select name="user" value={formData.user} onChange={handleInputChange} required>
            <option value="">Select User</option>
            {users.map(user => <option key={user.id} value={user.id}>{user.username}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Room</Form.Label>
          <Form.Select name="room" value={formData.room} onChange={handleInputChange} required>
            <option value="">Select Room</option>
            {rooms.map(room => <option key={room.id} value={room.id}>{room.name}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control type="date" name="date" value={formData.date} onChange={handleInputChange} required />
        </Form.Group>

        <div className="row">
          <Form.Group className="col-md-6 mb-3">
            <Form.Label>Start Time</Form.Label>
            <Form.Control type="time" name="start_time" value={formData.start_time} onChange={handleInputChange} required />
          </Form.Group>
          <Form.Group className="col-md-6 mb-3">
            <Form.Label>End Time</Form.Label>
            <Form.Control type="time" name="end_time" value={formData.end_time} onChange={handleInputChange} required />
          </Form.Group>
        </div>

        <Button variant="primary" type="submit">Save Reservation</Button>
        <Button variant="secondary" className="ms-2" onClick={() => navigate('/manage-reservations')}>Cancel</Button>
      </form>
    </div>
  );
};

export default AdminCreateReservation;
