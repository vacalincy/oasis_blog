import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Header from '../components/Header';
import PostCard from '../components/PostCard';
import Footer from '../components/Footer';
import OverviewStatsCard from '../components/OverviewStatsCard';
import '../assets/css/dashboard.css'; // We reuse dashboard CSS for the hero layout
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addToast = useToast();
  const { createNotification } = useNotifications();
  
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const { user } = useAuth();
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (!id) {
        navigate('/discover');
        return;
    }

    const fetchProfileAndPosts = async () => {
      setLoading(true);

      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        let profileData = null;

        if (isUuid) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .maybeSingle();
          if (!error && data) profileData = data;
        } else {
          // If not UUID, fallback to lookup by username
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .ilike('username', id)
            .maybeSingle();
          if (!error && data) profileData = data;
        }

        if (!profileData) {
          addToast("Profile not found", "error");
          navigate('/discover');
          return;
        }

        setProfile(profileData);

        // 2. Fetch Published Posts
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .eq('author_id', profileData.id)
          .eq('status', 'published')
          .order('created_at', { ascending: false });
          
        if (postsError) {
          console.error("Posts fetch error:", postsError);
        }
        setPosts(postsData || []);

        // 3. Fetch Follows stats
        const { count: f1 } = await supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', profileData.id);
        const { count: f2 } = await supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', profileData.id);
        setFollowersCount(f1 || 0);
        setFollowingCount(f2 || 0);

        if (user) {
            const { data: followData } = await supabase.from('follows').select('*').eq('follower_id', user.id).eq('following_id', profileData.id).maybeSingle();
            if (followData) setIsFollowing(true);
        }

      } catch (err) {
        console.error(err);
        addToast("Profile not found", "error");
        navigate('/discover');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, [id, navigate, addToast, user]);

  useEffect(() => {
    if (profile?.username) {
      document.title = `${profile.username} — OASIS`;
    }
  }, [profile?.username]);

  if (loading || !profile) {
      return (
          <div className="dashboard-page">
              <Header />
              <div style={{ padding: '120px 24px', textAlign: 'center' }}>Loading...</div>
              <Footer />
          </div>
      );
  }

  const profileName = profile.username || "Unknown Author";
  const profileBio = profile.bio || "No bio available.";
  const coverImage = profile.avatar_url;
  const isOwnProfile = Boolean(user && user.id === profile.id);

  const profileUrl = `${window.location.origin}/profile/${profile.username || profile.id}`;

  const handleShareProfile = () => {
    setShowShareModal(true);
  };

  return (
    <div className="dashboard-page">
      <Header />
      
      {/* Reusing Dashboard Hero Layout */}
      <header className="dashboard-hero" style={coverImage ? { backgroundImage: `url(${coverImage})` } : { backgroundColor: '#f1f5f9' }}>
        <div className="hero-content">
            <h1 className="profile-name">{profileName}</h1>

            <div className="profile-stats">
                <div className="stat-item">
                    <span className="stat-value">{posts.length}</span>
                    <span className="stat-label">Posts</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{followersCount}</span>
                    <span className="stat-label">Followers</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{followingCount}</span>
                    <span className="stat-label">Following</span>
                </div>
            </div>
            
            <div className="bio-glass-card">
                <p className="profile-bio">{profileBio}</p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '32px', flexWrap: 'wrap' }}>
                {!isOwnProfile ? (
                    <button 
                        className="btn-glass" 
                        style={{ 
                            padding: '12px 36px', 
                            fontSize: '1rem', 
                            minWidth: '140px',
                            background: !isFollowing ? 'rgba(255, 255, 255, 0.9)' : '',
                            color: !isFollowing ? '#0f172a' : '',
                            borderColor: !isFollowing ? 'transparent' : ''
                        }} 
                        onClick={async () => {
                            if (!user) {
                                addToast("Please sign in to follow", "error");
                                return;
                            }

                            if (isFollowing) {
                                setIsFollowing(false);
                                setFollowersCount(prev => Math.max(0, prev - 1));
                                await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', profile.id);
                                addToast(`Unfollowed ${profileName}`, 'info');
                            } else {
                                setIsFollowing(true);
                                setFollowersCount(prev => prev + 1);
                                await supabase.from('follows').insert({ follower_id: user.id, following_id: profile.id });
                                addToast(`Followed ${profileName}!`, 'success');
                                createNotification({
                                    userId: profile.id,
                                    actorId: user.id,
                                    type: 'follower'
                                });
                            }
                        }}
                    >
                        {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                ) : (
                    <>
                        <Link 
                            to="/dashboard" 
                            className="btn-glass" 
                            style={{ 
                                padding: '12px 32px', 
                                fontSize: '1rem', 
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <img loading="lazy" src="/assets/images/icons/editprofile_icon.svg" style={{ width: '16px', height: '16px' }} alt="" />
                            Edit Profile
                        </Link>

                        <button 
                            className="btn-glass" 
                            onClick={handleShareProfile}
                            style={{ 
                                padding: '12px 28px', 
                                fontSize: '1rem', 
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer'
                            }}
                            aria-label="Share Profile"
                        >
                            <span className="dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/share.svg')", maskImage: "url('/assets/images/icons/share.svg')", width: "16px", height: "16px" }}></span>
                            Share Profile
                        </button>
                    </>
                )}
            </div>
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

      {/* 30-Day Monthly Activity Overview (Only visible to profile owner) */}
      {isOwnProfile && (
        <section className="profile-overview-section" style={{ marginTop: '48px', padding: '0 20px' }}>
          <div className="container" style={{ maxWidth: '480px', margin: '0 auto' }}>
            <OverviewStatsCard targetUserId={profile.id} />
          </div>
        </section>
      )}

      <section className="latest-posts-section" style={{ marginTop: '56px', marginBottom: '96px' }}>
        <div className="container">
            <h2 className="author-posts__title" style={{ fontSize: '2.5rem', marginBottom: '40px', color: 'var(--color-text)' }}>Latest from {profileName}</h2>
            
            {posts.length === 0 ? (
                <div className="empty-state" style={{ textAlign: 'center', padding: '64px' }}>
                    <p style={{ fontSize: '1.2rem', color: 'var(--color-text-light)' }}>No published stories yet</p>
                </div>
            ) : (
                <div className="posts-grid posts-grid--3col">
                    {posts.map(post => (
                        <PostCard 
                            key={post.id}
                            title={post.title || "Untitled Story"}
                            image={post.cover_image || "/assets/images/content/default.jpg"}
                            category={post.category?.split(' - ')[0] || "Story"}
                            author={profileName}
                            date={new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            isoDate={post.created_at}
                            link={`/post/${post.id}`}
                        />
                    ))}
                </div>
            )}
        </div>
      </section>

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
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Check out this profile on Oasis: ' + profileUrl)}`} 
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
                            href={`https://t.me/share/url?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent('Check out this profile on Oasis!')}`} 
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
                                    title: `${profileName} on Oasis`,
                                    text: profileBio || `Check out ${profileName}'s profile on Oasis!`,
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
