import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  // Get token and admin status
  const token = localStorage.getItem("token") || localStorage.getItem("access");
  const isAdmin =
    localStorage.getItem("is_admin") === "true" ||
    localStorage.getItem("is_staff") === "true";

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access");
    localStorage.removeItem("is_admin");
    localStorage.removeItem("is_staff");
    alert("You’ve been logged out.");
    navigate("/");
  };

  return (
    <nav
      style={{
        backgroundColor: "#1e1e1e",
        color: "white",
        padding: "10px",
        display: "flex",
        alignItems: "center",
        gap: "15px",
      }}
    >
      {token ? (
        <>
          {/* ---- Regular User Links ---- */}
          <Link to="/rooms" style={{ color: "white", textDecoration: "none" }}>
            All Rooms
          </Link>

          <Link to="/book" style={{ color: "white", textDecoration: "none" }}>
            Book Room
          </Link>

          <Link
            to="/my-reservations"
            style={{ color: "white", textDecoration: "none" }}
          >
            My Reservations
          </Link>

          {/* ---- Admin Link ---- */}
          {isAdmin && (
            <Link
              to="/admin-dashboard"
              style={{
                color: "#ffd700",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Admin Dashboard
            </Link>
          )}

          {/* ---- Logout Button ---- */}
          <button
            onClick={handleLogout}
            style={{
              marginLeft: "auto",
              backgroundColor: "#f04e30",
              color: "white",
              border: "none",
              padding: "6px 10px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            Login
          </Link>
          <Link
            to="/register"
            style={{
              color: "white",
              marginLeft: "10px",
              textDecoration: "none",
            }}
          >
            Register
          </Link>
        </>
      )}
    </nav>
  );
}
