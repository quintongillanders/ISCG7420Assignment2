import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../api";
import "./AdminRooms.css";

export default function AdminRooms() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: "",
    capacity: "",
    description: "",
    image: null,
    room_type: "standard"
  });

  const token = localStorage.getItem("token");

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${BASE_URL}rooms/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      alert("Failed to load rooms. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setNewRoom({ ...newRoom, [name]: files[0] });
    } else {
      setNewRoom({ ...newRoom, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newRoom).forEach(key => {
      if (newRoom[key] !== null) {
        formData.append(key, newRoom[key]);
      }
    });

    try {
      if (editingId) {
        await axios.put(`${BASE_URL}rooms/${editingId}/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Room updated successfully!");
      } else {
        await axios.post(`${BASE_URL}rooms/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Room added successfully!");
      }
      setShowForm(false);
      setEditingId(null);
      setNewRoom({
        name: "",
        capacity: "",
        description: "",
        image: null,
        room_type: "standard"
      });
      fetchRooms();
    } catch (error) {
      console.error("Error saving room:", error);
      alert("Failed to save room. Please try again.");
    }
  };

  const handleEdit = (room) => {
    setEditingId(room.id);
    setNewRoom({
      name: room.name,
      capacity: room.capacity,
      description: room.description,
      image: room.image,
      room_type: room.room_type
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await axios.delete(`${BASE_URL}rooms/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Room deleted successfully!");
        fetchRooms();
      } catch (error) {
        console.error("Error deleting room:", error);
        alert("Failed to delete room. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setNewRoom({
      name: "",
      capacity: "",
      description: "",
      image: null,
      room_type: "standard"
    });
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-rooms">
      <div className="admin-header">
        <button
          className="btn btn-back"
          onClick={() => navigate('/admin-dashboard')}
        >
          &larr; Back to Dashboard
        </button>
        <h2>Manage Rooms</h2>
      </div>

      <div className="rooms-controls">
        <button
          className={`btn ${showForm ? 'btn-secondary' : 'btn-add'}`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add New Room'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="room-form" encType="multipart/form-data">
          <h3>{editingId ? 'Edit Room' : 'Add New Room'}</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Room Name</label>
              <input
                type="text"
                name="name"
                value={newRoom.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Capacity</label>
              <input
                type="number"
                name="capacity"
                min="1"
                value={newRoom.capacity}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={newRoom.description}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Room Type</label>
            <select
              name="room_type"
              value={newRoom.room_type}
              onChange={handleInputChange}
              required
            >
              <option value="standard">Standard</option>
              <option value="deluxe">Deluxe</option>
              <option value="suite">Suite</option>
            </select>
          </div>

          <div className="form-group">
            <label>Room Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleInputChange}
              required={!editingId}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update Room' : 'Add Room'}
            </button>
          </div>
        </form>
      )}

      <div className="rooms-list">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.id}</td>
                  <td>{room.name}</td>
                  <td>{room.room_type}</td>
                  <td>{room.capacity}</td>
                  <td className="actions">
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEdit(room)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(room.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-rooms">No rooms found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}