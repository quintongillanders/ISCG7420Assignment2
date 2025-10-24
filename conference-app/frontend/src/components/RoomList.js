import React, { useEffect, useState } from 'react';
import { getRooms } from '../services/api';
import './RoomList.css';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    getRooms().then(res => setRooms(res.data));
  }, []);

  return (
    <div className="room-list">
      <h2>Available Rooms</h2>
      <div className="rooms">
        {rooms.map(room => (
          <div key={room._id} className="room-card">
            <h3>{room.name}</h3>
            <p>Capacity: {room.capacity}</p>
            <p>Location: {room.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;