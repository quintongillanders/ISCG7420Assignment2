import React, { useState } from "react";
import { registerUser } from "../api";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await registerUser(formData);
      alert("Registration successful! You can now log in.");
      navigate("/");
    } catch (err) {
      setError("Error registering. Please try again.");
      console.error("Registration error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Create Account</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Register
        </button>
      </form>

      <p className="login-link">
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </div>
  );
}