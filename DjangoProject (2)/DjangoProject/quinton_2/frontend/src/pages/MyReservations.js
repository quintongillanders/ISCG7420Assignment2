import React, { useEffect, useState } from "react";
import {
  getReservations,
  deleteReservation,
  updateReservation,
} from "../api";

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({
    start_time: "",
    end_time: "",
  });

  const token = localStorage.getItem("token"); // ✅ unified key name

  // Fetch reservations
  const fetchReservations = async () => {
    try {
      const res = await getReservations(token);
      setReservations(res.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Convert ISO to local datetime for input fields
  const formatForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };

  // Start editing a reservation
  const startEditing = (reservation) => {
    setEditingId(reservation.id);
    setEditedData({
      start_time: formatForInput(reservation.start_time),
      end_time: formatForInput(reservation.end_time),
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditedData({ start_time: "", end_time: "" });
  };

  // Save updated reservation
  const saveEdit = async (id) => {
    if (!editedData.start_time || !editedData.end_time) {
      alert("Please select both start and end times.");
      return;
    }

    const start = new Date(editedData.start_time);
    const end = new Date(editedData.end_time);

    if (end <= start) {
      alert("End time must be after start time!");
      return;
    }

    try {
      const formattedData = {
        start_time: start.toISOString(),
        end_time: end.toISOString(),
      };

      await updateReservation(id, formattedData, token);
      alert("✅ Reservation updated successfully!");
      setEditingId(null);
      fetchReservations();
    } catch (error) {
      console.error("Error updating reservation:", error.response?.data || error);
      alert("Failed to update reservation.");
    }
  };

  // Delete a reservation
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reservation?")) return;
    try {
      await deleteReservation(id, token);
      alert("🗑️ Reservation deleted successfully!");
      fetchReservations();
    } catch (error) {
      console.error("Error deleting reservation:", error.response?.data || error);
      alert("Failed to delete reservation.");
    }
  };

  return (
    <div className="container" style={{ margin: "30px" }}>
      <h2>My Reservations</h2>

      {reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Room</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id}>
                <td>{res.room_name || res.room}</td>

                {editingId === res.id ? (
                  <>
                    <td>
                      <input
                        type="datetime-local"
                        value={editedData.start_time}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            start_time: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="datetime-local"
                        value={editedData.end_time}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            end_time: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td>
                      <button onClick={() => saveEdit(res.id)}>Save</button>
                      <button onClick={cancelEdit}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>
                      {new Date(res.start_time).toLocaleString([], {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td>
                      {new Date(res.end_time).toLocaleString([], {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td>
                      <button onClick={() => startEditing(res)}>Edit</button>
                      <button onClick={() => handleDelete(res.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyReservations;
