import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Te Whare Ruanga Booking System</h1>
        <p>Welcome! Please choose an option below.</p>
      </div>

      <div className="dashboard-actions">
        <Link to="/rooms" className="dashboard-button view-rooms">
          View Rooms
        </Link>
        <Link to="/book" className="dashboard-button book-room">
          Book a Room
        </Link>
        <Link to="/my-reservations" className="dashboard-button my-reservations">
          My Reservations
        </Link>
      </div>
    </div>
  );
}
