import React, { useState } from "react";
import axios from "axios";
import { loginUser, BASE_URL } from "../api";
import { Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser(formData);
      const accessToken = res.data.access;

      localStorage.setItem("token", accessToken);

      const userRes = await axios.get(`${BASE_URL}users/me/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const user = userRes.data;
      const isAdmin = user.is_staff || user.is_superuser;

      localStorage.setItem("is_staff", user.is_staff);
      localStorage.setItem("is_admin", isAdmin);

      if (isAdmin) {
        window.location.href = "/admin-dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome Back</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Login
        </button>
      </form>

      <p className="register-link">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}