import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../api";

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const token = localStorage.getItem("token");

  const fetchReservations = async () => {
    try {
      const res = await axios.get(`${BASE_URL}reservations/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch reservations.");
    }
  };

  const deleteReservation = async (id) => {
    if (!window.confirm("Delete this reservation?")) return;
    try {
      await axios.delete(`${BASE_URL}reservations/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Reservation deleted.");
      fetchReservations();
    } catch (err) {
      alert("Error deleting reservation.");
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📅 Manage Reservations</h2>
      {reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Room</th>
              <th>Start</th>
              <th>End</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.user_name}</td>
                <td>{r.room_name}</td>
                <td>{new Date(r.start_time).toLocaleString()}</td>
                <td>{new Date(r.end_time).toLocaleString()}</td>
                <td>
                  <button onClick={() => deleteReservation(r.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
