import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getRooms, createReservation } from "../api";
import Banner from "../components/Banner";
import "./BookRoom.css"; // You might need to create this file

export default function BookRoom() {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('room');
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    room: roomId || "",
    start_time: "",
    end_time: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch available rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await getRooms(token);
        setRooms(response.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setError("Failed to load rooms. Please try again later.");
      }
    };

    fetchRooms();
  }, [token]);

  // Update form data when roomId changes
  useEffect(() => {
    if (roomId) {
      setFormData(prev => ({
        ...prev,
        room: roomId
      }));
    }
  }, [roomId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setErrorMessage("");

    if (!formData.room) {
      setError("Please select a room");
      return;
    }

    if (!formData.start_time || !formData.end_time) {
      setError("Please select both start and end times");
      return;
    }

    const start = new Date(formData.start_time);
    const end = new Date(formData.end_time);
    const now = new Date();

    if (start < now) {
      setError("Start time cannot be in the past");
      return;
    }

    if (end <= start) {
      setError("End time must be after start time");
      return;
    }

    try {
      setIsSubmitting(true);
      const reservationData = {
        room: formData.room,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
      };

      await createReservation(reservationData, token);
      setSuccessMessage("Room booked successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
      navigate("/my-reservations");
    } catch (error) {
      console.error("Booking error:", error);
      const msg = error.response?.data?.message || "Failed to book room. Please try again.";
      setError(msg);
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="book-room-container">
      <h2>Book a Conference Room</h2>

      <Banner type="success" message={successMessage} onClose={() => setSuccessMessage("")} autoHideMs={3000} />
      <Banner type="error" message={errorMessage || error} onClose={() => { setErrorMessage(""); setError(""); }} autoHideMs={3000} />

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label>Select Room</label>
          <select
            name="room"
            value={formData.room}
            onChange={handleInputChange}
            required
            disabled={!!roomId}
          >
            <option value="">{roomId ? "Loading..." : "Select a room"}</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} ({room.room_type})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Start Time</label>
          <input
            type="datetime-local"
            name="start_time"
            value={formData.start_time}
            onChange={handleInputChange}
            min={new Date().toISOString().slice(0, 16)}
            required
          />
        </div>

        <div className="form-group">
          <label>End Time</label>
          <input
            type="datetime-local"
            name="end_time"
            value={formData.end_time}
            onChange={handleInputChange}
            min={formData.start_time || new Date().toISOString().slice(0, 16)}
            required
          />
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Booking..." : "Book Room"}
        </button>
      </form>
    </div>
  );
}