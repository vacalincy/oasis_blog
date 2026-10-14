import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SplitText from '../components/SplitText';
import { supabase } from '../supabaseClient';
import { CATEGORIES } from '../constants/categories';

export default function PopularPage() {
  const CACHE_KEY = 'oasis_popular_posts_cache';
  const CACHE_LIKES = 'oasis_popular_likes_cache';

  const [posts, setPosts] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [likesMap, setLikesMap] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_LIKES);
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  });
  const [commentsMap, setCommentsMap] = useState({});
  const [loading, setLoading] = useState(() => {
    try {
      return !localStorage.getItem(CACHE_KEY);
    } catch {
      return true;
    }
  });
  const [activeFilter, setActiveFilter] = useState('week'); // 'week' | 'month' | 'all'
  const [openDiscussion, setOpenDiscussion] = useState(0);

  // Helper to extract clean plain text excerpt
  const getExcerpt = (post, length = 120) => {
    if (post.subtitle) return post.subtitle;
    if (post.content) {
      const plain = post.content.replace(/<[^>]*>?/gm, '').trim();
      return plain.length > length ? plain.slice(0, length) + '...' : plain;
    }
    return 'Read this popular story and explore deep perspectives on OASIS.';
  };

  // Helper to find category slug
  const getCategorySlug = (categoryString) => {
    if (!categoryString) return 'design-interfaces';
    const main = categoryString.split(' - ')[0].trim().toLowerCase();
    const found = CATEGORIES.find(c =>
      c.name.toLowerCase() === main ||
      c.slug.toLowerCase() === main ||
      (c.aliases && c.aliases.some(a => a.toLowerCase() === main))
    );
    return found ? found.slug : 'design-interfaces';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Fetch published posts, likes, and comments from Supabase
  useEffect(() => {
    const fetchPopularData = async () => {
      setLoading(true);
      try {
        // 1. Fetch published posts with author profile
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('id, author_id, title, subtitle, content, category, cover_image, status, created_at, profiles(id, username, avatar_url)')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (postsError) throw postsError;

        // 2. Fetch likes to aggregate popularity
        const { data: likesData } = await supabase
          .from('likes')
          .select('post_id, created_at');

        const lMap = {};
        if (likesData) {
          likesData.forEach(l => {
            lMap[l.post_id] = (lMap[l.post_id] || 0) + 1;
          });
        }
        setLikesMap(lMap);

        // 3. Fetch comments to aggregate discussion activity
        const { data: commentsData } = await supabase
          .from('comments')
          .select('id, post_id, text, created_at');

        const cMap = {};
        if (commentsData) {
          commentsData.forEach(c => {
            cMap[c.post_id] = (cMap[c.post_id] || 0) + 1;
          });
        }
        setCommentsMap(cMap);

        if (postsData) {
          setPosts(postsData);
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(postsData));
            localStorage.setItem(CACHE_LIKES, JSON.stringify(lMap));
          } catch { }
        }
      } catch (err) {
        console.warn('Error fetching popular posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularData();
  }, []);

  // Sort all posts by likes descending
  const sortedByLikes = useMemo(() => {
    return [...posts].sort((a, b) => {
      const likesA = likesMap[a.id] || 0;
      const likesB = likesMap[b.id] || 0;
      if (likesB !== likesA) return likesB - likesA;
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }, [posts, likesMap]);

  // 1. Popular Picks: top 3 most-liked stories
  const popularPicks = useMemo(() => {
    return sortedByLikes.slice(0, 3);
  }, [sortedByLikes]);

  // 2. Trending: filtered by time period (week / month / all)
  const trendingList = useMemo(() => {
    const now = Date.now();
    let filtered = sortedByLikes;

    if (activeFilter === 'week') {
      const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
      const weekPosts = sortedByLikes.filter(p => new Date(p.created_at).getTime() >= oneWeekAgo);
      if (weekPosts.length > 0) filtered = weekPosts;
    } else if (activeFilter === 'month') {
      const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;
      const monthPosts = sortedByLikes.filter(p => new Date(p.created_at).getTime() >= oneMonthAgo);
      if (monthPosts.length > 0) filtered = monthPosts;
    }

    return filtered.slice(0, 5);
  }, [sortedByLikes, activeFilter]);

  // 3. Classics: two top-rated long-form stories
  const classicsPosts = useMemo(() => {
    if (sortedByLikes.length >= 2) {
      return [sortedByLikes[0], sortedByLikes[1]];
    }
    return sortedByLikes;
  }, [sortedByLikes]);

  // 4. Hot Discussions: posts with the most comments
  const hotDiscussions = useMemo(() => {
    const withComments = [...posts].sort((a, b) => {
      const cA = commentsMap[a.id] || 0;
      const cB = commentsMap[b.id] || 0;
      if (cB !== cA) return cB - cA;
      return (likesMap[b.id] || 0) - (likesMap[a.id] || 0);
    });
    return withComments.slice(0, 4);
  }, [posts, commentsMap, likesMap]);

  return (
    <div className="popular-page">
      <Header />

      {/* SECTION 1: HERO */}
      <section className="popular-hero">
        <h1 className="popular-hero__title">
          <SplitText text="Timeless Reads And Current Trends." />
        </h1>
      </section>

      {/* SECTION 1.5: POPULAR PICKS (3-card grid) */}
      <section className="popular-picks">
        <div className="container popular-picks__grid">
          {loading && popularPicks.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', minHeight: '380px' }}></div>
          ) : popularPicks.length > 0 ? (
            popularPicks.map((pick, idx) => (
              <article
                key={pick.id}
                className="pick-card"
                style={{ animationDelay: `${0.15 + idx * 0.18}s` }}
              >
                <Link to={`/post/${pick.id}`} className="pick-card__image">
                  <img
                    loading="lazy"
                    src={pick.cover_image || '/assets/images/content/dunes.jpg'}
                    alt={pick.title}
                  />
                </Link>
                <div className="pick-card__overlay">
                  <span className="pick-card__badge">
                    {pick.category?.split(' - ')[0] || 'Popular'}
                  </span>
                  <h3 className="pick-card__title">
                    <Link to={`/post/${pick.id}`}>{pick.title}</Link>
                  </h3>
                  <div className="pick-card__footer">
                    <p className="pick-card__excerpt">{getExcerpt(pick, 95)}</p>
                    <Link to={`/post/${pick.id}`} className="pick-card__arrow" aria-label="Read article">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 0', color: 'var(--color-text-secondary)' }}>
              <p>No published stories yet. Be the first to publish a popular story!</p>
              <Link to="/add-post" className="btn btn--primary" style={{ marginTop: '16px', display: 'inline-block' }}>Write a Story</Link>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 2: TRENDING */}
      <section className="trending">
        <div className="trending__bar">
          <span className="trending__label">
            Trending {activeFilter === 'week' ? 'This Week' : activeFilter === 'month' ? 'This Month' : 'All Time'}
          </span>
          <div className="trending__filters">
            <button
              type="button"
              className={`trending__filter-btn ${activeFilter === 'week' ? 'active' : ''}`}
              onClick={() => setActiveFilter('week')}
            >
              This Week
            </button>
            <button
              type="button"
              className={`trending__filter-btn ${activeFilter === 'month' ? 'active' : ''}`}
              onClick={() => setActiveFilter('month')}
            >
              This Month
            </button>
            <button
              type="button"
              className={`trending__filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Time
            </button>
          </div>
        </div>

        <ul className="trending__list">
          {loading ? (
            <li className="trending__item" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <span>Loading trending stories...</span>
            </li>
          ) : trendingList.length > 0 ? (
            trendingList.map((post, idx) => (
              <li key={post.id} className="trending__item">
                <span className="trending__number">{String(idx + 1).padStart(2, '0')}</span>
                <Link to={`/post/${post.id}`} className="trending__title">
                  {post.title}
                </Link>
              </li>
            ))
          ) : (
            <li className="trending__item" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <span>No trending stories found in this period.</span>
            </li>
          )}
        </ul>
      </section>

      {/* SECTION 3: ALL-TIME CLASSICS */}
      <section className="classics">
        <div className="classics__header">
          <h2 className="classics__title">
            All-Time <br />Classics
          </h2>
        </div>

        {/* row 1 — image left, text right */}
        <article className="classics__row">
          <div className="classics__image">
            <Link to="/category?cat=music-culture">
              <img
                loading="lazy"
                src="/assets/images/content/concert_box.jpg"
                alt="Crowd at a concert with stage lights"
              />
            </Link>
          </div>
          <div className="classics__content">
            <Link to="/category?cat=music-culture" className="classics__badge">
              Music
            </Link>
            <h3 className="classics__row-title">
              <Link to="/category?cat=music-culture" className="classics__title-link">
                The Evolution of Progressive Rock: Pink Floyd &amp; Led Zeppelin
              </Link>
            </h3>
            <p className="classics__excerpt">
              How two bands stretched the three-minute single into sprawling, cinematic suites — and quietly rewrote the rules of the album.
            </p>
            <div className="classics__meta">
              <Link to="/discover" className="classics__author">Jane Doe</Link>
              <span>·</span>
              <time dateTime="2023-10-12">Oct 12, 2023</time>
            </div>
            <Link to="/category?cat=music-culture" className="classics__link">
              Read Article ↗
            </Link>
          </div>
        </article>

        {/* row 2 — text left, image right */}
        <article className="classics__row classics__row--reverse">
          <div className="classics__content">
            <Link to="/category?cat=code-development" className="classics__badge">
              Technology
            </Link>
            <h3 className="classics__row-title">
              <Link to="/category?cat=code-development" className="classics__title-link">
                Mastering CSS Grid &amp; Flexbox Layouts
              </Link>
            </h3>
            <p className="classics__excerpt">
              A practical field guide to comparing resilient, two-dimensional layouts — when to reach for grid, when flexbox wins, and how to set them cooperate.
            </p>
            <div className="classics__meta">
              <Link to="/discover" className="classics__author">Jane Doe</Link>
              <span>·</span>
              <time dateTime="2023-10-12">Oct 12, 2023</time>
            </div>
            <Link to="/category?cat=code-development" className="classics__link">
              Read Article ↗
            </Link>
          </div>
          <div className="classics__image">
            <Link to="/category?cat=code-development">
              <img
                loading="lazy"
                src="/assets/images/content/select_box.jpg"
                alt="Modern building facade"
              />
            </Link>
          </div>
        </article>
      </section>

      {/* SECTION 4: HOT DISCUSSIONS */}
      {hotDiscussions.length > 0 && (
        <section className="discussions">
          <h2 className="discussions__title">Hot Discussions</h2>

          {hotDiscussions.map((post, idx) => {
            const commentCount = commentsMap[post.id] || 0;
            const isOpen = openDiscussion === idx;

            return (
              <div key={post.id} className="discussions__item">
                <div
                  className="discussions__row"
                  role="button"
                  tabIndex={0}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setOpenDiscussion(isOpen ? -1 : idx)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setOpenDiscussion(isOpen ? -1 : idx);
                    }
                  }}
                >
                  <Link
                    to={`/post/${post.id}`}
                    className="discussions__title-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {post.title}
                  </Link>
                  <button
                    type="button"
                    className="discussions__toggle-btn"
                    aria-label="Toggle discussion"
                    tabIndex={-1}
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease',
                      border: 'none',
                      background: 'none',
                      outline: 'none',
                      boxShadow: 'none'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDiscussion(isOpen ? -1 : idx);
                    }}
                  ></button>
                </div>

                {isOpen && (
                  <div className="discussions__body" style={{ display: 'block', animation: 'hero-fade-in 0.2s ease' }}>
                    <p className="discussions__text">{getExcerpt(post, 240)}</p>
                    {post.cover_image && (
                      <Link to={`/post/${post.id}`}>
                        <img
                          loading="lazy"
                          src={post.cover_image}
                          alt={post.title}
                          className="discussions__image"
                        />
                      </Link>
                    )}
                    <div style={{ marginTop: '16px' }}>
                      <Link
                        to={`/post/${post.id}`}
                        style={{
                          color: 'var(--color-primary)',
                          fontWeight: 600,
                          fontSize: '0.92rem',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        Join discussion {commentCount > 0 ? `(${commentCount} responses)` : ''} →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}

      <Footer />
    </div>
  );
}
