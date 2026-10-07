import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  console.log("Header rendered!");
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, loading } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault(); // Блокируем стандартную перезагрузку браузера
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav>
      <div className="container nav__container">
        
        {/* 1. Logo */}
        <Link to="/discover" className="nav__logo" onClick={(e) => {
          if (location.pathname === '/discover') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}>
          <img src="/assets/images/brand/logo.svg" alt="OASIS Logo" />
        </Link>

        {/* 2. Center menu (desktop) / sliding panel (mobile) */}
        <ul className={`nav__items ${isNavOpen ? 'show' : ''}`}>
          <li>
            <button id="close__nav-btn" onClick={() => setIsNavOpen(false)}>✕</button>
          </li>
          <li><NavLink to="/discover" onClick={() => setIsNavOpen(false)}>Discover</NavLink></li>
          <li><NavLink to="/following" onClick={() => setIsNavOpen(false)}>Following</NavLink></li>
          <li><NavLink to="/popular" onClick={() => setIsNavOpen(false)}>Popular</NavLink></li>
          <li><NavLink to="/topics" onClick={() => setIsNavOpen(false)}>Topics</NavLink></li>
          <li><NavLink to="/about" onClick={() => setIsNavOpen(false)}>About</NavLink></li>
        </ul>

        {/* 3. Right side: search, notifications, avatar, burger */}
        <div className="nav__actions">
          <form onSubmit={handleSearch} className="search-bar">
            <img loading="lazy" src="/assets/images/icons/search.svg" alt="Search" />
            <input 
              type="text" 
              placeholder="Search stories..." 
              aria-label="Search stories" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <Link to="/notifications" className="notification-btn" aria-label="Notifications">
            <img loading="lazy" src="/assets/images/icons/notification_icon.svg" alt="Notifications" />
          </Link>
          
          {loading ? (
             <div className="avatar" style={{ background: '#e2e8f0', color: 'transparent', animation: 'pulse 1.5s infinite' }}>..</div>
          ) : profile?.avatar_url ? (
            <Link to="/dashboard" className="avatar" style={{ padding: 0, overflow: 'hidden' }}>
              <img src={profile.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Link>
          ) : (
            <Link to="/dashboard" className="avatar">{profile?.username ? profile.username.substring(0, 2).toUpperCase() : 'EA'}</Link>
          )}

          {/* burger button, only visible on mobile */}
          <button id="open__nav-btn" onClick={() => setIsNavOpen(true)}>☰</button>
        </div>

      </div>
    </nav>
  )
}
