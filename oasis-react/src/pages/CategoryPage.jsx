import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import { supabase } from '../supabaseClient';
import { CATEGORIES, findCategory } from '../constants/categories';
import '../assets/css/category-post.css';

export default function CategoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get('cat') || 'architecture';
  const subParam = searchParams.get('sub') || 'All';

  const [activeCategory, setActiveCategory] = useState(() => findCategory(catParam) || CATEGORIES[0]);
  const [activeSub, setActiveSub] = useState(subParam);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync with URL params when they change
  useEffect(() => {
    const matched = findCategory(catParam) || CATEGORIES[0];
    setActiveCategory(matched);
    setActiveSub(subParam || 'All');
  }, [catParam, subParam]);

  useEffect(() => {
    if (activeCategory?.name) {
      document.title = `${activeCategory.name} — OASIS`;
    }
  }, [activeCategory]);

  // Fetch posts from Supabase for this category
  useEffect(() => {
    const fetchCategoryPosts = async () => {
      setLoading(true);
      try {
        // Query posts
        const { data, error } = await supabase
          .from('posts')
          .select('*, profiles(username, avatar_url)')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Filter in JS using category name and aliases for robust matching
        const filtered = (data || []).filter(post => {
          if (!post.category) return false;
          const postCatLower = post.category.toLowerCase();
          
          // Match main category
          const isCategoryMatch = 
            postCatLower.includes(activeCategory.name.toLowerCase()) ||
            postCatLower.includes(activeCategory.slug.toLowerCase()) ||
            (activeCategory.aliases && activeCategory.aliases.some(a => postCatLower.includes(a.toLowerCase())));

          if (!isCategoryMatch) return false;

          // If a specific subcategory is selected (and not 'All')
          if (activeSub && activeSub !== 'All') {
            return postCatLower.includes(activeSub.toLowerCase());
          }

          return true;
        });

        setPosts(filtered);
      } catch (err) {
        console.error('Error fetching category posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryPosts();
  }, [activeCategory, activeSub]);

  const handleSubcategoryClick = (sub) => {
    setActiveSub(sub);
    setSearchParams({ cat: activeCategory.slug, sub });
  };

  return (
    <div className="category-page">
      <Header />
      
      {/* CATEGORY HEADER START */}
      <section className="category-header">
        <div className="container category-header__container">
          <h1 className="category-header__title">{activeCategory.name}</h1>
          <p className="category-header__description">
            {activeCategory.description}
          </p>

          {/* Subcategory filter buttons */}
          <div className="category-header__filters">
            <button 
              className={`category-header__filter-btn ${activeSub === 'All' ? 'active' : ''}`}
              onClick={() => handleSubcategoryClick('All')}
            >
              All
            </button>
            {activeCategory.subcategories.map(subItem => {
              const subName = typeof subItem === 'string' ? subItem : subItem.name;
              return (
                <button 
                  key={subName}
                  className={`category-header__filter-btn ${activeSub === subName ? 'active' : ''}`}
                  onClick={() => handleSubcategoryClick(subName)}
                  title={typeof subItem === 'object' ? subItem.desc : ''}
                >
                  {subName}
                </button>
              );
            })}
          </div>
        </div>
      </section>
      {/* CATEGORY HEADER END */}

      {/* CATEGORY POSTS GRID */}
      <section className="latest-posts-section" style={{ paddingBottom: '5rem' }}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-secondary)' }}>
              <p>Loading {activeCategory.name} stories...</p>
            </div>
          ) : posts.length > 0 ? (
            <div className="posts-grid">
              {posts.map(post => {
                const parts = post.category ? post.category.split(' - ') : [];
                const subPart = parts[1] || parts[0] || activeCategory.name;

                return (
                  <PostCard 
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    image={post.cover_image || '/assets/images/content/default.jpg'}
                    category={subPart}
                    categoryLink={`/category?cat=${activeCategory.slug}&sub=${encodeURIComponent(subPart)}`}
                    author={post.profiles?.username || 'Unknown Author'}
                    author_id={post.author_id}
                    date={new Date(post.created_at).toLocaleDateString()}
                    isoDate={post.created_at}
                    link={`/post/${post.id}`}
                  />
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '500px', margin: '0 auto' }}>
              <h3 style={{ marginBottom: '10px', color: 'var(--color-text-main)' }}>No stories yet in this section</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
                {activeSub !== 'All' 
                  ? `There are no articles tagged "${activeSub}" right now.` 
                  : `Be the first to publish a story in ${activeCategory.name}!`}
              </p>
              {activeSub !== 'All' ? (
                <button 
                  onClick={() => handleSubcategoryClick('All')}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '2rem',
                    background: 'var(--color-primary)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  View All {activeCategory.name}
                </button>
              ) : (
                <Link 
                  to="/topics"
                  style={{
                    display: 'inline-block',
                    padding: '10px 24px',
                    borderRadius: '2rem',
                    background: 'var(--color-primary)',
                    color: '#fff',
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  Browse Other Topics
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
