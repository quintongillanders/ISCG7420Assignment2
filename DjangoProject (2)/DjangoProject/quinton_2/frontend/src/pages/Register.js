import React, { useState } from "react";
import { registerUser } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      alert("Registration successful! You can now log in.");
      navigate("/");
    } catch (err) {
      alert("Error registering. Try again.");
    }
  };

  return (
    <div className="container" style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
        /><br />
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
        /><br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        /><br />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}
