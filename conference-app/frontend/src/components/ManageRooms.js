import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getRooms } from '../services/api'; // your API helper
import axios from 'axios';

const ManageRooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Fetch rooms
  const fetchRooms = async () => {
    try {
      const response = await getRooms();
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setMessage('Error fetching rooms.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Navigate to edit room
  const handleEdit = (roomId) => {
    navigate(`/admin/edit-room/${roomId}`);
  };

  // Delete room
  const handleDelete = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;

    try {
      await axios.delete(`http://localhost:8000/api/rooms/${roomId}/`);
      setRooms(prev => prev.filter(room => room.id !== roomId));
      setMessage('Room deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting room:', error);
      setMessage('Error deleting room. Check your permissions.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spinner animation="border" /> Loading rooms...
      </div>
    );
  }

  return (
    <div>
      {message && (
        <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>
          {message}
        </Alert>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Manage Rooms</h3>
        <Button variant="primary" onClick={() => navigate('/admin/create-room')}>
          Add New Room
        </Button>
      </div>

      {rooms.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>No rooms found.</div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Capacity</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => (
              <tr key={room.id}>
                <td>{room.name}</td>
                <td>{room.capacity}</td>
                <td>{room.location || 'N/A'}</td>
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(room.id)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(room.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ManageRooms;
