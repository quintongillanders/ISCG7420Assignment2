import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ManageRooms from "./ManageRooms";
import ManageReservations from "./ManageReservations";
import ManageUsers from "./ManageUsers";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("rooms");
  const navigate = useNavigate();

  const tabs = [
    { id: "rooms", label: "Manage Rooms" },
    { id: "reservations", label: "Reservations" },
    { id: "users", label: "Manage Users" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "rooms":
        return <ManageRooms />;
      case "reservations":
        // Pass navigate to ManageReservations so the button works
        return <ManageReservations navigate={navigate} />;
      case "users":
        return <ManageUsers />;
      default:
        return <ManageRooms />;
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Te Whare Runanga Admin Panel</h1>
        <div className="tab-buttons">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="content-card">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminPanel;
