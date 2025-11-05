import React, { useState, useEffect } from "react";
import { getRooms, createReservation } from "../api";

export default function BookRoom() {
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    room: "",
    start_time: "",
    end_time: "",
  });

  const token = localStorage.getItem("token");

  // Load all rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await getRooms(token);
        setRooms(res.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        if (error.response?.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          window.location.href = "/";
        } else {
          alert("Failed to load rooms. Please log in again.");
        }
      }
    };

    fetchRooms();
  }, [token]);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle booking
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.room || !formData.start_time || !formData.end_time) {
      alert("Please fill out all fields before booking.");
      return;
    }

    const start = new Date(formData.start_time);
    const end = new Date(formData.end_time);

    if (end <= start) {
      alert("End time must be after start time.");
      return;
    }

    try {
      const reservationData = {
        room: formData.room,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
      };

      await createReservation(reservationData, token);
      alert("✅ Room booked successfully!");
      setFormData({ room: "", start_time: "", end_time: "" });
    } catch (error) {
      console.error("Error creating reservation:", error.response?.data || error);
      alert("Failed to book room. Please try again.");
    }
  };

  return (
    <div style={{ margin: "30px" }}>
      <h2>Book a Room</h2>

      <form onSubmit={handleSubmit}>
        {/* Room selection */}
        <div style={{ marginBottom: "10px" }}>
          <label>Select Room: </label>
          <select
            name="room"
            value={formData.room}
            onChange={handleChange}
            required
          >
            <option value="">-- Choose a room --</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} ({room.location})
              </option>
            ))}
          </select>
        </div>

        {/* Start time */}
        <div style={{ marginBottom: "10px" }}>
          <label>Start Time: </label>
          <input
            type="datetime-local"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            required
          />
        </div>

        {/* End time */}
        <div style={{ marginBottom: "10px" }}>
          <label>End Time: </label>
          <input
            type="datetime-local"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" style={{ padding: "6px 12px" }}>
          Book Room
        </button>
      </form>
    </div>
  );
}
