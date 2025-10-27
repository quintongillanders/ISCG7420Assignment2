import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './EditRoom.css';

const EditRoom = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    location: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/rooms/${roomId}/`);
        setFormData({
          name: response.data.name,
          capacity: response.data.capacity,
          location: response.data.location || ''
        });
      } catch (error) {
        console.error('Error fetching room:', error);
        setMessage('Failed to fetch room data.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/rooms/${roomId}/`, formData);
      setMessage('Room updated successfully!');
      setTimeout(() => navigate('/admin/manage-rooms'), 1500);
    } catch (error) {
      console.error('Error updating room:', error.response?.data || error.message);
      setMessage('Failed to update room.');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spinner animation="border" /> Loading room...
      </div>
    );
  }

  return (
    <div className="admin-create-reservation-container">
      <h3>Edit Room</h3>

      {message && (
        <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>
          {message}
        </Alert>
      )}

      <div className="admin-create-reservation-card">
        <Form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Name:</label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Room name"
              required
            />
          </div>

          <div className="form-row">
            <label>Capacity:</label>
            <Form.Control
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Capacity"
              required
            />
          </div>

          <div className="form-row">
            <label>Location:</label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location (optional)"
            />
          </div>

          <div className="button-row">
            <Button type="submit" className="btn-primary">
              Update Room
            </Button>
            <Button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/admin')}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </div>

  );
};

export default EditRoom;
