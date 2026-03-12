import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import Layout from '../components/Layout';
import '../styles/App.css';
import '../styles/Form.css';
import '../styles/Home.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [redirect, setRedirect] = useState(false);

  async function register(ev) {
    ev.preventDefault();
    if (password.length > 10) {
      setError('Password must be up to 10 characters');
      return;
    }
    try {
      const response = await apiFetch('/register', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        MySwal.fire({ title: 'Success!', text: 'Account created. Please log in.', icon: 'success', confirmButtonText: 'OK' });
        setRedirect(true);
      } else {
        const data = await response.json();
        setError(data.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during registration.');
    }
  }

  if (redirect) return <Navigate to="/login" />;

  return (
    <>
      <Layout />
      <div className="form-page">
        {/* Background blobs */}
        <div className="form-blob form-blob--1" />
        <div className="form-blob form-blob--2" />

        <div className="form-container">
          <h1>Create Account</h1>
          <p className="subtitle">Join the MereBlogs community today</p>

          <form onSubmit={register}>
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
                placeholder="Choose a password (Max 10 chars)"
                required
                maxLength={10}
                onChange={ev => {
                  setPassword(ev.target.value);
                  setError('');
                }}
                value={password}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn--primary">
                Sign Up
              </button>
            </div>

            <div className="form-footer">
              Already have an account? <Link to="/login">Sign In here.</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
