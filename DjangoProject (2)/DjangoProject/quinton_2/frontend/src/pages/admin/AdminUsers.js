import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../api";
import "./AdminUsers.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    is_staff: false
  });
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}users/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch users. Only admins can access this page.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (editingUser) {
        await axios.put(`${BASE_URL}users/${editingUser.id}/`, formData, config);
        alert("User updated successfully!");
      } else {
        await axios.post(`${BASE_URL}users/`, formData, config);
        alert("User created successfully!");
      }

      setEditingUser(null);
      setFormData({ username: "", email: "", password: "", is_staff: false });
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(`Failed to ${editingUser ? "update" : "create"} user.`);
    }
  };

  const editUser = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      is_staff: user.is_staff
    });
    setShowForm(true);
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`${BASE_URL}users/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User deleted successfully.");
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    }
  };

  const toggleAdmin = async (user) => {
    try {
      await axios.put(
        `${BASE_URL}users/${user.id}/`,
        { ...user, is_staff: !user.is_staff },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to update user role.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-users-container">
      <h2>Manage Users</h2>

      <div className="users-table">
        <div className="table-header">
          <button
            className="btn btn-add-user"
            onClick={() => {
              setShowForm(true);
              setEditingUser(null);
              setFormData({ username: "", email: "", password: "", is_staff: false });
            }}
          >
            + Add User
          </button>
        </div>

        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Admin Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`admin-status ${user.is_staff ? "admin" : ""}`}>
                      {user.is_staff ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="actions">
                    <button className="btn btn-edit" onClick={() => editUser(user)}>
                      Edit
                    </button>
                    <button
                      className={`btn ${user.is_staff ? "btn-remove-admin" : "btn-make-admin"}`}
                      onClick={() => toggleAdmin(user)}
                    >
                      {user.is_staff ? "Remove Admin" : "Make Admin"}
                    </button>
                    {!user.is_staff && (
                      <button className="btn btn-delete" onClick={() => deleteUser(user.id)}>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="user-form-container">
          <h3>{editingUser ? "Edit User" : "Add New User"}</h3>
          <form onSubmit={handleSubmit} className="user-form">
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required={!editingUser}
                placeholder={editingUser ? "Leave blank to keep current password" : ""}
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
              <button type="submit" className="btn btn-primary">
                {editingUser ? "Update User" : "Add User"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditingUser(null);
                  setShowForm(false);
                }}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
