import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { apiFetch } from '../utils/api';
import BlobButton from './BlobButton';
import '../styles/Button.scss';
import '../styles/App.css';

export default function Header() {
    const navigate = useNavigate();
    const { userInfo, setUserInfo } = useContext(UserContext);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();

    useEffect(() => {
        apiFetch('/profile', { method: 'GET' })
            .then(res => res.ok ? res.json() : null)
            .then(userInfo => { if (userInfo) setUserInfo(userInfo); });
    }, [setUserInfo]);

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

    function handleSearch(ev) {
        ev.preventDefault();
        const trimmed = searchQuery.trim();
        if (trimmed.length > 0) {
            navigate(`/search?q=${encodeURIComponent(trimmed)}`);
            setSearchQuery('');
        }
    }

    const username = userInfo?.username;
    const name = username ? username.toString().split('@')[0] : '';

    const handleMouseEnter = () => {
        if (location.pathname === '/posts') return;
        setDropdownVisible(!dropdownVisible);
    };

    return (
        <header>
            <Link to="/" className="logo">MERE-BLOGS</Link>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="header-search">
                <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={ev => setSearchQuery(ev.target.value)}
                    className="header-search__input"
                />
                <button type="submit" className="header-search__btn" aria-label="Search">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </button>
            </form>

            <nav>
                {/* Public feed link — always visible */}
                <Link to="/feed">
                    <BlobButton>Feed</BlobButton>
                </Link>

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
                            <BlobButton>AI Write</BlobButton>
                        </Link>

                        <Link to="/create">
                            <BlobButton>Post</BlobButton>
                        </Link>

                        <Link onClick={logout}>
                            <BlobButton>Logout</BlobButton>
                        </Link>
                    </>
                )}

                {!username && (
                    <>
                        <Link to="/login">
                            <BlobButton>Login</BlobButton>
                        </Link>

                        <Link to="/register">
                            <BlobButton>SignUp</BlobButton>
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
}
