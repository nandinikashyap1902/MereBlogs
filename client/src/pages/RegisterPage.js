import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import BlobButton from '../components/BlobButton';
import '../styles/App.css';
import '../styles/Form.css';
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
                MySwal.fire({ title: 'Failed!', text: data.message || 'Registration failed.', icon: 'error', confirmButtonText: 'Try Again!' });
            }
        } catch (err) {
            MySwal.fire('Error', err.message, 'error');
        }
        setError('');
        setUsername('');
        setPassword('');
    }

    if (redirect) return <Navigate to="/login" />;

    return (
        <div className="center register">
            <h1>Register</h1>
            <form onSubmit={register}>
                <div className="inputbox">
                    <input type="email" required onChange={ev => setUsername(ev.target.value)} value={username} />
                    <span>Email</span>
                </div>
                <div className="inputbox">
                    <input type="password" required onChange={ev => setPassword(ev.target.value)} value={password} maxLength={10} />
                    <span>Password</span>
                </div>
                <div className="error">{error}</div>
                <BlobButton type="submit">Register</BlobButton>
            </form>
        </div>
    );
}
