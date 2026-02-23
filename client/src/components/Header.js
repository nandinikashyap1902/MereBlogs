import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { apiFetch } from '../utils/api';
import '../styles/Button.scss';
import '../styles/App.css';

export default function Header() {
    const navigate = useNavigate();
    const { userInfo, setUserInfo } = useContext(UserContext);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const location = useLocation();

    useEffect(() => {
        apiFetch('/profile', { method: 'GET' })
            .then(res => res.ok ? res.json() : null)
            .then(userInfo => { if (userInfo) setUserInfo(userInfo); });
    }, []);

    useEffect(() => {
        setDropdownVisible(false);
    }, [location]);

    function logout() {
        apiFetch('/logout', { method: 'POST' })
            .then(response => {
                if (response.ok) {
                    setUserInfo(null);
                    navigate('/login', { replace: true });
                }
            })
            .catch(error => console.error('Error during logout:', error));
    }

    const username = userInfo?.username;
    let name = username ? username.toString().split('@')[0] : '';

    const handleMouseEnter = () => {
        if (location.pathname === '/posts') return;
        setDropdownVisible(!dropdownVisible);
    };

    return (
        <header>
            <Link to="/" className="logo">MERE-BLOGS</Link>
            <nav>
                {username && (
                    <>
                        <div className="user-info" onMouseEnter={handleMouseEnter}>
                            <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                                WelcomeBack, {name}
                            </p>
                            {location.pathname !== '/posts' && (
                                <div className="dropdown-menu">
                                    <Link to="/posts">My posts</Link>
                                </div>
                            )}
                        </div>

                        <Link to="/generate">
                            <div className="buttons">
                                <button className="blob-btn">
                                    AI Write
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
                        </Link>

                        <Link to="/create">
                            <div className="buttons">
                                <button className="blob-btn">
                                    Post
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
                        </Link>

                        <Link onClick={logout}>
                            <div className="buttons">
                                <button className="blob-btn">
                                    Logout
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
                        </Link>
                    </>
                )}

                {!username && (
                    <>
                        <Link to="/login">
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
                        </Link>

                        <Link to="/register">
                            <div className="buttons">
                                <button className="blob-btn">
                                    SignUp
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
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
}
