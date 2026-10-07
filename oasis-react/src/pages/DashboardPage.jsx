import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../assets/css/dashboard.css'; // Direct import
import { useToast } from '../context/ToastContext';

export default function DashboardPage() {
  const addToast = useToast();
  const { profile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [profileName, setProfileName] = useState("Alina Bezsonova");
  const [profileBio, setProfileBio] = useState("Medientechnik designer and front-end developer focused on CSS Grid, modern UI, and cinematic photography.");
  const [activeTab, setActiveTab] = useState("drafts");
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
    const [coverImage, setCoverImage] = useState(null);

  useEffect(() => {
    if (profile) {
        if (profile.username) {
            setProfileName(profile.username);
            setEditName(profile.username);
        }
        if (profile.bio) {
            setProfileBio(profile.bio);
            setEditBio(profile.bio);
        }
        if (profile.avatar_url) {
            setCoverImage(profile.avatar_url);
        }
    }
  }, [profile]);
  
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const tabsRef = useRef(null);

  useEffect(() => {
    if (tabsRef.current) {
      const activeTabEl = tabsRef.current.querySelector('.tab-pill.active');
      if (activeTabEl) {
        setIndicatorStyle({
          width: activeTabEl.offsetWidth,
          left: activeTabEl.offsetLeft
        });
      }
    }
  }, [activeTab]);
  
  const [editName, setEditName] = useState(profileName);
  const [editBio, setEditBio] = useState(profileBio);
  
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setCoverImage(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (showFollowingModal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [showFollowingModal]);

  return (
    <div className="dashboard-page">
      <Header />
      <header className="dashboard-hero" style={coverImage ? { backgroundImage: `url(${coverImage})` } : {}}>
    <input type="file" id="cover-photo-input" style={{ display: 'none' }} accept="image/*" onChange={handleCoverChange} />

    <div className="hero-content">
        {!isEditing ? (
            <h1 className="profile-name" id="profile-name-text">{profileName}</h1>
        ) : (
            <input 
                type="text" 
                id="profile-name-input" 
                aria-label="Profile Name" 
                className="inline-edit-input" 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
            />
        )}

        <div className="profile-stats">
            <div className="stat-item">
                <span className="stat-value">183</span>
                <span className="stat-label">Posts</span>
            </div>
            <div className="stat-item">
                <span className="stat-value">27K</span>
                <span className="stat-label">Followers</span>
            </div>
            <div className="stat-item">
                <span className="stat-value">134</span>
                <span className="stat-label">Following</span>
            </div>
        </div>
        
        <div className="bio-glass-card">
            {!isEditing ? (
                <p className="profile-bio" id="profile-bio-text">{profileBio}</p>
            ) : (
                <>
                    <textarea 
                        id="profile-bio-input" 
                        aria-label="Profile Bio" 
                        className="inline-edit-input"
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                    />
                    <div id="bio-char-counter">{editBio.length}/160</div>
                </>
            )}
        </div>
        
        {isEditing && (
            <label htmlFor="cover-photo-input" id="change-photo-btn" className="btn-change-photo">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                </svg>
                Change photo
            </label>
        )}
    </div>

    <div className="hero-actions">
        {!isEditing ? (
            <>
                <button className="btn-glass" id="btn-edit-profile" onClick={() => {
                    setEditName(profileName);
                    setEditBio(profileBio);
                    setIsEditing(true);
                }}>
                    <img loading="lazy" src="/assets/images/icons/editprofile_icon.svg" style={{ width: '16px', height: '16px' }} alt="" />
                    Edit Profile
                </button>
                <Link to="/settings" className="btn-glass" id="btn-settings-react">
                    <img loading="lazy" src="/assets/images/icons/gear_icon.svg" style={{ width: '16px', height: '16px' }} alt="" />
                    Settings
                </Link>
                <Link to="/support" className="btn-glass" id="btn-support">
                    <img loading="lazy" src="/assets/images/icons/support_icon.png" style={{ width: '16px', height: '16px' }} alt="" />
                    Support
                </Link>
            </>
        ) : (
            <>
                <button className="btn-save-action" id="btn-save-profile" onClick={() => {
                    setProfileName(editName);
                    setProfileBio(editBio);
                    setIsEditing(false);
                    addToast('Profile updated!', 'success');
                }}>Save</button>
                <button className="btn-cancel-action" id="btn-cancel-profile" onClick={() => setIsEditing(false)}>Cancel</button>
            </>
        )}
    </div>
    
    <div className="hero-fade">
        <div className="hero-fade-blur">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
</header>

{/* ============================================= */}
{/* DASHBOARD MAIN CONTENT                         */}
{/* ============================================= */}
<main className="dashboard-main">

    <aside className="dashboard-sidebar">
        <div className="stats-card">
            <div className="stats-card-header">
                <h3>Overview</h3>
                <span className="text-muted">Last 30 days</span>
            </div>
            <div className="stats-card-row">
                <span>Profile Views</span>
                <strong>12.4k</strong>
            </div>
            <div className="stats-card-row">
                <span>Article Reads</span>
                <strong>48.2k</strong>
            </div>
            <div className="stats-card-row">
                <span>New Followers</span>
                <div className="stat-value-group">
                    <span className="trend-positive">+12%</span>
                    <strong>3,190</strong>
                </div>
            </div>
        </div>

        <div className="sidebar-actions">
            <Link to="/add-post" className="btn-primary" style={{ textDecoration: "none" }}>
                    <span className="icon-circle">
                        <span className="dynamic-icon" style={{ WebkitMaskImage: "url('../assets/images/icons/plus.svg')", width: "20px", height: "20px" }}></span>
                    </span>
                Write a Story
            </Link>
            <button 
                className="btn-outline-dark" 
                id="btn-share-profile"
                onClick={() => setShowShareModal(true)}
            >
                <span className="dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/share.svg')", width: "20px", height: "20px" }}></span>
                Share Profile
            </button>
            <button className="btn-outline-dark" id="btn-following" onClick={() => setShowFollowingModal(true)}>
                <span className="dynamic-icon" style={{ WebkitMaskImage: "url('../assets/images/avatars/user_following.png')", width: "18px", height: "18px" }}></span>
                Following
            </button>
        </div>
    </aside>

    <section className="dashboard-content">
        <header className="content-header">
            <div className="header-titles">
                <h2>Your Stories</h2>
                <p>Curate, publish, and revisit your editorial work.</p>
            </div>
            <div className="content-tabs" ref={tabsRef}>
                <div className="active-tab-indicator" style={{ width: `${indicatorStyle.width}px`, left: `${indicatorStyle.left}px` }}></div>
                <button className={`tab-pill ${activeTab === "published" ? "active" : ""}`} onClick={() => setActiveTab("published")}>Published</button>
                <button className={`tab-pill ${activeTab === "drafts" ? "active" : ""}`} onClick={() => setActiveTab("drafts")}>Drafts</button>
                <button className={`tab-pill ${activeTab === "saved" ? "active" : ""}`} onClick={() => setActiveTab("saved")}>Saved</button>
            </div>
        
</header>

        <div className="stories-container">
            {activeTab === 'published' && (
<div id="pane-published" className="tab-pane" >
                <div className="empty-state">
                    <img src="/assets/images/icons/plus.svg" alt="Empty" style={{ width: "48px", height: "48px", opacity: "0.3", marginBottom: "16px" }} loading="lazy" />
                    <p style={{ margin: "0 0 16px 0" }}>No stories here yet</p>
                    <Link to="/add-post" className="btn-primary" style={{ height: "44px", fontSize: "0.9rem", borderRadius: "100px", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }} >Write a Story</Link>
                </div>
            </div>
            
)}
{activeTab === 'drafts' && (
<div id="pane-drafts" className="tab-pane">
                <div className="articles-grid">
                    <article className="article-card"  style={{ cursor: "pointer" }}>
                        <div className="card-image" style={{ backgroundImage: "url('../assets/images/content/001.jpg')" }}>
                            <span className="category-tag">HTML & CSS Architecture</span>
                        </div>
                        <div className="card-body">
                            <h3 className="card-title">The Evolution of Swiss Typography in Digital Interfaces</h3>
                            <time className="card-date">2 days ago</time>
                        </div>
                    </article>

                    <article className="article-card"  style={{ cursor: "pointer" }}>
                        <div className="card-image" style={{ backgroundImage: "url('../assets/images/content/002.jpg')" }}>
                            <span className="category-tag">Minimalist UI</span>
                        </div>
                        <div className="card-body">
                            <h3 className="card-title">Mastering CSS Grid: Building Complex Layouts with Ease</h3>
                            <time className="card-date">5 days ago</time>
                        </div>
                    </article>

                    <article className="article-card"  style={{ cursor: "pointer" }}>
                        <div className="card-image" style={{ backgroundImage: "url('../assets/images/content/003.jpg')" }}>
                            <span className="category-tag">Alpine Routes</span>
                        </div>
                        <div className="card-body">
                            <h3 className="card-title">Capturing the Canary Islands: A Visual Journey</h3>
                            <time className="card-date">1 week ago</time>
                        </div>
                    </article>

                    <article className="article-card"  style={{ cursor: "pointer" }}>
                        <div className="card-image" style={{ backgroundImage: "url('../assets/images/content/004.jpg')" }}>
                            <span className="category-tag">Landscape & Nature</span>
                        </div>
                        <div className="card-body">
                            <h3 className="card-title">The Evolution of Swiss Typography in Digital Interfaces</h3>
                            <time className="card-date">2 days ago</time>
                        </div>
                    </article>

                    <article className="article-card"  style={{ cursor: "pointer" }}>
                        <div className="card-image" style={{ backgroundImage: "url('../assets/images/content/005.jpg')" }}>
                            <span className="category-tag">Tech Trends</span>
                        </div>
                        <div className="card-body">
                            <h3 className="card-title">Mastering CSS Grid: Building Complex Layouts with Ease</h3>
                            <time className="card-date">5 days ago</time>
                        </div>
                    </article>

                    <article className="article-card"  style={{ cursor: "pointer" }}>
                        <div className="card-image" style={{ backgroundImage: "url('../assets/images/content/006.jpg')" }}>
                            <span className="category-tag">Artist Retrospectives</span>
                        </div>
                        <div className="card-body">
                            <h3 className="card-title">Capturing the Canary Islands: A Visual Journey</h3>
                            <time className="card-date">1 week ago</time>
                        </div>
                    </article>

                    <article className="article-card"  style={{ cursor: "pointer" }}>
                        <div className="card-image" style={{ backgroundImage: "url('../assets/images/content/007.jpg')" }}>
                            <span className="category-tag">Quick Everyday Meals</span>
                        </div>
                        <div className="card-body">
                            <h3 className="card-title">The Evolution of Swiss Typography in Digital Interfaces</h3>
                            <time className="card-date">2 days ago</time>
                        </div>
                    </article>

                    <article className="article-card"  style={{ cursor: "pointer" }}>
                        <div className="card-image" style={{ backgroundImage: "url('../assets/images/content/008.jpg')" }}>
                            <span className="category-tag">Classic & Sports Cars</span>
                        </div>
                        <div className="card-body">
                            <h3 className="card-title">Mastering CSS Grid: Building Complex Layouts with Ease</h3>
                            <time className="card-date">5 days ago</time>
                        </div>
                    </article>

                    <article className="article-card"  style={{ cursor: "pointer" }}>
                        <div className="card-image" style={{ backgroundImage: "url('../assets/images/content/009.jpg')" }}>
                            <span className="category-tag">Dystopian Fiction</span>
                        </div>
                        <div className="card-body">
                            <h3 className="card-title">Capturing the Canary Islands: A Visual Journey</h3>
                            <time className="card-date">1 week ago</time>
                        </div>
                    </article>
                </div>
            </div>
            
)}
{activeTab === 'saved' && (
<div id="pane-saved" className="tab-pane" >
                <div className="articles-grid">
                    <article className="article-card"  style={{ cursor: "pointer" }}>
                        <div className="card-image" style={{ backgroundImage: "url('../assets/images/content/mainfeed2.jpg')" }}>
                            <span className="category-tag">Action & Extreme</span>
                        </div>
                        <div className="card-body">
                            <h3 className="card-title">Conquering the Alpine Giants: A Solo Ascent</h3>
                            <time className="card-date">David Chen &middot; Saved 2 days ago</time>
                        </div>
                    </article>

                    <article className="article-card"  style={{ cursor: "pointer" }}>
                        <div className="card-image" style={{ backgroundImage: "url('../assets/images/content/mainfeed3.jpg')" }}>
                            <span className="category-tag">Design & Interfaces</span>
                        </div>
                        <div className="card-body">
                            <h3 className="card-title">Brutalist Typography: Breaking the Grid in Print</h3>
                            <time className="card-date">Sarah Jenkins &middot; Saved 1 week ago</time>
                        </div>
                    </article>

                    <article className="article-card"  style={{ cursor: "pointer" }}>
                        <div className="card-image" style={{ backgroundImage: "url('../assets/images/content/about_4.jpg')" }}>
                            <span className="category-tag">Music & Culture</span>
                        </div>
                        <div className="card-body">
                            <h3 className="card-title">The Resurrection of Analog Synths in Modern Pop</h3>
                            <time className="card-date">Marcus Frost &middot; Saved 2 weeks ago</time>
                        </div>
                    </article>
                </div>
            </div>
)}
        </div>
</section>

</main>

{showFollowingModal && (
<div id="following-modal-overlay" className="modal-overlay" onClick={(e) => { if (e.target.id === "following-modal-overlay") setShowFollowingModal(false); }}>
    <div className="modal-content following-modal">
        <div className="modal-header" style={{ gap: "16px" }}>
            <div className="modal-search" style={{ flexGrow: "1", padding: "0" }}>
                <input type="text" aria-label="Search people" placeholder="Search people..." />
            </div>
            <button className="btn-close-modal" onClick={() => setShowFollowingModal(false)} style={{ flexShrink: "0" }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"></path></svg>
            </button>
        </div>
        <div className="modal-user-list">
            <div className="user-list-item">
                <img loading="lazy" src="/assets/images/content/001.jpg" alt="Avatar" className="user-avatar" />
                <div className="user-info">
                    <span className="user-name">Sarah</span>
                    <span className="user-name">Jenkins</span>
                </div>
                <button className="btn-following-action">unfollow</button>
            </div>
            <div className="user-list-item">
                <img loading="lazy" src="/assets/images/content/002.jpg" alt="Avatar" className="user-avatar" />
                <div className="user-info">
                    <span className="user-name">Marcus</span>
                    <span className="user-name">Reed</span>
                </div>
                <button className="btn-following-action">unfollow</button>
            </div>
            <div className="user-list-item">
                <img loading="lazy" src="/assets/images/content/003.jpg" alt="Avatar" className="user-avatar" />
                <div className="user-info">
                    <span className="user-name">Elena</span>
                    <span className="user-name">Rostova</span>
                </div>
                <button className="btn-following-action">unfollow</button>
            </div>
            <div className="user-list-item">
                <img loading="lazy" src="/assets/images/content/004.jpg" alt="Avatar" className="user-avatar" />
                <div className="user-info">
                    <span className="user-name">James</span>
                    <span className="user-name">Cooper</span>
                </div>
                <button className="btn-following-action">unfollow</button>
            </div>
        </div>
    </div>
</div>
)}





{/* SHARE MODAL */}
{showShareModal && (
<div className="share-modal-overlay active" id="shareProfileModal" onClick={(e) => { if(e.target.id === 'shareProfileModal') setShowShareModal(false); }}>
    <div className="share-modal">
        <div className="share-modal__top-icon">
            <img loading="lazy" src="/assets/images/icons/link.png" alt="Link Icon" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
        </div>
        
        <button className="share-modal__close" id="closeShareModal" onClick={() => setShowShareModal(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
        
        <h3 className="share-modal__title">Share with Friends</h3>
        <p className="share-modal__subtitle">Curating is more effective when<br/>you connect with friends!</p>
        
        <div className="share-modal__section">
            <label htmlFor="shareLinkInput">Share your link</label>
            <div className="share-modal__link-box">
                <input type="text" value={window.location.href} readOnly id="shareLinkInput" />
                <button className="share-modal__copy-btn" id="copyShareLink" aria-label="Copy link" onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    addToast('Profile link copied to clipboard!', 'success');
                    setShowShareModal(false);
                }}>
                    <img loading="lazy" src="/assets/images/icons/copy.png" alt="Copy" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                </button>
            </div>
        </div>
        
        <div className="share-modal__section">
            <label>Share to</label>
            <div className="share-modal__socials">
                <a href="#" className="social-btn facebook" aria-label="Facebook">
                    <div className="social-icon">
                        <img loading="lazy" src="/assets/images/brand/Facebook - Original.png" alt="Facebook" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span>Facebook</span>
                </a>
                <a href="#" className="social-btn instagram" aria-label="Instagram">
                    <div className="social-icon">
                        <img loading="lazy" src="/assets/images/brand/instagram.png" alt="Instagram" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span>Instagram</span>
                </a>
                <a href="#" className="social-btn whatsapp" aria-label="WhatsApp">
                    <div className="social-icon">
                        <img loading="lazy" src="/assets/images/brand/whatsapp.png" alt="WhatsApp" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span>WhatsApp</span>
                </a>
                <a href="#" className="social-btn telegram" aria-label="Telegram">
                    <div className="social-icon">
                        <img loading="lazy" src="/assets/images/brand/Telegram - Original.png" alt="Telegram" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span>Telegram</span>
                </a>
                <a href="#" className="social-btn linkedin" aria-label="LinkedIn">
                    <div className="social-icon">
                        <img loading="lazy" src="/assets/images/brand/LinkedIn - Original.png" alt="LinkedIn" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span>LinkedIn</span>
                </a>
            </div>
        </div>
    </div>
</div>
)}

      <Footer />
    </div>
  );
}
