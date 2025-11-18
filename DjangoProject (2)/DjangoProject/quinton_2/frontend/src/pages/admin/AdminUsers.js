import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../api";
import Banner from "../../components/Banner";
import "./AdminUsers.css";

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    is_staff: false
  });

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}users/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorMessage("Failed to load users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${BASE_URL}users/${editingId}/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccessMessage("User updated successfully.");
      } else {
        await axios.post(`${BASE_URL}users/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccessMessage("User created successfully.");
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        username: "",
        email: "",
        password: "",
        is_staff: false
      });
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      setErrorMessage("Failed to save user. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      is_staff: user.is_staff
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${BASE_URL}users/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccessMessage("User deleted successfully.");
        setTimeout(() => setSuccessMessage(""), 3000);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        setErrorMessage("Failed to delete user. Please try again.");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      username: "",
      email: "",
      password: "",
      is_staff: false
    });
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-users">
      <div className="admin-header">
        <button
          className="btn btn-back"
          onClick={() => navigate('/admin-dashboard')}
        >
          &larr; Back to Dashboard
        </button>
        <h2>Manage Users</h2>
      </div>

      <Banner type="success" message={successMessage} onClose={() => setSuccessMessage("")} autoHideMs={3000} />
      <Banner type="error" message={errorMessage} onClose={() => setErrorMessage("")} autoHideMs={3000} />

      <div className="users-controls">
        <button
          className={`btn ${showForm ? 'btn-secondary' : 'btn-add'}`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add New User'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="user-form">
          <h3>{editingId ? 'Edit User' : 'Add New User'}</h3>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required={!editingId}
              placeholder={editingId ? "Leave blank to keep current password" : ""}
            />
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="is_staff"
                checked={formData.is_staff}
                onChange={handleInputChange}
              />
              Admin User
            </label>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update User' : 'Add User'}
            </button>
          </div>
        </form>
      )}

      <div className="users-list">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.is_staff ? 'Admin' : 'User'}</td>
                  <td className="actions">
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-users">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}