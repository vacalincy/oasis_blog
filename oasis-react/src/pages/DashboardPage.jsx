import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../assets/css/dashboard.css'; // Direct import
import { useToast } from '../context/ToastContext';
import { resizeImage } from '../utils/imageUtils';

export default function DashboardPage() {
  const addToast = useToast();
  const navigate = useNavigate();
  const { profile, user, fetchProfile } = useAuth();
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
        if (!user) return;
        
        // Fetch authored posts
        const { data } = await supabase
            .from('posts')
            .select('*')
            .eq('author_id', user.id)
            .order('created_at', { ascending: false });
        
        if (data) setPosts(data);
        
        // Fetch saved posts
        const { data: savedData } = await supabase
            .from('saved_posts')
            .select('posts(*)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
            
        if (savedData) {
            setSavedPosts(savedData.map(s => s.posts).filter(p => p !== null));
        }
    };
    fetchPosts();
  }, [user]);
  
  const publishedPosts = posts.filter(p => p.status === 'published');
  const draftPosts = posts.filter(p => p.status === 'draft');

  const [isEditing, setIsEditing] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [activeTab, setActiveTab] = useState("published");
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [preparedCoverFile, setPreparedCoverFile] = useState(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [followingProfiles, setFollowingProfiles] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);


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

        // Fetch Follows
        const fetchFollows = async () => {
            const { data } = await supabase.from('follows').select('following_id, profiles!follows_following_id_fkey(id, username, avatar_url)').eq('follower_id', profile.id);
            if (data) {
                setFollowingProfiles(data.map(d => d.profiles));
            }
            const { count } = await supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', profile.id);
            setFollowersCount(count || 0);
        };
        fetchFollows();

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
  
  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
        setCoverFile(file);
        setCoverImage(URL.createObjectURL(file));
        try {
            // Pre-optimize in background to crisp 2560px Retina at 0.90 quality (~400KB)
            const opt = await resizeImage(file, 2560, 2560, 0.90);
            setPreparedCoverFile(opt);
        } catch {
            setPreparedCoverFile(file);
        }
    }
  };

  useEffect(() => {
    if (showFollowingModal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [showFollowingModal]);

  const profileUrl = `${window.location.origin}/profile/${profile?.username || user?.id}`;

  const handleShareProfile = () => {
    setShowShareModal(true);
  };

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
                <span className="stat-value">{publishedPosts.length}</span>
                <span className="stat-label">Posts</span>
            </div>
            <div className="stat-item">
                <span className="stat-value">{followersCount}</span>
                <span className="stat-label">Followers</span>
            </div>
            <div className="stat-item">
                <span className="stat-value">{followingProfiles.length}</span>
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
                <button className="btn-glass" id="btn-save-profile" disabled={isSavingProfile} onClick={async () => {
                    if (!user) return;
                    setIsSavingProfile(true);
                    try {
                        let uploadedUrl = coverImage;
                        if (coverFile) {
                            let fileToUpload = preparedCoverFile;
                            if (!fileToUpload) {
                                fileToUpload = await resizeImage(coverFile, 2560, 2560, 0.90);
                            }
                            const fileName = `${user.id}-${Date.now()}.jpg`;
                            const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, fileToUpload, {
                                contentType: 'image/jpeg',
                                upsert: true
                            });
                            if (uploadError) {
                                addToast('Error uploading photo: ' + uploadError.message, 'error');
                                setIsSavingProfile(false);
                                return;
                            }
                            const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
                            uploadedUrl = data.publicUrl;
                        }
                        
                        const { error } = await supabase.from('profiles').update({
                            username: editName,
                            bio: editBio,
                            avatar_url: uploadedUrl
                        }).eq('id', user.id);
                        
                        if (error) {
                            addToast('Error saving profile: ' + error.message, 'error');
                            setIsSavingProfile(false);
                            return;
                        }
                        
                        setProfileName(editName);
                        setProfileBio(editBio);
                        setCoverImage(uploadedUrl);
                        setCoverFile(null);
                        setPreparedCoverFile(null);
                        setIsEditing(false);

                        // Update localStorage profile cache immediately
                        try {
                            const updatedProfile = {
                                ...(profile || {}),
                                id: user.id,
                                username: editName,
                                bio: editBio,
                                avatar_url: uploadedUrl
                            };
                            localStorage.setItem('oasis_cached_profile', JSON.stringify(updatedProfile));
                        } catch (e) {}

                        if (fetchProfile && user?.id) {
                            fetchProfile(user.id);
                        }
                        addToast('Profile updated successfully!', 'success');
                    } catch (err) {
                        addToast('Error saving profile: ' + err.message, 'error');
                    } finally {
                        setIsSavingProfile(false);
                    }
                }}>{isSavingProfile ? 'Saving...' : 'Save'}</button>
                <button className="btn-glass" id="btn-cancel-profile" onClick={() => {
                    setIsEditing(false);
                    setEditName(profileName);
                    setEditBio(profileBio);
                    setCoverFile(null);
                    setPreparedCoverFile(null);
                    setCoverImage(profile?.avatar_url || null);
                }}>Cancel</button>
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
                <span className="text-muted">Activity</span>
            </div>
            <div className="stats-card-row">
                <span>Published Stories</span>
                <strong>{publishedPosts.length}</strong>
            </div>
            <div className="stats-card-row">
                <span>Saved Stories</span>
                <strong>{savedPosts.length}</strong>
            </div>
            <div className="stats-card-row">
                <span>Followers</span>
                <div className="stat-value-group">
                    <strong>{followersCount}</strong>
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
                onClick={handleShareProfile}
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
                <div id="pane-published" className="tab-pane active" >
                    {publishedPosts.length === 0 ? (
                        <div className="empty-state">
                            <p style={{ margin: "0 0 16px 0" }}>No published stories here yet</p>
                            <Link to="/add-post" className="btn-primary" style={{ height: "44px", fontSize: "0.9rem", borderRadius: "100px", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }} >Write a Story</Link>
                        </div>
                    ) : (
                        <div className="articles-grid">
                            {publishedPosts.map(post => (
                                <article key={post.id} className="article-card" style={{ cursor: "pointer" }} onClick={() => navigate(`/post/${post.id}`)}>
                                    <div className="card-image" style={{ backgroundImage: `url('${post.cover_image}')` }}>
                                        <span className="category-tag">{post.category?.split(' - ')[0] || 'Story'}</span>
                                    </div>
                                    <div className="card-body">
                                        <h3 className="card-title">{post.title || 'Untitled Story'}</h3>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 'auto' }}>
                                            <time className="card-date">{new Date(post.created_at).toLocaleDateString()}</time>
                                            <button 
                                                className="btn-primary" 
                                                style={{ padding: '6px 16px', fontSize: '0.85rem', borderRadius: '100px', zIndex: 2, border: 'none', height: 'auto', minHeight: '32px', width: 'auto' }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/edit-post/${post.id}`);
                                                }}
                                            >Edit</button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'drafts' && (
                <div id="pane-drafts" className="tab-pane active">
                    {draftPosts.length === 0 ? (
                        <div className="empty-state">
                            <p style={{ margin: "0 0 16px 0" }}>No drafts here yet</p>
                            <Link to="/add-post" className="btn-primary" style={{ height: "44px", fontSize: "0.9rem", borderRadius: "100px", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }} >Write a Story</Link>
                        </div>
                    ) : (
                        <div className="articles-grid">
                            {draftPosts.map(post => (
                                <article key={post.id} className="article-card" style={{ cursor: "pointer" }} onClick={() => navigate(`/edit-post/${post.id}`)}>
                                    <div className="card-image" style={{ backgroundImage: `url('${post.cover_image}')` }}>
                                        <span className="category-tag">{post.category?.split(' - ')[0] || 'Draft'}</span>
                                    </div>
                                    <div className="card-body">
                                        <h3 className="card-title">{post.title || 'Untitled Draft'}</h3>
                                        <time className="card-date">{new Date(post.created_at).toLocaleDateString()}</time>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'saved' && (
                <div id="pane-saved" className="tab-pane active" >
                    {savedPosts.length === 0 ? (
                        <div className="empty-state">
                            <p style={{ margin: "0 0 16px 0" }}>No saved stories yet</p>
                        </div>
                    ) : (
                        <div className="articles-grid">
                            {savedPosts.map(post => (
                                <article key={post.id} className="article-card" style={{ cursor: "pointer" }} onClick={() => navigate(`/post/${post.id}`)}>
                                    <div className="card-image" style={{ backgroundImage: `url('${post.cover_image}')` }}>
                                        <span className="category-tag">{post.category?.split(' - ')[0] || 'Story'}</span>
                                    </div>
                                    <div className="card-body">
                                        <h3 className="card-title">{post.title || 'Untitled Story'}</h3>
                                        <time className="card-date">{new Date(post.created_at).toLocaleDateString()}</time>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
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
            {followingProfiles.length === 0 ? <p style={{textAlign: 'center', padding: '20px'}}>You aren't following anyone yet.</p> : followingProfiles.map(fp => (
                <div className="user-list-item" key={fp.id}>
                    <img 
                        decoding="async" 
                        src={fp.avatar_url || "/assets/images/icons/avatar.svg"} 
                        alt="Avatar" 
                        className="user-avatar" 
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/assets/images/icons/avatar.svg'; }}
                        style={{ objectFit: 'cover', aspectRatio: '1 / 1' }} 
                    />
                    <div className="user-info">
                        <Link to={`/profile/${fp.id}`} className="user-name" onClick={() => setShowFollowingModal(false)} style={{textDecoration: 'none', color: 'inherit'}}>{fp.username}</Link>
                    </div>
                    <button className="btn-following-action" onClick={async () => {
                        await supabase.from('follows').delete().eq('follower_id', profile.id).eq('following_id', fp.id);
                        setFollowingProfiles(prev => prev.filter(p => p.id !== fp.id));
                    }}>unfollow</button>
                </div>
            ))}
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
                <input type="text" value={profileUrl} readOnly id="shareLinkInput" />
                <button className="share-modal__copy-btn" id="copyShareLink" aria-label="Copy link" onClick={() => {
                    navigator.clipboard.writeText(profileUrl);
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
                <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-btn facebook" 
                    aria-label="Facebook"
                >
                    <div className="social-icon">
                        <img loading="lazy" src="/assets/images/brand/Facebook - Original.png" alt="Facebook" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span>Facebook</span>
                </a>
                <a 
                    href="https://www.instagram.com/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-btn instagram" 
                    aria-label="Instagram"
                    onClick={() => {
                        navigator.clipboard.writeText(profileUrl);
                        addToast('Profile link copied! Paste it in Instagram.', 'info');
                    }}
                >
                    <div className="social-icon">
                        <img loading="lazy" src="/assets/images/brand/instagram.png" alt="Instagram" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span>Instagram</span>
                </a>
                <a 
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Check out my profile on Oasis: ' + profileUrl)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-btn whatsapp" 
                    aria-label="WhatsApp"
                >
                    <div className="social-icon">
                        <img loading="lazy" src="/assets/images/brand/whatsapp.png" alt="WhatsApp" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span>WhatsApp</span>
                </a>
                <a 
                    href={`https://t.me/share/url?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent('Check out my profile on Oasis!')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-btn telegram" 
                    aria-label="Telegram"
                >
                    <div className="social-icon">
                        <img loading="lazy" src="/assets/images/brand/Telegram - Original.png" alt="Telegram" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span>Telegram</span>
                </a>
                <a 
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-btn linkedin" 
                    aria-label="LinkedIn"
                >
                    <div className="social-icon">
                        <img loading="lazy" src="/assets/images/brand/LinkedIn - Original.png" alt="LinkedIn" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span>LinkedIn</span>
                </a>
            </div>
        </div>
        {typeof navigator !== 'undefined' && navigator.share && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button 
                    type="button"
                    onClick={() => {
                        navigator.share({
                            title: `${profileName || 'My Profile'} on Oasis`,
                            text: profileBio || `Check out my profile on Oasis!`,
                            url: profileUrl
                        }).catch(() => {});
                    }}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-primary)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                    More sharing options...
                </button>
            </div>
        )}
    </div>
</div>
)}

      <Footer />
    </div>
  );
}
