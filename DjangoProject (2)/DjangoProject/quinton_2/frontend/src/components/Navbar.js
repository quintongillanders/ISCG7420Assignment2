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
    alert("You've been logged out.");
    navigate("/");
  };

  return (
    <nav
      style={{
        backgroundColor: "#f60404",
        color: "white",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Left-aligned Brand Name */}
      <div style={{
        marginRight: "auto",
        fontWeight: "bold",
        fontSize: "1.2em"
      }}>
        Te Whare Ruanga
      </div>

      {/* Center-aligned Navigation Links */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        flexGrow: 1,
        gap: "15px",
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)"
      }}>
        {token ? (
          <>
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

            {isAdmin && (
              <Link
                to="/admin-dashboard"
                style={{
                  color: "#f6f3f3",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Admin Dashboard
              </Link>
            )}
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
                textDecoration: "none",
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>

      {/* Right-aligned Logout Button */}
      {token && (
        <div style={{ marginLeft: "auto" }}>
          <button
            onClick={handleLogout}
            style={{
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
        </div>
      )}
    </nav>
  );
}