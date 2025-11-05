import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../api";

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    name: "",
    capacity: "",
    location: "",
    description: "",
  });
  const token = localStorage.getItem("token");

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${BASE_URL}rooms/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch rooms.");
    }
  };

  const createRoom = async () => {
    try {
      await axios.post(`${BASE_URL}rooms/`, newRoom, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Room created!");
      setNewRoom({ name: "", capacity: "", location: "", description: "" });
      fetchRooms();
    } catch (err) {
      alert("Failed to create room.");
    }
  };

  const deleteRoom = async (id) => {
    if (!window.confirm("Delete this room?")) return;
    try {
      await axios.delete(`${BASE_URL}rooms/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Room deleted.");
      fetchRooms();
    } catch {
      alert("Error deleting room.");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🏢 Manage Rooms</h2>

      <h3>Add New Room</h3>
      <input
        placeholder="Name"
        value={newRoom.name}
        onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
      />
      <input
        placeholder="Capacity"
        value={newRoom.capacity}
        onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
      />
      <input
        placeholder="Location"
        value={newRoom.location}
        onChange={(e) => setNewRoom({ ...newRoom, location: e.target.value })}
      />
      <input
        placeholder="Description"
        value={newRoom.description}
        onChange={(e) =>
          setNewRoom({ ...newRoom, description: e.target.value })
        }
      />
      <button onClick={createRoom}>Add Room</button>

      <hr />
      <h3>Existing Rooms</h3>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            <strong>{room.name}</strong> ({room.capacity} people) —{" "}
            {room.location}
            <br />
            <em>{room.description}</em>
            <br />
            <button onClick={() => deleteRoom(room.id)}>Delete</button>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}
