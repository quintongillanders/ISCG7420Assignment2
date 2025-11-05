import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../api";
import "./AdminRooms.css";

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    name: "",
    capacity: "",
    location: "",
    description: "",
  });
  const [editRoom, setEditRoom] = useState(null);
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

  const updateRoom = async () => {
    try {
      await axios.put(`${BASE_URL}rooms/${editRoom.id}/`, editRoom, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Room updated!");
      setEditRoom(null);
      fetchRooms();
    } catch (err) {
      alert("Failed to update room.");
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
    <div className="admin-rooms-container">
      <h2>Manage Rooms</h2>

      <div className="room-form">
        <h3>Add New Room</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Room Name</label>
            <input
              type="text"
              placeholder="Enter room name"
              value={newRoom.name}
              onChange={(e) =>
                setNewRoom({ ...newRoom, name: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Capacity</label>
            <input
              type="number"
              placeholder="Enter capacity"
              value={newRoom.capacity}
              onChange={(e) =>
                setNewRoom({ ...newRoom, capacity: e.target.value })
              }
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              placeholder="Enter location"
              value={newRoom.location}
              onChange={(e) =>
                setNewRoom({ ...newRoom, location: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              placeholder="Enter description"
              value={newRoom.description}
              onChange={(e) =>
                setNewRoom({ ...newRoom, description: e.target.value })
              }
            />
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-add" onClick={createRoom}>
            Add Room
          </button>
        </div>
      </div>

      <div className="rooms-table">
        <div className="table-header">
          <h3>Existing Rooms</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Capacity</th>
              <th>Location</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.name}</td>
                  <td>{room.capacity}</td>
                  <td>{room.location}</td>
                  <td>{room.description}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn btn-edit"
                        onClick={() => setEditRoom(room)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => deleteRoom(room.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", color: "#777" }}>
                  No rooms found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom popup for editing */}
      {editRoom && (
        <div className="edit-popup">
          <div className="edit-popup-inner">
            <h3>Edit Room</h3>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={editRoom.name}
                onChange={(e) =>
                  setEditRoom({ ...editRoom, name: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Capacity</label>
              <input
                type="number"
                value={editRoom.capacity}
                onChange={(e) =>
                  setEditRoom({ ...editRoom, capacity: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={editRoom.location}
                onChange={(e) =>
                  setEditRoom({ ...editRoom, location: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                value={editRoom.description}
                onChange={(e) =>
                  setEditRoom({ ...editRoom, description: e.target.value })
                }
              />
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" onClick={updateRoom}>
                Save Changes
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setEditRoom(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
