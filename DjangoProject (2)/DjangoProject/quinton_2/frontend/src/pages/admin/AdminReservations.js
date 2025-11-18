import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../api";
import "./AdminReservations.css";

export default function AdminReservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [newReservation, setNewReservation] = useState({
    user: "",
    room: "",
    start_time: "",
    end_time: "",
    special_requests: ""
  });

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [resReservations, resRooms, resUsers] = await Promise.all([
        axios.get(`${BASE_URL}reservations/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}rooms/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}users/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setReservations(resReservations.data);
      setRooms(resRooms.data);
      setUsers(resUsers.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("Failed to load data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReservation(prev => ({ ...prev, [name]: value }));
  };
  const createReservation = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${BASE_URL}reservations/`,
        {
          user_id: newReservation.user,
          room: newReservation.room,
          start_time: newReservation.start_time,
          end_time: newReservation.end_time,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowAddForm(false);
      setNewReservation({
        user: "",
        room: "",
        start_time: "",
        end_time: "",
        special_requests: "",
      });
      setSuccessMessage("Reservation created successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchData();
    } catch (err) {
      console.error("Error creating reservation:", err);
      alert("Failed to create reservation. Please try again.");
    }
  };

  const deleteReservation = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
    try {
      await axios.delete(`${BASE_URL}reservations/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage("Reservation cancelled successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchData();
    } catch (err) {
      console.error("Error deleting reservation:", err);
      alert("Failed to cancel reservation. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-reservations">
      <div className="admin-header">
        <button
          className="btn btn-back"
          onClick={() => navigate('/admin-dashboard')}
        >
          &larr; Back to Dashboard
        </button>

        <h2>Manage Reservations</h2>
      </div>

      {successMessage && (
        <div className="success-message" style={{
          margin: '12px 0',
          padding: '10px 12px',
          background: '#e6ffed',
          color: '#046c4e',
          border: '1px solid #b7f5c8',
          borderRadius: '6px'
        }}>
          {successMessage}
        </div>
      )}

      <div className="reservations-controls">
        <button
          className={`btn ${showAddForm ? 'btn-secondary' : 'btn-add'}`}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add New Reservation'}
        </button>
      </div>

      <div className="reservations-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Room</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length > 0 ? (
              reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{reservation.id}</td>
                  <td>{reservation.user_name || 'N/A'}</td>
                  <td>{reservation.room_name || 'N/A'}</td>
                  <td>{new Date(reservation.start_time).toLocaleString()}</td>
                  <td>{new Date(reservation.end_time).toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${
                      new Date(reservation.end_time) < new Date() 
                        ? 'status-completed' 
                        : 'status-active'
                    }`}>
                      {new Date(reservation.end_time) < new Date()
                        ? 'Completed'
                        : 'Active'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-delete"
                      onClick={() => deleteReservation(reservation.id)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-reservations">No reservations found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddForm && (
        <div className="add-reservation-form">
          <h3>Create New Reservation</h3>
          <form onSubmit={createReservation}>
            <div className="form-row">
              <div className="form-group">
                <label>User</label>
                <select
                  name="user"
                  value={newReservation.user}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Room</label>
                <select
                  name="room"
                  value={newReservation.room}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Room</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} (Capacity: {room.capacity})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Time</label>
                <input
                  type="datetime-local"
                  name="start_time"
                  value={newReservation.start_time}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input
                  type="datetime-local"
                  name="end_time"
                  value={newReservation.end_time}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Special Requests</label>
              <textarea
                name="special_requests"
                value={newReservation.special_requests}
                onChange={handleInputChange}
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Reservation
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}