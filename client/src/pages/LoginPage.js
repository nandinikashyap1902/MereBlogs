import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { apiFetch } from '../utils/api';
import '../styles/App.css';
import '../styles/Form.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
                MySwal.fire({ title: 'Login failed!', text: 'Invalid credentials.', icon: 'error', confirmButtonText: 'Try Again!' });
            }
        } catch (err) {
            MySwal.fire('Error', err.message, 'error');
        }
        setUsername('');
        setPassword('');
    }

    if (redirect) return <Navigate to="/posts" />;

    return (
        <div className="center login" onSubmit={loginInfo}>
            <h1>Login</h1>
            <form>
                <div className="inputbox">
                    <input type="text" required onChange={ev => setUsername(ev.target.value)} value={username} />
                    <span>Email</span>
                </div>
                <div className="inputbox">
                    <input type="password" required onChange={ev => setPassword(ev.target.value)} value={password} />
                    <span>Password</span>
                </div>
                <div className="buttons">
                    <button className="blob-btn">
                        Login
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
