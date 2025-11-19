import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../api";
import Banner from "../../components/Banner";
import "./AdminRooms.css";

export default function AdminRooms() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [newRoom, setNewRoom] = useState({
    name: "",
    capacity: "",
    description: "",
    location: ""
  });

  const token = localStorage.getItem("token");

  // ⭐ FIX: wrap fetchRooms in useCallback
  const fetchRooms = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}rooms/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setErrorMessage("Failed to load rooms. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // ⭐ FIX: add fetchRooms, navigate, token to dependency list
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchRooms();
  }, [fetchRooms, navigate, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(
          `${BASE_URL}rooms/${editingId}/`,
          newRoom,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccessMessage("Room updated successfully.");
      } else {
        await axios.post(
          `${BASE_URL}rooms/`,
          newRoom,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccessMessage("Room added successfully.");
      }

      setShowForm(false);
      setEditingId(null);
      setNewRoom({
        name: "",
        capacity: "",
        description: "",
        location: ""
      });

      setTimeout(() => setSuccessMessage(""), 3000);
      fetchRooms();

    } catch (error) {
      console.error("Error saving room:", error);
      setErrorMessage("Failed to save room. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleEdit = (room) => {
    setEditingId(room.id);
    setNewRoom({
      name: room.name,
      capacity: room.capacity,
      description: room.description,
      location: room.location || ""
    });

    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      await axios.delete(`${BASE_URL}rooms/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccessMessage("Room deleted successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);

      fetchRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
      setErrorMessage("Failed to delete room. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setNewRoom({
      name: "",
      capacity: "",
      description: "",
      location: ""
    });
  };

  if (isLoading) {
    return <div className="loading">Loading rooms...</div>;
  }

  return (
    <div className="admin-rooms">
      <div className="page-header">
        <button
          className="btn btn-back"
          onClick={() => navigate("/admin-dashboard")}
        >
          ← Back to Dashboard
        </button>
        <h2>Manage Conference Rooms</h2>
      </div>

      <Banner type="success" message={successMessage} onClose={() => setSuccessMessage("")} autoHideMs={3000} />
      <Banner type="error" message={errorMessage} onClose={() => setErrorMessage("")} autoHideMs={3000} />

      <div className="rooms-controls">
        <button
          className={`btn ${showForm ? "btn-secondary" : "btn-add"}`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Add New Room"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="room-form">
          <h3>{editingId ? "Edit Room" : "Add New Room"}</h3>

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
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={newRoom.location}
              onChange={handleInputChange}
              required
            />
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

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingId ? "Update Room" : "Add Room"}
            </button>
          </div>
        </form>
      )}

      <div className="rooms-list">
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
                  <td>{room.location || "-"}</td>
                  <td>{room.description || "-"}</td>
                  <td className="actions">
                    <button className="btn btn-edit" onClick={() => handleEdit(room)}>
                      Edit
                    </button>
                    <button className="btn btn-delete" onClick={() => handleDelete(room.id)}>
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
