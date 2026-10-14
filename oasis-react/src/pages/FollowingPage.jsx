import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function FollowingPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const observerRef = useRef(null);

  useEffect(() => {
    const fetchFollowingPosts = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      // 1. Get IDs of users the current user is following
      const { data: follows, error: followsError } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id);

      let followedPostsList = [];
      if (!followsError && follows && follows.length > 0) {
        const followingIds = follows.map(f => f.following_id);

        // 2. Fetch the latest published posts from those users
        const { data: followedPosts, error: postsError } = await supabase
          .from('posts')
          .select('*, profiles(*)')
          .in('author_id', followingIds)
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(10); // Feed size

        if (!postsError && followedPosts) {
          followedPostsList = followedPosts;
        }
      }

      setPosts(followedPostsList);
      setLoading(false);
    };

    fetchFollowingPosts();
  }, [user]);

  useEffect(() => {
    if (loading || posts.length === 0) return;

    observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, {
        threshold: 0.5
    });

    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => observerRef.current.observe(slide));

    return () => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }
    };
  }, [loading, posts]);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="following-page">
      <Header />
      
      <main className="following-feed">
        {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#fff' }}>
                <p>Loading your feed...</p>
            </div>
        ) : !user ? (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#fff', textAlign: 'center', padding: '2rem' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Welcome to Oasis</h2>
                <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>Sign in to follow your favorite authors.</p>
                <Link to="/?auth=login" className="btn btn--primary">Log In</Link>
            </div>
        ) : posts.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#fff', textAlign: 'center', padding: '2rem' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>It's quiet here...</h2>
                <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>Follow some authors to populate your feed.</p>
                <Link to="/discover" className="btn btn--primary">Discover Authors</Link>
            </div>
        ) : (
            posts.map((post, index) => (
                <article key={post.id} className="slide">
                    <div className="slide__bg">
                        <img loading="lazy" src={post.cover_image || "/assets/images/content/modernbuildingfacade.jpg"} alt="" className="slide__bg-blur" aria-hidden="true" />
                        <img loading="lazy" src={post.cover_image || "/assets/images/content/modernbuildingfacade.jpg"} alt={post.title} className="slide__bg-image" />
                    </div>
                    <div className="slide__content">
                        <div className="slide__author">
                            <Link to={`/profile/${post.author_id}`} className="slide__author-badge">
                                {post.profiles?.avatar_url ? (
                                    <img src={post.profiles.avatar_url} alt={post.profiles.username} className="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                    <span className="avatar">{getInitials(post.profiles?.username)}</span>
                                )}
                                <div className="slide__author-info">
                                    <p>{post.profiles?.username || 'Unknown Author'}</p>
                                    <span>{post.profiles?.bio && post.profiles.bio !== 'Oasis enthusiast.' ? post.profiles.bio.substring(0, 30) : 'Author'}</span>
                                </div>
                            </Link>
                            {index === 0 && <span className="slide__new-badge">New</span>}
                        </div>

                        <h2 className="slide__title">{post.title}</h2>
                        <p className="slide__excerpt">{post.subtitle}</p>

                        <Link to={`/post/${post.id}`} className="slide__cta">Read Article</Link>
                    </div>

                    <div className="slide__scroll-hint">
                        <span>Scroll to explore</span>
                        <div className="slide__scroll-track">
                            <div className="slide__scroll-highlight"></div>
                        </div>
                    </div>
                </article>
            ))
        )}
      </main>

      <Footer />
    </div>
  );
}
