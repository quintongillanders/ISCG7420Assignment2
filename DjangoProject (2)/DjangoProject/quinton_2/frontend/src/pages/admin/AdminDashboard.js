import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin! Manage all resources below.</p>

      <div style={{ marginTop: "30px" }}>
        <Link
          to="/admin/users"
          style={{
            display: "block",
            margin: "10px auto",
            width: "250px",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
          }}
        >
          Manage Users
        </Link>

        <Link
          to="/admin/rooms"
          style={{
            display: "block",
            margin: "10px auto",
            width: "250px",
            padding: "10px",
            backgroundColor: "#28a745",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
          }}
        >
          Manage Rooms
        </Link>

        <Link
          to="/admin/reservations"
          style={{
            display: "block",
            margin: "10px auto",
            width: "250px",
            padding: "10px",
            backgroundColor: "#ffc107",
            color: "black",
            textDecoration: "none",
            borderRadius: "8px",
          }}
        >
          Manage Reservations
        </Link>
      </div>
    </div>
  );
}
