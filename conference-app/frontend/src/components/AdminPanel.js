import React, { useState, useEffect } from "react";
import ManageRooms from "./ManageRooms";
import ManageReservations from "./ManageReservations";
import ManageUsers from "./ManageUsers";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("rooms");

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Panel</h1>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setActiveTab("rooms")}>Manage Rooms</button>
        <button onClick={() => setActiveTab("reservations")}>Reservations</button>
        <button onClick={() => setActiveTab("users")}>Manage Users</button>
      </div>

      <div>
        {activeTab === "rooms" && <ManageRooms />}
        {activeTab === "reservations" && <ManageReservations />}
        {activeTab === "users" && <ManageUsers />}
      </div>
    </div>
  );
};

export default AdminPanel;
