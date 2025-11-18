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
      console.log('Attempting login with:', formData);
      const res = await loginUser(formData);
      console.log('Login response:', res.data);
      
      if (!res.data.access) {
        throw new Error('No access token received');
      }
      
      const accessToken = res.data.access;
      localStorage.setItem("token", accessToken);

      console.log('Fetching user profile...');
      const userRes = await axios.get(`${BASE_URL}users/me/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log('User profile:', userRes.data);

      const user = userRes.data;
      const isAdmin = user.is_staff || user.is_superuser;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("is_staff", user.is_staff);
      localStorage.setItem("is_admin", isAdmin);

      console.log('Login successful, redirecting...');
      window.location.href = isAdmin ? "/admin-dashboard" : "/dashboard";
      
    } catch (err) {
      console.error("Login error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config
      });
      
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          'Login failed. Please check your credentials and try again.';
      setError(errorMessage);
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