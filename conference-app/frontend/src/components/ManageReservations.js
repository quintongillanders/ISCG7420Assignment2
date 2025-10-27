import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ManageReservations = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);

  const fetchReservations = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/reservations/');
      setReservations(res.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3>Manage Reservations</h3>
        <Button variant="primary" onClick={() => navigate('/create-reservation')}>
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
    </div>
  );
};

export default ManageReservations;
