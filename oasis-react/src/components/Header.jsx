import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { searchContent } from '../utils/searchService';

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ posts: [], authors: [], topics: [] });
  const [searchLoading, setSearchLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const searchWrapperRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, loading, user } = useAuth();
  const { unreadCount } = useNotifications();

  // Close dropdown on route change
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [location.pathname, location.search]);

  // Click outside and escape key handling
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Live search debounce
  useEffect(() => {
    const clean = searchQuery.trim();
    if (clean.length < 2) {
      setSearchResults({ posts: [], authors: [], topics: [] });
      setSearchLoading(false);
      setIsDropdownOpen(false);
      return;
    }

    setSearchLoading(true);
    setIsDropdownOpen(true);

    const timer = setTimeout(async () => {
      const results = await searchContent(clean, { limitPosts: 4, limitAuthors: 3 });
      setSearchResults(results);
      setSearchLoading(false);
    }, 260);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsDropdownOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setIsDropdownOpen(false);
    setSearchResults({ posts: [], authors: [], topics: [] });
  };

  return (
    <nav 
      className="site-header"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}
    >
      <div className="container nav__container">
        
        {/* 1. Logo */}
        <Link to="/discover" className="nav__logo" onClick={(e) => {
          if (location.pathname === '/discover') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}>
          <img src="/assets/images/brand/logo.svg" alt="OASIS Logo" width="96" height="32" />
        </Link>

        {/* 2. Center menu (desktop) / sliding panel (mobile) */}
        <ul className={`nav__items ${isNavOpen ? 'show' : ''}`}>
          <li>
            <button id="close__nav-btn" onClick={() => setIsNavOpen(false)}>✕</button>
          </li>
          <li><NavLink to="/discover" onClick={() => setIsNavOpen(false)}>Discover</NavLink></li>
          {user && (
            <>
              <li><NavLink to="/following" onClick={() => setIsNavOpen(false)}>Following</NavLink></li>
              <li><NavLink to="/popular" onClick={() => setIsNavOpen(false)}>Popular</NavLink></li>
              <li><NavLink to="/topics" onClick={() => setIsNavOpen(false)}>Topics</NavLink></li>
            </>
          )}
          <li><NavLink to="/about" onClick={() => setIsNavOpen(false)}>About</NavLink></li>
          {!user && (
            <li className="nav__items-guest-auth">
              <Link to="/?auth=login" onClick={() => setIsNavOpen(false)} className="header-guest-login">Log in</Link>
              <Link to="/?auth=signup" onClick={() => setIsNavOpen(false)} className="header-guest-signup">Sign up</Link>
            </li>
          )}
        </ul>

        {/* Mobile menu backdrop overlay */}
        {isNavOpen && (
          <div 
            className="nav__overlay" 
            onClick={() => setIsNavOpen(false)}
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.45)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
              zIndex: 1000
            }}
          />
        )}

        {/* 3. Right side: search with instant dropdown, notifications, avatar, burger */}
        <div className="nav__actions">
          {user && (
            <div className="search-bar-wrapper" ref={searchWrapperRef}>
            <form onSubmit={handleSearch} className="search-bar">
              <img loading="lazy" src="/assets/images/icons/search.svg" alt="Search" />
              <input 
                type="text" 
                placeholder="Search stories..." 
                aria-label="Search stories" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim().length >= 2) {
                    setIsDropdownOpen(true);
                  }
                }}
              />
              {searchLoading && <span className="search-bar-spinner" />}
              {searchQuery && !searchLoading && (
                <button 
                  type="button" 
                  className="search-bar-clear" 
                  onClick={handleClear}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </form>

            {/* Instant live dropdown */}
            {isDropdownOpen && searchQuery.trim().length >= 2 && (
              <div className="search-dropdown">
                {searchLoading ? (
                  <div className="search-dropdown__loading">
                    <span className="search-dropdown__spinner" />
                    <span>Searching stories & authors...</span>
                  </div>
                ) : (!searchResults.posts?.length && !searchResults.authors?.length && !searchResults.topics?.length) ? (
                  <div className="search-dropdown__empty">
                    <p>No results for "<b>{searchQuery}</b>"</p>
                    <span className="search-dropdown__empty-sub">Try searching by topic, author, or keyword</span>
                  </div>
                ) : (
                  <div className="search-dropdown__content">
                    {/* Topics */}
                    {searchResults.topics?.length > 0 && (
                      <div className="search-dropdown__section">
                        <span className="search-dropdown__section-label">TOPICS</span>
                        <div className="search-dropdown__topics-list">
                          {searchResults.topics.map(topic => (
                            <Link 
                              key={topic.id} 
                              to={`/category?cat=${encodeURIComponent(topic.name)}`}
                              className="search-dropdown__topic-chip"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              {topic.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stories */}
                    {searchResults.posts?.length > 0 && (
                      <div className="search-dropdown__section">
                        <span className="search-dropdown__section-label">STORIES ({searchResults.posts.length})</span>
                        <div className="search-dropdown__list">
                          {searchResults.posts.map(post => (
                            <Link 
                              key={post.id} 
                              to={`/post/${post.id}`} 
                              className="search-dropdown__story-item"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <img 
                                src={post.cover_image || '/assets/images/content/default.jpg'} 
                                alt="" 
                                className="search-dropdown__story-thumb" 
                              />
                              <div className="search-dropdown__story-info">
                                <span className="search-dropdown__story-title">{post.title}</span>
                                <div className="search-dropdown__story-meta">
                                  <span className="search-dropdown__story-cat">{post.category?.split(' - ')[0] || 'Story'}</span>
                                  <span className="search-dropdown__meta-dot">&middot;</span>
                                  <span className="search-dropdown__story-author">{post.profiles?.username || 'Author'}</span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Authors */}
                    {searchResults.authors?.length > 0 && (
                      <div className="search-dropdown__section">
                        <span className="search-dropdown__section-label">AUTHORS ({searchResults.authors.length})</span>
                        <div className="search-dropdown__list">
                          {searchResults.authors.map(author => (
                            <Link 
                              key={author.id} 
                              to={`/profile/${author.id}`} 
                              className="search-dropdown__author-item"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <img 
                                src={author.avatar_url || '/assets/images/icons/avatar.svg'} 
                                alt="" 
                                className="search-dropdown__author-avatar"
                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/assets/images/icons/avatar.svg'; }}
                              />
                              <div className="search-dropdown__author-info">
                                <span className="search-dropdown__author-name">{author.username}</span>
                                {author.bio && (
                                  <span className="search-dropdown__author-bio">
                                    {author.bio.length > 55 ? `${author.bio.substring(0, 55)}...` : author.bio}
                                  </span>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* View all footer */}
                    <Link 
                      to={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
                      className="search-dropdown__footer"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span>See all results for "<b>{searchQuery}</b>"</span>
                      <span className="search-dropdown__footer-icon">↵</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
          )}

          {user ? (
            <>
              <Link 
                to="/notifications" 
                className={`notification-btn ${location.pathname === '/notifications' ? 'active' : ''}`} 
                aria-label="Notifications"
              >
                <img src="/assets/images/icons/notification_icon.svg" alt="Notifications" width="20" height="20" />
                {unreadCount > 0 && (
                  <span className="notification-btn__badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
              </Link>
              
              {profile?.avatar_url ? (
                <Link to="/dashboard" className="avatar" style={{ padding: 0, overflow: 'hidden' }}>
                  <img 
                    decoding="async" 
                    src={profile.avatar_url} 
                    alt="Profile" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                  />
                </Link>
              ) : profile?.username ? (
                <Link to="/dashboard" className="avatar">{profile.username.substring(0, 2).toUpperCase()}</Link>
              ) : (
                <Link to="/dashboard" className="avatar">U</Link>
              )}
            </>
          ) : !loading ? (
            <div className="header-guest-auth">
              <Link to="/?auth=login" className="header-guest-login">Log in</Link>
              <Link to="/?auth=signup" className="header-guest-signup">Sign up</Link>
            </div>
          ) : null}

          {/* burger button, only visible on mobile */}
          <button id="open__nav-btn" onClick={() => setIsNavOpen(true)}>☰</button>
        </div>

      </div>
    </nav>
  )
}
