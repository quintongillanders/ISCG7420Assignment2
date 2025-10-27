import React, { useEffect, useState } from 'react';
import { getRooms } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './RoomList.css';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getRooms().then(res => setRooms(res.data));
  }, []);

  const handleMakeReservation = (roomId) => {
    navigate(`/make-reservation/${roomId}`);
  };

  const editReservation = (roomId) => {
    navigate(`/edit-reservation/${roomId}`);
  };

  return (
    <div className="room-list">
      <h2>Available Rooms</h2>
      <div className="rooms">
        {rooms.map(room => (
          <div key={room._id} className="room-card">
            <h3>{room.name}</h3>
            <p>Capacity: {room.capacity}</p>
            <p>Location: {room.location}</p>
            <button
              onClick={() => handleMakeReservation(room._id)}
              style={{
                marginTop: '12px',
                padding: '8px 12px',
                backgroundColor: '#f60505',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Book Room
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;
