import React, { useEffect, useState } from "react";
import { getRooms } from "../api";

export default function AllRooms() {
  const [rooms, setRooms] = useState([]);
  const token = localStorage.getItem("token"); // ✅ unified token key

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // ✅ Allow both logged-in and guest users to fetch rooms
        const res = await getRooms(token);
        setRooms(res.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        if (error.response?.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          window.location.href = "/";
        } else {
          alert("Failed to load rooms.");
        }
      }
    };

    fetchRooms();
  }, [token]);

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>All Conference Rooms</h2>

      {rooms.length === 0 ? (
        <p>No rooms available.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "15px",
            padding: "20px",
          }}
        >
          {rooms.map((room) => (
            <div
              key={room.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "15px",
                textAlign: "left",
              }}
            >
              <h3>{room.name}</h3>
              <p>
                <strong>Location:</strong> {room.location || "N/A"}
              </p>
              <p>
                <strong>Capacity:</strong> {room.capacity || "Unknown"}
              </p>
              {room.description && (
                <p>
                  <em>{room.description}</em>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
