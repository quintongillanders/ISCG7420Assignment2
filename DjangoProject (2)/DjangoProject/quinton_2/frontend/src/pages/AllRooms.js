import React, { useEffect, useState } from "react";
import { getRooms } from "../api";
import { useNavigate } from "react-router-dom";
import "./AllRooms.css";

export default function AllRooms() {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [token]);

  if (isLoading) {
    return (
      <div className="rooms-container">
        <div className="rooms-header">
          <h2>Our Conference Rooms</h2>
          <p>Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rooms-container">
      <div className="rooms-header">
        <h2>Our Conference Rooms</h2>
        <p>Find the perfect space for your next meeting or event</p>
      </div>

      {rooms.length === 0 ? (
        <div className="no-rooms">
          <p>No rooms available at the moment. Please check back later.</p>
        </div>
      ) : (
        <div className="rooms-grid">
          {rooms.map((room) => (
            <div key={room.id} className="room-card">
              <div className="room-details">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className="room-title">{room.name}</h3>
                  <span className="room-type">{room.room_type || 'Standard'}</span>
                </div>

                <div className="room-meta">
                  <div className="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    {room.capacity || 'N/A'} people
                  </div>
                  {room.location && (
                    <div className="meta-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {room.location}
                    </div>
                  )}
                </div>

                {room.description && (
                  <p className="room-description">
                    {room.description}
                  </p>
                )}

                <div className="room-actions">
                  <button
                    onClick={() => navigate(`/book?room=${room.id}`)}
                    className="btn-book"
                  >
                    Book Now
                  </button>
                  <span style={{ fontSize: '0.9em', color: '#7f8c8d' }}>
                    Available
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}