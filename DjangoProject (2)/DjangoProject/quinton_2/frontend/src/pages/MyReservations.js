import React, { useEffect, useState } from "react";
import {
  getReservations,
  deleteReservation,
  updateReservation,
} from "../api";
import Banner from "../components/Banner";
import "./MyReservations.css";

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({
    start_time: "",
    end_time: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchReservations = async () => {
    try {
      const res = await getReservations(token);
      setReservations(res.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      if (error.response?.status === 401) {
        setErrorMessage("Session expired. Please log in again.");
        setTimeout(() => setErrorMessage(""), 3000);
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const cancelEdit = () => {
    setEditingId(null);
    setEditedData({ start_time: "", end_time: "" });
  };

  const saveEdit = async (id) => {
    if (!editedData.start_time || !editedData.end_time) {
      setErrorMessage("Please select both start and end times.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const start = new Date(editedData.start_time);
    const end = new Date(editedData.end_time);

    if (end <= start) {
      setErrorMessage("End time must be after start time!");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    try {
      const formattedData = {
        start_time: start.toISOString(),
        end_time: end.toISOString(),
      };

      await updateReservation(id, formattedData, token);
      setSuccessMessage("Reservation updated successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
      setEditingId(null);
      fetchReservations();
    } catch (error) {
      console.error("Error updating reservation:", error.response?.data || error);
      setErrorMessage("Failed to update reservation.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reservation?")) return;
    try {
      await deleteReservation(id, token);
      setSuccessMessage("Reservation deleted successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchReservations();
    } catch (error) {
      console.error("Error deleting reservation:", error.response?.data || error);
      setErrorMessage("Failed to delete reservation.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <div className="reservations-container">
      <h2 className="reservations-header">My Reservations</h2>

      <Banner type="success" message={successMessage} onClose={() => setSuccessMessage("")} autoHideMs={3000} />
      <Banner type="error" message={errorMessage} onClose={() => setErrorMessage("")} autoHideMs={3000} />

      {reservations.length === 0 ? (
        <div className="no-reservations">No reservations found.</div>
      ) : (
        <table className="reservations-table">
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
                        className="datetime-input"
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
                        className="datetime-input"
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
                      <div className="action-buttons">
                        <button
                          className="btn btn-save"
                          onClick={() => saveEdit(res.id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-cancel"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
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
                      <div className="action-buttons">
                        <button
                          className="btn btn-edit"
                          onClick={() => startEditing(res)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-delete"
                          onClick={() => handleDelete(res.id)}
                        >
                          Delete
                        </button>
                      </div>
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