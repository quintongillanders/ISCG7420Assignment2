
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '16px 32px',
      backgroundColor: '#333',
      color: '#fff'
    }}>
      <div>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>
          Te Whare Runanga
        </Link>
      </div>
      <div>
        <Link to="/login" style={{ color: '#fff', marginRight: '16px', textDecoration: 'none' }}>Login</Link>
        <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
