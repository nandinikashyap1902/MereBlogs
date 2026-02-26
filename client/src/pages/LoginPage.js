import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { apiFetch } from '../utils/api';
import BlobButton from '../components/BlobButton';
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
                const data = await response.json();
                MySwal.fire({ title: 'Login failed!', text: data.message || 'Invalid credentials.', icon: 'error', confirmButtonText: 'Try Again!' });
            }
        } catch (err) {
            MySwal.fire('Error', err.message, 'error');
        }
        setUsername('');
        setPassword('');
    }

    if (redirect) return <Navigate to="/posts" />;

    return (
        <div className="center login">
            <h1>Login</h1>
            <form onSubmit={loginInfo}>
                <div className="inputbox">
                    <input type="text" required onChange={ev => setUsername(ev.target.value)} value={username} />
                    <span>Email</span>
                </div>
                <div className="inputbox">
                    <input type="password" required onChange={ev => setPassword(ev.target.value)} value={password} />
                    <span>Password</span>
                </div>
                <BlobButton type="submit">Login</BlobButton>
            </form>
        </div>
    );
}
