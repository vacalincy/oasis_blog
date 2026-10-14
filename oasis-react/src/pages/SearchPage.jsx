import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import { supabase } from '../supabaseClient';
import { searchContent } from '../utils/searchService';
import { findCategory, CATEGORIES } from '../constants/categories';
import '../assets/css/search.css';

const QUICK_SEARCH_TAGS = [
  "Food & Culinary",
  "Design & Interfaces",
  "Travel & Outdoors",
  "Photography",
  "Architecture"
];

const FALLBACK_CATEGORY_BOARDS = [
  {
    id: 'food-culinary',
    title: 'Food & Culinary',
    slug: 'food-culinary',
    countText: 'Gastronomy & Dining',
    mainImg: '/assets/images/content/001.jpg',
    smallImg1: '/assets/images/content/002.jpg',
    smallImg2: '/assets/images/content/003.jpg',
    link: '/category?cat=food-culinary'
  },
  {
    id: 'travel-outdoors',
    title: 'Travel & Outdoors',
    slug: 'travel-outdoors',
    countText: 'Alpine & Nature',
    mainImg: '/assets/images/content/lake-mountains.jpg',
    smallImg1: '/assets/images/content/dunes.jpg',
    smallImg2: '/assets/images/content/sunrise.jpg',
    link: '/category?cat=travel-outdoors'
  },
  {
    id: 'design-interfaces',
    title: 'Design & Interfaces',
    slug: 'design-interfaces',
    countText: 'Typography & UI',
    mainImg: '/assets/images/content/modernbuildingfacade.jpg',
    smallImg1: '/assets/images/content/abstractcurvedlight.jpg',
    smallImg2: '/assets/images/content/villa.jpg',
    link: '/category?cat=design-interfaces'
  }
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const qParam = searchParams.get('q') || '';

  const [inputVal, setInputVal] = useState(qParam);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'stories', 'authors'
  const [results, setResults] = useState({ posts: [], authors: [], topics: [] });
  const [loading, setLoading] = useState(false);
  const [categoryBoards, setCategoryBoards] = useState(FALLBACK_CATEGORY_BOARDS);

  // Sync with URL query parameter
  useEffect(() => {
    setInputVal(qParam);
    if (!qParam.trim()) {
      document.title = 'Search Stories & Authors — OASIS';
      setResults({ posts: [], authors: [], topics: [] });
      setLoading(false);
      return;
    }

    document.title = `Search: "${qParam.trim()}" — OASIS`;

    const fetchResults = async () => {
      setLoading(true);
      const res = await searchContent(qParam.trim(), { limitPosts: 24, limitAuthors: 12 });
      setResults(res);
      setLoading(false);
    };

    fetchResults();
  }, [qParam]);

  // Dynamically load categories with top 3 published posts from Supabase
  useEffect(() => {
    const fetchDynamicCategoryBoards = async () => {
      try {
        const { data: postsData } = await supabase
          .from('posts')
          .select('id, title, cover_image, category, created_at, status')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (!postsData || postsData.length === 0) return;

        // Fetch likes to sort posts by popularity
        const { data: likesData } = await supabase
          .from('likes')
          .select('post_id');

        const likesMap = {};
        (likesData || []).forEach(l => {
          likesMap[l.post_id] = (likesMap[l.post_id] || 0) + 1;
        });

        // Group published posts by category
        const groups = {};
        postsData.forEach(p => {
          if (!p.category) return;
          const mainCat = p.category.split(' - ')[0].trim();
          if (!groups[mainCat]) {
            groups[mainCat] = [];
          }
          groups[mainCat].push({
            ...p,
            likes_count: likesMap[p.id] || 0
          });
        });

        // Generate category boards
        const dynamicBoards = Object.entries(groups).map(([catName, posts]) => {
          // Sort posts in category by popularity (likes desc, then date desc)
          const sorted = [...posts].sort((a, b) => b.likes_count - a.likes_count);
          const totalLikes = posts.reduce((sum, p) => sum + p.likes_count, 0);
          const catObj = findCategory(catName);
          const slug = catObj?.slug || catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

          const top3 = sorted.slice(0, 3);
          const mainImg = top3[0]?.cover_image || '/assets/images/content/default.jpg';
          const smallImg1 = top3[1]?.cover_image || top3[0]?.cover_image || '/assets/images/content/default.jpg';
          const smallImg2 = top3[2]?.cover_image || top3[1]?.cover_image || top3[0]?.cover_image || '/assets/images/content/default.jpg';

          return {
            id: slug,
            title: catObj ? catObj.name : catName,
            slug,
            countText: `${posts.length} ${posts.length === 1 ? 'Story' : 'Stories'}`,
            mainImg,
            smallImg1,
            smallImg2,
            link: `/category?cat=${encodeURIComponent(catObj ? catObj.slug : catName)}`,
            totalLikes,
            totalPosts: posts.length
          };
        });

        // Sort categories by popularity
        dynamicBoards.sort((a, b) => b.totalLikes - a.totalLikes || b.totalPosts - a.totalPosts);

        // Fill up with fallbacks if fewer than 3 categories
        const merged = [...dynamicBoards];
        FALLBACK_CATEGORY_BOARDS.forEach(fallback => {
          if (merged.length < 3 && !merged.some(b => b.slug === fallback.slug || b.title === fallback.title)) {
            merged.push(fallback);
          }
        });

        setCategoryBoards(merged.slice(0, 3));
      } catch (err) {
        console.warn('Could not fetch dynamic category boards:', err);
      }
    };

    fetchDynamicCategoryBoards();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSearchParams({ q: inputVal.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleTagClick = (tag) => {
    setInputVal(tag);
    setSearchParams({ q: tag });
  };

  const handleClear = () => {
    setInputVal('');
    setSearchParams({});
  };

  const totalResults = results.posts.length + results.authors.length;

  return (
    <div className="search-page">
      <Header />

      {/* SEARCH HEADER HERO */}
      <section className="search-header-hero">
        <div className="search-header-hero__content">
          <span className="search-header-hero__eyebrow">Search Oasis</span>
          <h1 className="search-header-hero__title">
            {qParam.trim() ? `Results for “${qParam}”` : 'Explore stories & authors'}
          </h1>
          <p className="search-header-hero__subtitle">
            Find insightful articles, mountain journeys, Swiss design, and inspiring creators.
          </p>

          <form onSubmit={handleSubmit} className="search-input-box">
            <img 
              loading="lazy" 
              src="/assets/images/icons/search.svg" 
              alt="" 
              className="search-input-box__icon" 
            />
            <input 
              type="text" 
              placeholder="Search stories, authors, or topics..." 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              aria-label="Search stories"
            />
            {inputVal && (
              <button 
                type="button" 
                className="search-input-box__clear" 
                onClick={handleClear}
                aria-label="Clear input"
              >
                ✕
              </button>
            )}
            <button type="submit" className="search-input-box__submit">
              Search
            </button>
          </form>

          {/* Quick tags */}
          <div className="search-quick-tags">
            <span className="search-quick-tags__label">Trending:</span>
            {QUICK_SEARCH_TAGS.map(tag => (
              <button 
                key={tag} 
                type="button" 
                className="search-quick-tag"
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SEARCH RESULTS SECTION */}
      <section className="search-results-section">
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--color-text-secondary)' }}>
              <div className="search-dropdown__spinner" style={{ width: 28, height: 28, margin: '0 auto 16px' }} />
              <p style={{ fontSize: '1.1rem' }}>Searching across Oasis stories and authors...</p>
            </div>
          ) : qParam.trim() ? (
            totalResults === 0 ? (
              /* EMPTY STATE */
              <>
                <div className="search-empty-state">
                  <span className="search-empty-state__icon">🔍</span>
                  <h3>No matches found for “{qParam}”</h3>
                  <p>Check your spelling, try broader keywords, or explore one of our curated collections below.</p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {QUICK_SEARCH_TAGS.slice(0, 4).map(tag => (
                      <button 
                        key={tag} 
                        type="button" 
                        className="search-quick-tag"
                        onClick={() => handleTagClick(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CATEGORY COLLECTIONS */}
                <div className="curated-boards-section">
                  <span className="curated-boards__eyebrow">Category Collections</span>
                  <h2 className="curated-boards__title">Ideas you might like</h2>
                  <div className="curated-boards__grid">
                    {categoryBoards.map(board => (
                      <Link key={board.id} to={board.link} className="board-card">
                        <div className="board-card__collage">
                          <img loading="lazy" src={board.mainImg} alt="" className="board-card__main" />
                          <img loading="lazy" src={board.smallImg1} alt="" className="board-card__small" />
                          <img loading="lazy" src={board.smallImg2} alt="" className="board-card__small" />
                        </div>
                        <p className="board-card__title">{board.title}</p>
                        <span className="board-card__meta">{board.countText}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* RESULTS FOUND */
              <>
                <div className="search-results-meta">
                  <span className="search-results-count">
                    Found <b>{results.posts.length}</b> {results.posts.length === 1 ? 'story' : 'stories'} and <b>{results.authors.length}</b> {results.authors.length === 1 ? 'author' : 'authors'}
                  </span>
                </div>

                {/* TABS */}
                <div className="search-tabs">
                  <button 
                    type="button" 
                    className={`search-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                  >
                    All ({totalResults})
                  </button>
                  <button 
                    type="button" 
                    className={`search-tab-btn ${activeTab === 'stories' ? 'active' : ''}`}
                    onClick={() => setActiveTab('stories')}
                  >
                    Stories ({results.posts.length})
                  </button>
                  <button 
                    type="button" 
                    className={`search-tab-btn ${activeTab === 'authors' ? 'active' : ''}`}
                    onClick={() => setActiveTab('authors')}
                  >
                    Authors ({results.authors.length})
                  </button>
                </div>

                {/* TAB CONTENT */}
                {(activeTab === 'all' || activeTab === 'authors') && results.authors.length > 0 && (
                  <div>
                    {activeTab === 'all' && <h3 className="search-subheading">Authors</h3>}
                    <div className="search-authors-grid">
                      {results.authors.map(author => (
                        <Link key={author.id} to={`/profile/${author.id}`} className="search-author-card">
                          <img 
                            src={author.avatar_url || '/assets/images/icons/avatar.svg'} 
                            alt={author.username} 
                            className="search-author-card__avatar"
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/assets/images/icons/avatar.svg'; }}
                          />
                          <h4 className="search-author-card__name">{author.username}</h4>
                          {author.bio && <p className="search-author-card__bio">{author.bio}</p>}
                          <span className="search-author-card__btn">View Profile</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {(activeTab === 'all' || activeTab === 'stories') && results.posts.length > 0 && (
                  <div>
                    {activeTab === 'all' && <h3 className="search-subheading">Stories</h3>}
                    <div className="posts-grid posts-grid--3col">
                      {results.posts.map(post => (
                        <PostCard 
                          key={post.id}
                          title={post.title || "Untitled Story"}
                          image={post.cover_image || "/assets/images/content/default.jpg"}
                          category={post.category?.split(' - ')[0] || "Story"}
                          author={post.profiles?.username || "Author"}
                          date={new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          isoDate={post.created_at}
                          link={`/post/${post.id}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )
          ) : (
            /* EMPTY QUERY: INITIAL EXPLORATION STATE */
            <div className="curated-boards-section">
              <span className="curated-boards__eyebrow">Category Collections</span>
              <h2 className="curated-boards__title">Ideas you might like</h2>
              <div className="curated-boards__grid">
                {categoryBoards.map(board => (
                  <Link key={board.id} to={board.link} className="board-card">
                    <div className="board-card__collage">
                      <img loading="lazy" src={board.mainImg} alt="" className="board-card__main" />
                      <img loading="lazy" src={board.smallImg1} alt="" className="board-card__small" />
                      <img loading="lazy" src={board.smallImg2} alt="" className="board-card__small" />
                    </div>
                    <p className="board-card__title">{board.title}</p>
                    <span className="board-card__meta">{board.countText}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
