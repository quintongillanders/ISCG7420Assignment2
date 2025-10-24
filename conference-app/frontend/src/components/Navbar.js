import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));
  const navigate = useNavigate();
  const location = useLocation(); // track route changes

  // Update login state whenever the route changes
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('access_token'));
  }, [location]);

  // Optional: listen for storage changes across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('access_token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete axios.defaults.headers.common['Authorization'];
    setIsLoggedIn(false);
    navigate('/login'); // redirect to login after logout
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '16px 32px',
      backgroundColor: '#f60505',
      color: '#fff'
    }}>
      <div>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>
          Te Whare Runanga
        </Link>
      </div>
      <div>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff', marginRight: '16px', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
