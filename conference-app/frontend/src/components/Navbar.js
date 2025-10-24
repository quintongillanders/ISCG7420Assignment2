import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('access_token'));
  }, [location]);

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
    navigate('/login');
  };

  // Common link/button styles
  const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '16px',
    padding: '8px 12px',
    borderRadius: '4px',
    transition: 'background 0.2s',
  };

  const hoverEffect = {
    backgroundColor: 'rgba(255,255,255,0.2)'
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 32px',
      backgroundColor: '#f60505',
      color: '#fff',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Left: Logo */}
      <div>
        <Link to="/" style={{ ...linkStyle, fontWeight: 'bold', fontSize: '20px' }}>
          Te Whare Runanga
        </Link>
      </div>

      {/* Center: Make Reservation */}
      <div style={{ flex: 1, textAlign: 'center' }}>
        {isLoggedIn && (
          <Link
            to="/make-reservation"
            style={linkStyle}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverEffect.backgroundColor}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Make Reservation
          </Link>
        )}
      </div>

      {/* Right: Login / Register / Logout */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            style={{
              ...linkStyle,
              background: 'none',
              border: '1px solid #fff',
              cursor: 'pointer'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverEffect.backgroundColor}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              style={linkStyle}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverEffect.backgroundColor}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={linkStyle}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverEffect.backgroundColor}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
