import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Header from '../components/Header';
import PostCard from '../components/PostCard';
import Footer from '../components/Footer';
import '../assets/css/dashboard.css'; // We reuse dashboard CSS for the hero layout
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addToast = useToast();
  
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const { user } = useAuth();
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    if (!id) {
        // If no ID provided, we can't show a profile. 
        // A better approach would be to check if logged in and redirect to dashboard, but let's just go to discover.
        navigate('/discover');
        return;
    }

    const fetchProfileAndPosts = async () => {
      setLoading(true);
      try {
        // 1. Fetch Profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();
          
        if (profileError) throw profileError;
        setProfile(profileData);

        // 2. Fetch Published Posts
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .eq('author_id', id)
          .eq('status', 'published')
          .order('created_at', { ascending: false });
          
        
        if (postsError) throw postsError;
        setPosts(postsData || []);

        // 3. Fetch Follows stats
        const { count: f1 } = await supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', id);
        const { count: f2 } = await supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', id);
        setFollowersCount(f1 || 0);
        setFollowingCount(f2 || 0);

        if (user) {
            const { data: followData } = await supabase.from('follows').select('*').eq('follower_id', user.id).eq('following_id', id).single();
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
            
            {user?.id !== profile.id && (<div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
                <button 
                    className="btn-glass" 
                    style={{ 
                        padding: '12px 40px', 
                        fontSize: '1.05rem', 
                        width: '160px',
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
                            setFollowersCount(prev => prev - 1);
                            await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', profile.id);
                            addToast(`Unfollowed ${profileName}`, 'info');
                        } else {
                            setIsFollowing(true);
                            setFollowersCount(prev => prev + 1);
                            await supabase.from('follows').insert({ follower_id: user.id, following_id: profile.id });
                            addToast(`Followed ${profileName}!`, 'success');
                        }
                    }}
                >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
            </div>)}
        </div>
      </header>

      <section className="latest-posts-section" style={{ marginTop: '64px', marginBottom: '96px' }}>
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

      <Footer />
    </div>
  );
}
