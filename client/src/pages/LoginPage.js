import React, { useState, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { apiFetch } from '../utils/api';
import Layout from '../components/Layout';
import '../styles/App.css';
import '../styles/Form.css';
import '../styles/Home.css'; // For button styles
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  async function loginInfo(ev) {
    ev.preventDefault();
    try {
      const response = await apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const userInfo = await response.json();
        setUserInfo(userInfo);
        MySwal.fire({ title: 'Success!', text: 'Welcome back!', icon: 'success', confirmButtonText: 'OK' });
        setRedirect(true);
      } else {
        const data = await response.json();
        setError(data.message || 'Invalid credentials.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login.');
    }
  }

  if (redirect) return <Navigate to="/posts" />;

  return (
    <>
      <Layout />
      <div className="form-page">
        {/* Background blobs */}
        <div className="form-blob form-blob--1" />
        <div className="form-blob form-blob--2" />

        <div className="form-container">
          <h1>Welcome Back</h1>
          <p className="subtitle">Sign in to continue your blogging journey</p>

          <form onSubmit={loginInfo}>
            {error && <div className="form-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                required
                onChange={ev => {
                  setUsername(ev.target.value);
                  setError('');
                }}
                value={username}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                required
                onChange={ev => {
                  setPassword(ev.target.value);
                  setError('');
                }}
                value={password}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn--primary">
                Sign In
              </button>
            </div>
            
            <div className="form-footer">
              Don't have an account? <Link to="/register">Sign Up here.</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
