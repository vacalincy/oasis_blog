import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import { supabase } from '../supabaseClient';
import { CATEGORIES } from '../constants/categories';



export default function DiscoverPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filterScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const checkScrollPosition = useCallback(() => {
    const el = filterScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
  }, []);

  useEffect(() => {
    checkScrollPosition();
    const timer = setTimeout(checkScrollPosition, 100);
    const handleResize = () => checkScrollPosition();
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [checkScrollPosition]);

  const scrollCategories = (offset) => {
    if (filterScrollRef.current) {
      filterScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e) => {
    if (!filterScrollRef.current) return;
    isMouseDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - filterScrollRef.current.offsetLeft;
    scrollLeftStartRef.current = filterScrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isMouseDownRef.current || !filterScrollRef.current) return;
    const x = e.pageX - filterScrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.4;
    if (Math.abs(walk) > 4) {
      hasDraggedRef.current = true;
      setIsDragging(true);
    }
    filterScrollRef.current.scrollLeft = scrollLeftStartRef.current - walk;
    checkScrollPosition();
  };

  const handleMouseUpOrLeave = () => {
    isMouseDownRef.current = false;
    setIsDragging(false);
  };

  const handleFilterClick = (filterId, e) => {
    if (hasDraggedRef.current) return;
    setSelectedFilter(filterId);
    setVisibleCount(8);
    if (e && e.currentTarget) {
      e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  };

  useEffect(() => {
      const fetchDiscoverPosts = async () => {
          setLoading(true);
          let loadedPosts = [];
          try {
              const { data, error } = await supabase
                  .from('posts')
                  .select('*, profiles(username, avatar_url)')
                  .eq('status', 'published')
                  .order('created_at', { ascending: false })
                  .limit(50);
                  
              if (error) {
                  console.warn('Posts join query issue, falling back to base select:', error.message);
                  const { data: rawData } = await supabase
                      .from('posts')
                      .select('*')
                      .eq('status', 'published')
                      .order('created_at', { ascending: false })
                      .limit(50);
                  if (rawData) loadedPosts = rawData;
              } else if (data) {
                  loadedPosts = data;
              }
          } catch (err) {
              console.warn('Failed to load discover posts:', err);
          }

          if (loadedPosts.length > 0) {
              try {
                  // Fetch likes to determine the most popular post for the hero banner
                  const { data: likesData } = await supabase
                      .from('likes')
                      .select('post_id');

                  const likesCountMap = {};
                  (likesData || []).forEach(l => {
                      likesCountMap[l.post_id] = (likesCountMap[l.post_id] || 0) + 1;
                  });

                  const postsWithLikes = loadedPosts.map(p => ({
                      ...p,
                      likes_count: likesCountMap[p.id] || 0
                  }));

                  // 1. Check if any post is explicitly pinned as featured
                  let topPost = postsWithLikes.find(p => p.is_featured);

                  // 2. Otherwise pick the most popular (highest likes, fallback to newest)
                  if (!topPost) {
                      const sortedByPopularity = [...postsWithLikes].sort((a, b) => b.likes_count - a.likes_count);
                      topPost = sortedByPopularity[0];
                  }

                  setFeaturedPost(topPost);
                  // The rest of published posts go to the grid feed
                  setPosts(postsWithLikes.filter(p => p.id !== topPost.id));
              } catch (likesErr) {
                  console.warn('Likes count fetch issue:', likesErr);
                  const topPost = loadedPosts[0];
                  setFeaturedPost(topPost);
                  setPosts(loadedPosts.slice(1));
              }
          } else {
              setFeaturedPost(null);
              setPosts([]);
          }
          setLoading(false);
      };
      
      fetchDiscoverPosts();
  }, []);
  return (
    <div className="discover-page">
      <Header />
      
      {/* FEATURED POST SECTION START                    */}
{/* ============================================= */}
<section className="featured-post-section">
    <div className="container">
        <div className="featured-post">

            {featuredPost ? (
                <>
                    {/* Left column: image, links to the full post */}
                    <Link to={`/post/${featuredPost.id}`} className="featured-post__link">
                        <img src={featuredPost.cover_image || '/assets/images/content/default.jpg'} alt={featuredPost.title} />
                    </Link>

                    {/* Right column: badge, title, text, author */}
                    <div className="featured-post__content">

                        {/* category badge */}
                        <Link to={`/category?cat=${encodeURIComponent(featuredPost.category?.split(' - ')[0] || '')}`} className="featured-post__badge">
                            <span className="featured-post__title">{featuredPost.category?.split(' - ')[0] || 'General'}</span>
                        </Link>

                        {/* title + text group */}
                        <div className="featured-post__info">
                            <Link to={`/post/${featuredPost.id}`} className="featured-post__title-link">
                                <h2>{featuredPost.title}</h2>
                            </Link>
                            <p className="featured-post__subtitle">{featuredPost.subtitle}</p>
                        </div>

                        {/* author block */}
                        <Link to={`/profile/${featuredPost.author_id}`} className="featured-post__author">
                            <img 
                                decoding="async" 
                                src={featuredPost.profiles?.avatar_url || "/assets/images/icons/avatar.svg"} 
                                alt={featuredPost.profiles?.username} 
                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/assets/images/icons/avatar.svg'; }}
                                style={{ width: '48px', height: '48px', aspectRatio: '1 / 1', borderRadius: '50%', objectFit: 'cover' }} 
                            />
                            <div className="featured-post__author__name">
                                <p><b>{featuredPost.profiles?.username || 'Unknown Author'}</b></p>
                                <time dateTime={featuredPost.created_at}>{new Date(featuredPost.created_at).toLocaleDateString()}</time>
                            </div>
                        </Link>
                    </div>
                </>
            ) : loading ? (
                <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--color-text-secondary)', width: '100%' }}>
                    Loading featured story...
                </div>
            ) : (
                <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--color-text-secondary)', width: '100%' }}>
                    <h3 style={{ color: 'var(--color-text-main)', fontSize: '1.4rem', marginBottom: '8px' }}>Welcome to Oasis</h3>
                    <p>Be the first to publish a story and get featured on the main page!</p>
                    <Link to="/add-post" className="btn btn--primary" style={{ display: 'inline-block', marginTop: '16px' }}>Create Story</Link>
                </div>
            )}

        </div>
    </div>
</section>
{/* ============================================= */}
{/* FEATURED POST SECTION END                      */}
{/* ============================================= */}


{/* ============================================= */}
{/* LATEST POSTS SECTION START                     */}
{/* ============================================= */}

<section className="latest-posts-section">

    <div className="container">

        <div className="section-header" style={{ marginBottom: '0.75rem' }}>
            <h2>Explore the latest</h2>
        </div>

        <div className={`category-scroll-container ${canScrollLeft ? 'has-left-fade' : ''} ${canScrollRight ? 'has-right-fade' : ''}`}>
            {canScrollLeft && (
                <button 
                    type="button"
                    className="category-scroll-btn category-scroll-btn--left" 
                    onClick={() => scrollCategories(-280)} 
                    aria-label="Scroll categories left"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
            )}

            <ul 
                ref={filterScrollRef} 
                className={`filters category-scroll-track ${isDragging ? 'is-dragging' : ''}`}
                onScroll={checkScrollPosition}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
            >
                <li>
                    <button 
                        className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
                        onClick={(e) => handleFilterClick('all', e)}
                    >
                        All
                    </button>
                </li>
                {CATEGORIES.map(category => (
                    <li key={category.id}>
                        <button 
                            className={`filter-btn ${selectedFilter === category.id ? 'active' : ''}`}
                            onClick={(e) => handleFilterClick(category.id, e)}
                        >
                            {category.name}
                        </button>
                    </li>
                ))}
            </ul>

            {canScrollRight && (
                <button 
                    type="button"
                    className="category-scroll-btn category-scroll-btn--right" 
                    onClick={() => scrollCategories(280)} 
                    aria-label="Scroll categories right"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            )}
        </div>

        {(() => {
            const filteredPosts = posts.filter(post => {
                if (selectedFilter === 'all') return true;
                if (!post.category) return false;
                const catObj = CATEGORIES.find(c => c.id === selectedFilter);
                if (!catObj) return false;
                const postCatLower = post.category.toLowerCase();
                const mainCatLower = catObj.name.toLowerCase();
                return (
                    postCatLower.includes(mainCatLower) ||
                    (catObj.aliases && catObj.aliases.some(alias => postCatLower.includes(alias)))
                );
            });

            const activeCategoryName = CATEGORIES.find(c => c.id === selectedFilter)?.name;

            return (
                <>
                    <div className="posts-grid">
                        {loading ? (
                            <p>Loading stories...</p>
                        ) : filteredPosts.length > 0 ? (
                            filteredPosts.slice(0, visibleCount).map(post => (
                                <PostCard 
                                    key={post.id} 
                                    id={post.id}
                                    title={post.title}
                                    image={post.cover_image}
                                    category={post.category?.split(' - ')[0] || 'Story'}
                                    categoryLink={`/category?cat=${encodeURIComponent(post.category?.split(' - ')[0] || '')}`}
                                    author={post.profiles?.username || 'Unknown'}
                                    author_id={post.author_id}
                                    date={new Date(post.created_at).toLocaleDateString()}
                                    isoDate={post.created_at}
                                    link={`/post/${post.id}`}
                                />
                            ))
                        ) : (
                            <div style={{ gridColumn: '1 / -1', padding: '40px 0', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                                No stories found under {activeCategoryName ? `"${activeCategoryName}"` : 'this topic'} yet.
                            </div>
                        )}
                    </div>

                    {filteredPosts.length > visibleCount && (
                        <button className="load-more-btn" onClick={() => setVisibleCount(prev => prev + 8)}>Load More Stories</button>
                    )}
                </>
            );
        })()}

    </div>
</section>

{/* ============================================= */}
{/* LATEST POSTS SECTION END                       */}
{/* ============================================= */}






      <Footer />
    </div>
  );
}
