import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Welcome to the Conference Room Reservation System</h2>
      <p>Select an option below:</p>
      <Link to="/rooms"><button>View Rooms</button></Link>
      <Link to="/book"><button>Book a Room</button></Link>
      <Link to="/my-reservations"><button>My Reservations</button></Link>
    </div>
  );
}
