import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const ManageReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    user: '',
    room: '',
    date: '',
    start_time: '',
    end_time: ''
  });

  const fetchData = async () => {
    try {
      const [reservationsRes, roomsRes, usersRes] = await Promise.all([
        axios.get('/api/reservations/'),
        axios.get('/api/rooms/'),
        axios.get('/api/users/')
      ]);
      
      setReservations(reservationsRes.data);
      setRooms(roomsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/reservations/', {
        ...formData,
        user: parseInt(formData.user),
        room: parseInt(formData.room)
      });
      setShowModal(false);
      fetchData();
      setFormData({
        user: '',
        room: '',
        date: '',
        start_time: '',
        end_time: ''
      });
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3>Manage Reservations</h3>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Create Reservation
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>User</th>
            <th>Room</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(reservation => (
            <tr key={reservation.id}>
              <td>{reservation.user_username || 'Unknown User'}</td>
              <td>{reservation.room_name || 'Unknown Room'}</td>
              <td>{new Date(reservation.date).toLocaleDateString()}</td>
              <td>{reservation.start_time}</td>
              <td>{reservation.end_time}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2">Edit</Button>
                <Button variant="danger" size="sm">Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Reservation</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>User</Form.Label>
              <Form.Select 
                name="user" 
                value={formData.user}
                onChange={handleInputChange}
                required
              >
                <option value="">Select User</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Room</Form.Label>
              <Form.Select 
                name="room" 
                value={formData.room}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Room</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>
                    {room.name} (Capacity: {room.capacity})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <div className="row">
              <Form.Group className="col-md-6 mb-3">
                <Form.Label>Start Time</Form.Label>
                <Form.Control
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="col-md-6 mb-3">
                <Form.Label>End Time</Form.Label>
                <Form.Control
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Reservation
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default ManageReservations;