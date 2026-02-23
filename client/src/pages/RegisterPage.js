import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
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
                <div className="buttons">
                    <button className="blob-btn">
                        Register
                        <span className="blob-btn__inner">
                            <span className="blob-btn__blobs">
                                <span className="blob-btn__blob"></span>
                                <span className="blob-btn__blob"></span>
                                <span className="blob-btn__blob"></span>
                                <span className="blob-btn__blob"></span>
                            </span>
                        </span>
                    </button>
                    <br />
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                        <defs><filter id="goo">
                            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
                            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7" result="goo"></feColorMatrix>
                            <feBlend in2="goo" in="SourceGraphic" result="mix"></feBlend>
                        </filter></defs>
                    </svg>
                </div>
            </form>
        </div>
    );
}
