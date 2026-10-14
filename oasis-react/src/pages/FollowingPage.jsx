import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';

export default function FollowingPage() {
  const { user } = useAuth();
  const addToast = useToast();
  const { createNotification } = useNotifications();

  const [posts, setPosts] = useState([]);
  const [suggestedAuthors, setSuggestedAuthors] = useState([]);
  const [followingAuthorIds, setFollowingAuthorIds] = useState(new Set());
  const [hasFollowedAnyNew, setHasFollowedAnyNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const observerRef = useRef(null);

  const fetchFollowingPosts = useCallback(async () => {
    setLoading(true);
    setHasFollowedAnyNew(false);

    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // 1. Get IDs of users the current user is following
      const { data: follows, error: followsError } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id);

      const followingIds = (!followsError && follows) ? follows.map(f => f.following_id) : [];
      setFollowingAuthorIds(new Set(followingIds));

      let followedPostsList = [];
      if (followingIds.length > 0) {
        // 2. Fetch the latest published posts from those users
        const { data: followedPosts, error: postsError } = await supabase
          .from('posts')
          .select('*, profiles(*)')
          .in('author_id', followingIds)
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(10);

        if (!postsError && followedPosts) {
          followedPostsList = followedPosts;
        }
      }

      // If feed has no posts, fetch suggested creators to follow
      if (followedPostsList.length === 0) {
        let authorsQuery = supabase
          .from('profiles')
          .select('id, username, avatar_url, bio');

        if (user?.id) {
          authorsQuery = authorsQuery.neq('id', user.id);
        }

        const { data: authors } = await authorsQuery.limit(6);
        if (authors) {
          setSuggestedAuthors(authors);
        }
      }

      setPosts(followedPostsList);
    } catch (err) {
      console.error('Error fetching following feed:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFollowingPosts();
  }, [fetchFollowingPosts]);

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

  const handleToggleFollow = async (authorId, authorName) => {
    if (!user) {
      addToast('Please log in to follow creators', 'info');
      return;
    }

    const isCurrentlyFollowing = followingAuthorIds.has(authorId);

    setFollowingAuthorIds(prev => {
      const next = new Set(prev);
      if (isCurrentlyFollowing) {
        next.delete(authorId);
      } else {
        next.add(authorId);
      }
      return next;
    });

    try {
      if (isCurrentlyFollowing) {
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', authorId);
        addToast(`Unfollowed ${authorName || 'creator'}`, 'info');
      } else {
        await supabase
          .from('follows')
          .insert({ follower_id: user.id, following_id: authorId });
        addToast(`Followed ${authorName || 'creator'}!`, 'success');
        setHasFollowedAnyNew(true);

        createNotification({
          userId: authorId,
          actorId: user.id,
          type: 'follower'
        });
      }
    } catch (err) {
      console.error('Follow toggle error:', err);
      addToast('Could not update follow status', 'error');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const isEmpty = !loading && posts.length === 0;

  return (
    <div className={`following-page ${isEmpty ? 'following-page--empty' : ''}`}>
      <Header />

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: '#64748b', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid rgba(28, 43, 237, 0.15)', borderTopColor: 'var(--color-primary)', animation: 'spin 0.8s linear infinite' }}></div>
          <p style={{ fontWeight: 500 }}>Loading your feed...</p>
        </div>
      ) : !user ? (
        <section className="following-hero">
          <div className="following-hero__glow"></div>
          <div className="container following-hero__container">
            <div className="following-hero__icon-wrap">
              <div className="following-hero__icon-circle">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
            </div>
            <span className="following-hero__badge">Curated Following Feed</span>
            <h1 className="following-hero__title">Welcome to Oasis</h1>
            <p className="following-hero__desc">Sign in or create an account to follow your favorite writers and build your customized visual story stream.</p>
            <div className="following-hero__actions">
              <Link to="/?auth=login" className="following-hero__btn-primary">
                <span>Log In</span>
              </Link>
              <Link to="/discover" className="following-hero__btn-secondary">
                Explore as Guest
              </Link>
            </div>
          </div>
        </section>
      ) : posts.length === 0 ? (
        <main className="following-empty-layout">
          {/* Hero Banner */}
          <section className="following-hero">
            <div className="following-hero__glow"></div>
            <div className="container following-hero__container">
              <div className="following-hero__icon-wrap">
                <div className="following-hero__icon-circle">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div className="following-hero__sparkle">✦</div>
              </div>

              <span className="following-hero__badge">Your Reading Sanctuary</span>
              <h1 className="following-hero__title">It's quiet here... for now.</h1>
              <p className="following-hero__desc">
                Follow writers, curators, and photographers to build an immersive visual stream tailored to your curiosity.
              </p>

              <div className="following-hero__actions">
                <Link to="/discover" className="following-hero__btn-primary">
                  <span>Explore Stories</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
                <Link to="/topics" className="following-hero__btn-secondary">
                  Browse Topics
                </Link>
              </div>
            </div>
          </section>

          {/* Recommended Creators */}
          <section className="following-creators">
            <div className="container">
              <div className="following-creators__header">
                <div>
                  <span className="following-creators__tag">Discover Voices</span>
                  <h2 className="following-creators__title">Recommended Creators</h2>
                </div>
                <Link to="/discover" className="following-creators__explore-link">
                  View all in Discover <span aria-hidden="true">→</span>
                </Link>
              </div>

              {suggestedAuthors.length > 0 ? (
                <div className="following-creators__grid">
                  {suggestedAuthors.map(author => {
                    const isFollowingThisAuthor = followingAuthorIds.has(author.id);
                    return (
                      <div key={author.id} className="creator-card">
                        <Link to={`/profile/${author.username || author.id}`} className="creator-card__header">
                          {author.avatar_url ? (
                            <img src={author.avatar_url} alt={author.username} className="creator-card__avatar" />
                          ) : (
                            <div className="creator-card__avatar-fallback">
                              {getInitials(author.username)}
                            </div>
                          )}
                          <div className="creator-card__info">
                            <h3 className="creator-card__name">{author.username || 'Creator'}</h3>
                            <span className="creator-card__role">
                              {author.bio && author.bio !== 'Oasis enthusiast.' ? author.bio : 'Writer & Contributor'}
                            </span>
                          </div>
                        </Link>

                        <p className="creator-card__bio">
                          {author.bio || 'Exploring new perspectives in design, modern culture, and storytelling.'}
                        </p>

                        <div className="creator-card__footer">
                          <button
                            className={`creator-card__follow-btn ${isFollowingThisAuthor ? 'is-following' : ''}`}
                            onClick={() => handleToggleFollow(author.id, author.username)}
                          >
                            {isFollowingThisAuthor ? (
                              <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                Following
                              </>
                            ) : (
                              <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="12" y1="5" x2="12" y2="19"></line>
                                  <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Follow
                              </>
                            )}
                          </button>
                          <Link to={`/profile/${author.username || author.id}`} className="creator-card__view-profile">
                            View Profile
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '1rem' }}>Browse our curated stories to discover inspiring authors.</p>
                  <Link to="/discover" className="following-hero__btn-primary">
                    Go to Discover
                  </Link>
                </div>
              )}

              {hasFollowedAnyNew && (
                <div className="following-creators__refresh-bar">
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>You followed new creators! Click to load their stories into your feed.</span>
                  <button onClick={fetchFollowingPosts} className="btn-primary" style={{ padding: '8px 22px', fontSize: '0.9rem', cursor: 'pointer' }}>
                    Load Feed
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Topics Quick-Start */}
          <section className="following-topics">
            <div className="container">
              <div className="following-topics__card">
                <div className="following-topics__content">
                  <h3 className="following-topics__title">Explore Topics</h3>
                  <p className="following-topics__desc">Jump into curated categories to find articles and authors that match your interests.</p>
                </div>
                <div className="following-topics__pills">
                  {['Architecture', 'Minimalist Design', 'Photography', 'Culture & Society', 'Technology', 'Travel & Outdoors'].map(cat => (
                    <Link key={cat} to="/topics" className="following-topics__pill">
                      #{cat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      ) : (
        <main className="following-feed">
          {posts.map((post, index) => (
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
          ))}
        </main>
      )}

      {/* Footer is rendered for the empty state or when bottom of feed is reached */}
      <Footer />
    </div>
  );
}
