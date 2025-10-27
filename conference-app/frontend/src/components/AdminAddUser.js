import React, { useState } from "react";
import axios from "axios";
import "./AdminAddUser.css";

const API_URL = "http://localhost:8000/api/";

const AdminAddUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    is_staff: false,
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}users/`, formData);
      setMessage("User created successfully!");
      setFormData({ username: "", email: "", password: "", is_staff: false });
    } catch (error) {
      console.error("Add user error:", error);
      setMessage("Failed to create user.");
    }
  };

  return (
    <div className="admin-add-user-container">
      <h2>Create New User</h2>
      <div className="admin-add-user-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="checkbox-row">
            <input
              type="checkbox"
              name="is_staff"
              checked={formData.is_staff}
              onChange={handleChange}
            />
            <label>Staff Status</label>
          </div>

          <div className="button-row">
            <button type="submit" className="btn-primary">
              Create User
            </button>
          </div>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default AdminAddUser;
