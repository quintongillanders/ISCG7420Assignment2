import React, { useState, useEffect } from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/users/');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleAdminStatus = async (userId, currentStatus) => {
    try {
      await axios.patch(`http://localhost:8000/api/users/${userId}/`, {
        is_staff: !currentStatus,
        is_superuser: !currentStatus
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (loading) return <div className="loading-spinner">Loading users...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3>User Management</h3>
        <Button variant="primary" onClick={() => navigate('/admin/create-user')}>
          Add New User
        </Button>
      </div>

      <div className="table-responsive">
        <Table striped bordered hover className="align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Status</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge bg={user.is_active ? 'success' : 'secondary'}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={user.is_staff ? 'primary' : 'info'}>
                      {user.is_staff ? 'Admin' : 'User'}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant={user.is_staff ? 'warning' : 'success'}
                      size="sm"
                      className="me-2"
                      onClick={() => toggleAdminStatus(user.id, user.is_staff)}
                    >
                      {user.is_staff ? 'Remove Admin' : 'Make Admin'}
                    </Button>
                    <Button variant="danger" size="sm" disabled={user.is_superuser}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default ManageUsers;
