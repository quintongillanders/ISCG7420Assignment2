import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';

const ManageReservations = ({ navigate }) => { // <-- receive navigate from parent
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    try {
      const [reservationsRes, roomsRes, usersRes] = await Promise.all([
        axios.get('http://localhost:8000/api/reservations/'),
        axios.get('http://localhost:8000/api/rooms/'),
        axios.get('http://localhost:8000/api/users/')
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3>Manage Reservations</h3>
        <Button
          variant="primary"
          onClick={() => navigate('/admin/create-reservation')}
        >
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
