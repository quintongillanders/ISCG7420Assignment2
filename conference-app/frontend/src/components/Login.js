import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');

      try {
        const response = await axios.post('http://localhost:8000/api-token-auth/', {
          username: username,
          password: password
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        localStorage.setItem('access_token', response.data.token);  // Changed from 'access'
        axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;  // Changed from 'Bearer'
        navigate('/');
      } catch (err) {
        console.error(err.response ? err.response.data : err);
        setError('Login failed. Please check your credentials and try again.');
      }
    };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: '60%',
            padding: '12px',
            backgroundColor: '#ef0808',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '16px',
              alignSelf: 'center',
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
