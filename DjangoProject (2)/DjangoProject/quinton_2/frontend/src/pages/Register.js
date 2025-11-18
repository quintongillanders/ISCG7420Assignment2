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
      const response = await registerUser(formData);
      console.log('Registration response:', response);
      if (response && response.data) {
        alert("Registration successful! You can now log in.");
        navigate("/");
      } else {
        throw new Error('No response data received from server');
      }
    } catch (err) {
      const errorData = err.response?.data || {};
      setError(errorData.error || errorData);
      console.error("Registration error:", {
        error: err,
        response: errorData,
        status: err.response?.status
      });
    }
  };

  // Format backend validation errors for display
  const formatValidationErrors = (errors) => {
    if (!errors) return 'Registration failed. Please check your input.';
    
    if (Array.isArray(errors)) {
      return errors.join(' ');
    }
    
    if (typeof errors === 'object') {
      return Object.entries(errors)
        .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(' ') : messages}`)
        .join('\n');
    }
    
    return String(errors);
  };

  return (
    <div className="register-container">
      <h2>Create Account</h2>

      {error && (
        <div className="error-message">
          {typeof error === 'object' ? formatValidationErrors(error) : error}
        </div>
      )}

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