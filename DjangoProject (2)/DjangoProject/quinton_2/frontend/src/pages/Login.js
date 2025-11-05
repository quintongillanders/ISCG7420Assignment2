import React, { useState } from "react";
import axios from "axios";
import { loginUser, BASE_URL } from "../api";
import { Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Step 1️⃣ Get JWT token
      const res = await loginUser(formData);
      const accessToken = res.data.access;

      // Step 2️⃣ Save token in localStorage
      localStorage.setItem("token", accessToken);

      // Step 3️⃣ Fetch user info to check admin status
      const userRes = await axios.get(`${BASE_URL}users/me/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const user = userRes.data;
      const isAdmin = user.is_staff || user.is_superuser;

      // Step 4️⃣ Save role info
      localStorage.setItem("is_staff", user.is_staff);
      localStorage.setItem("is_admin", isAdmin);

      // Step 5️⃣ Redirect with full reload (fixes admin redirect issue)
      if (isAdmin) {
        alert("✅ Welcome, Admin!");
        window.location.href = "/admin-dashboard"; // 👈 forces React Router reload
      } else {
        alert("✅ Welcome back!");
        window.location.href = "/dashboard"; // 👈 same here
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      alert("❌ Invalid username or password. Please try again.");
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "60px",
        maxWidth: "400px",
        margin: "50px auto",
      }}
    >
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit" style={{ marginTop: "10px" }}>
          Login
        </button>
      </form>

      <p style={{ marginTop: "10px" }}>
        Don’t have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}
