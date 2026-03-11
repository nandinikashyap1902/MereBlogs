import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { apiFetch } from '../utils/api';
import '../styles/Header.css';

const NAV_ICONS = {
  Feed:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>,
  'My Posts': <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Saved:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  'AI Write': <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  Post:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Login:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>,
  SignUp:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><line x1="19" y1="8" x2="23" y2="8"/><line x1="21" y1="6" x2="21" y2="10"/></svg>,
  Logout:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    apiFetch('/profile', { method: 'GET' })
      .then(res => res.ok ? res.json() : null)
      .then(info => { if (info) setUserInfo(info); });
  }, [setUserInfo]);

  // Close sidebar on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Close sidebar on outside click
  useEffect(() => {
    function handleClick(e) {
      if (menuOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  function logout() {
    apiFetch('/logout', { method: 'POST' })
      .then(res => {
        if (res.ok) { setUserInfo(null); navigate('/login', { replace: true }); }
      });
  }

  function handleSearch(ev) {
    ev.preventDefault();
    const q = searchQuery.trim();
    if (q) { navigate(`/search?q=${encodeURIComponent(q)}`); setSearchQuery(''); }
  }

  const username = userInfo?.username;
  const name = username ? username.split('@')[0] : '';
  const isActive = (path) => location.pathname === path;

  function NavLink({ to, label, onClick }) {
    const active = isActive(to);
    return (
      <Link
        to={to}
        className={`nav-item ${active ? 'nav-item--active' : ''}`}
        onClick={onClick}
      >
        <span className="nav-item__icon">{NAV_ICONS[label]}</span>
        <span className="nav-item__label">{label}</span>
        {active && <span className="nav-item__dot" />}
      </Link>
    );
  }

  return (
    <>
      {/* ── Top Header Bar ── */}
      <header className="site-header">
        {/* Left: Logo + hamburger */}
        <div className="site-header__left">
          <button
            className={`hamburger ${menuOpen ? 'hamburger--open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
          <Link to="/" className="site-logo">
            <span className="site-logo__text">MERE</span>
            <span className="site-logo__accent">BLOGS</span>
          </Link>
        </div>

        {/* Centre: Search */}
        <form onSubmit={handleSearch} className="header-search">
          <svg className="header-search__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={ev => setSearchQuery(ev.target.value)}
            className="header-search__input"
          />
        </form>

        {/* Right: user badge */}
        {username && (
          <div className="user-badge">
            <div className="user-badge__avatar">{name[0]?.toUpperCase()}</div>
            <span className="user-badge__name">{name}</span>
          </div>
        )}
      </header>

      {/* ── Sidebar Drawer ── */}
      <div className={`sidebar-overlay ${menuOpen ? 'sidebar-overlay--visible' : ''}`} onClick={() => setMenuOpen(false)} />

      <aside className={`sidebar ${menuOpen ? 'sidebar--open' : ''}`} ref={sidebarRef}>
        {/* Sidebar header */}
        <div className="sidebar__header">
          <Link to="/" className="site-logo">
            <span className="site-logo__text">MERE</span>
            <span className="site-logo__accent">BLOGS</span>
          </Link>
          <button className="sidebar__close" onClick={() => setMenuOpen(false)} aria-label="Close menu">✕</button>
        </div>

        {/* User info strip */}
        {username && (
          <div className="sidebar__user">
            <div className="sidebar__avatar">{name[0]?.toUpperCase()}</div>
            <div>
              <p className="sidebar__user-name">{name}</p>
              <p className="sidebar__user-email">{username}</p>
            </div>
          </div>
        )}

        {/* Nav section */}
        <nav className="sidebar__nav">
          <p className="sidebar__section-label">Discover</p>
          <NavLink to="/feed" label="Feed" />

          {username && (
            <>
              <p className="sidebar__section-label">My Space</p>
              <NavLink to="/posts"    label="My Posts" />
              <NavLink to="/saved"    label="Saved" />
              <NavLink to="/generate" label="AI Write" />
              <NavLink to="/create"   label="Post" />
            </>
          )}

          {!username && (
            <>
              <p className="sidebar__section-label">Account</p>
              <NavLink to="/login"    label="Login" />
              <NavLink to="/register" label="SignUp" />
            </>
          )}
        </nav>

        {/* Logout pinned at bottom */}
        {username && (
          <div className="sidebar__footer">
            <button className="sidebar__logout" onClick={logout}>
              {NAV_ICONS['Logout']}
              <span>Logout</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
