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

  const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '16px',
    padding: '8px 12px',
    borderRadius: '4px',
    transition: 'background 0.2s',
  };

  const hoverEffect = {
    backgroundColor: 'rgba(255,255,255,0.2)',
  };

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 32px',
        backgroundColor: '#f60505',
        color: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontWeight: 'bold',
          fontSize: '20px',
          color: '#fff',
          cursor: 'default',
        }}
      >
        Te Whare Rūnanga
      </div>

      {/* Navigation Tabs (only if logged in) */}
      {isLoggedIn && (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link
            to="/"
            style={linkStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = hoverEffect.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
          >
            Rooms List
          </Link>

          <Link
            to="/reservation-list"
            style={linkStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = hoverEffect.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
          >
            My Reservations
          </Link>

          <Link
            to="/make-reservation"
            style={linkStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = hoverEffect.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
          >
            Make Reservation
          </Link>

          <Link
            to="/admin"
            style={linkStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = hoverEffect.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
          >
            Admin Panel
          </Link>
        </div>
      )}

      {/* Auth Buttons */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            style={{
              ...linkStyle,
              background: 'none',
              border: '1px solid #fff',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = hoverEffect.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              style={linkStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = hoverEffect.backgroundColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = 'transparent')
              }
            >
              Login
            </Link>
            <Link
              to="/register"
              style={linkStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = hoverEffect.backgroundColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = 'transparent')
              }
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
