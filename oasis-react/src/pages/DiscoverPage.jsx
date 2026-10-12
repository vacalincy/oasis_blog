import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import { supabase } from '../supabaseClient';



export default function DiscoverPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
      const fetchDiscoverPosts = async () => {
          setLoading(true);
          const { data, error } = await supabase
              .from('posts')
              .select('*, profiles(username, avatar_url)')
              .eq('status', 'published')
              .order('created_at', { ascending: false })
              .limit(50);
              
          if (data && data.length > 0) {
              setFeaturedPost(data[0]); // First post is featured
              setPosts(data.slice(1)); // Rest go to the grid
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
                        <img src={featuredPost.cover_image || '/assets/images/content/discover_main_pc.jpg'} alt={featuredPost.title} />
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
                            <img loading="lazy" src={featuredPost.profiles?.avatar_url || "/assets/images/icons/avatar.svg"} alt={featuredPost.profiles?.username} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                            <div className="featured-post__author__name">
                                <p><b>{featuredPost.profiles?.username || 'Unknown Author'}</b></p>
                                <time dateTime={featuredPost.created_at}>{new Date(featuredPost.created_at).toLocaleDateString()}</time>
                            </div>
                        </Link>
                    </div>
                </>
            ) : (
                <div style={{ padding: '40px' }}>Loading featured story...</div>
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

        <div className="section-header">
            <h2>Explore the latest</h2>
            <ul className="filters" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                    { key: 'all', label: 'All' },
                    { key: 'architecture', label: 'Architecture' },
                    { key: 'design', label: 'Design' },
                    { key: 'photography', label: 'Photography' },
                    { key: 'music', label: 'Music' },
                    { key: 'tech', label: 'Technology' },
                    { key: 'food', label: 'Food' }
                ].map(f => (
                    <li key={f.key}>
                        <button 
                            className={`filter-btn ${selectedFilter === f.key ? 'active' : ''}`}
                            onClick={() => { setSelectedFilter(f.key); setVisibleCount(8); }}
                        >
                            {f.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>

        {(() => {
            const filteredPosts = posts.filter(post => {
                if (selectedFilter === 'all') return true;
                if (!post.category) return false;
                return post.category.toLowerCase().includes(selectedFilter.toLowerCase());
            });

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
                                    category={post.category}
                                    author={post.profiles?.username || 'Unknown'}
                                    author_id={post.author_id}
                                    date={new Date(post.created_at).toLocaleDateString()}
                                    isoDate={post.created_at}
                                    link={`/post/${post.id}`}
                                />
                            ))
                        ) : (
                            <div style={{ gridColumn: '1 / -1', padding: '40px 0', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                                No stories found under this topic yet.
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
