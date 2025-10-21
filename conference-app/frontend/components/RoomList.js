import React, { useEffect, useState } from 'react';
import { getRooms } from '../services/api';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    getRooms().then(res => setRooms(res.data));
  }, []);

  return (
    <div>
      <h1>Rooms</h1>
      <ul>
        {rooms.map(room => (
          <li key={room.id}>{room.name} - Capacity: {room.capacity}</li>
        ))}
      </ul>
    </div>
  );
}

export default RoomList;
