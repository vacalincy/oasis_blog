import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import { supabase } from '../supabaseClient';
import { CATEGORIES } from '../constants/categories';
import '../assets/css/topics.css';

const HERO_TOPICS_CARDS = [
    {
        id: 1,
        image: "/assets/images/content/topic-architecture.jpg",
        date: "Minimalist UI",
        title: "Reading a City Through Its Raw Concrete",
        author: "Bastian Voss",
        posClass: "topic-card--pos-1",
        catSlug: "design-interfaces"
    },
    {
        id: 2,
        image: "/assets/images/content/topic-street.jpg",
        date: "Camera Settings",
        title: "A Fleeting Moment, Held in One Frame",
        author: "Jack Murphy",
        posClass: "topic-card--pos-2",
        catSlug: "photography-film"
    },
    {
        id: 3,
        image: "/assets/images/content/topic-skyline.jpg",
        date: "Grid & Flexbox",
        title: "The Grid That Reordered Modern Typography",
        author: "Nikita Pisarenko",
        posClass: "topic-card--main",
        catSlug: "code-development"
    },
    {
        id: 4,
        image: "/assets/images/content/topic-guitar.jpg",
        date: "Classic Rock",
        title: "Chords in the Dark: The Underground Vinyl Scene",
        author: "Hojol Rahman",
        posClass: "topic-card--pos-3",
        catSlug: "music-culture"
    },
    {
        id: 5,
        image: "/assets/images/content/topic-couple.jpg",
        date: "Productivity",
        title: "Timeless: Reflections on Aging and Style",
        author: "Satu Amrita",
        posClass: "topic-card--pos-4",
        catSlug: "education-lifestyle"
    }
];

export default function TopicsPage() {
  const heroRef = useRef(null);
  const cardsWrapRef = useRef(null);
  const textWrapRef = useRef(null);

  const [categoryCounts, setCategoryCounts] = useState({});
  const [featuredPosts, setFeaturedPosts] = useState([]);

  // Fetch real category counts & featured posts from Supabase
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const { data: posts, error } = await supabase
          .from('posts')
          .select('id, title, category, cover_image, created_at, author_id, profiles(username)')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Count posts per category
        const counts = {};
        CATEGORIES.forEach(c => { counts[c.id] = 0; });

        if (posts) {
          posts.forEach(post => {
            if (!post.category) return;
            const pCatLower = post.category.toLowerCase();
            
            CATEGORIES.forEach(cat => {
              if (
                pCatLower.includes(cat.name.toLowerCase()) ||
                pCatLower.includes(cat.slug.toLowerCase()) ||
                (cat.aliases && cat.aliases.some(a => pCatLower.includes(a.toLowerCase())))
              ) {
                counts[cat.id] = (counts[cat.id] || 0) + 1;
              }
            });
          });

          // Set 3 latest posts as featured
          setFeaturedPosts(posts.slice(0, 3));
        }

        setCategoryCounts(counts);
      } catch (err) {
        console.error("Error loading category stats:", err);
      }
    };

    fetchCategoryData();
  }, []);

  // Parallax Scroll Animation for the Hero cards
  useEffect(() => {
    const heroSection = heroRef.current;
    const cardsWrap = cardsWrapRef.current;
    const textWrap = textWrapRef.current;

    if (!heroSection || !cardsWrap || !textWrap) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cardEls = cardsWrap.querySelectorAll('.topic-card');

    const cardConfig = [
        { el: cardEls[0], restY: 10,  restRotate: -14, extraXVw: -20, extraRotate: -14 },
        { el: cardEls[1], restY: 0,   restRotate: -7,  extraXVw: -10, extraRotate: -8 },
        { el: cardEls[2], restY: -10, restRotate: 0,   extraXVw: 0,   extraRotate: 0 },
        { el: cardEls[3], restY: 0,   restRotate: 7,   extraXVw: 10,  extraRotate: 8 },
        { el: cardEls[4], restY: 10,  restRotate: 14,  extraXVw: 20,  extraRotate: 14 },
    ];

    let ticking = false;

    function getProgress() {
        const rect = heroSection.getBoundingClientRect();
        const scrollable = heroSection.offsetHeight - window.innerHeight;
        if (scrollable <= 0) return 0;
        const progress = -rect.top / scrollable;
        return Math.min(Math.max(progress, 0), 1);
    }

    let mobileTargetProgress = 0;
    function update() {
        const isMobile = window.innerWidth <= 768;
        const progress = isMobile ? mobileTargetProgress : getProgress();
        const vw = window.innerWidth / 100;

        cardConfig.forEach(({ el, restY, restRotate, extraXVw, extraRotate }) => {
            if (!el) return;
            const x = extraXVw * vw * progress;
            const y = restY - progress * 10; 
            const rotate = restRotate + extraRotate * progress;
            el.style.transform = `translate(calc(-50% + ${x}px), ${y}px) rotate(${rotate}deg)`;
        });

        textWrap.style.transform = `translateY(${20 - progress * 30}px)`;
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    update(); 
    
    if (window.innerWidth <= 768) {
        setTimeout(() => {
            mobileTargetProgress = 1;
            update();
        }, 300);
    }

    return () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="topics-page">
      <Header />
      <main id="main-content" className="topics-main">
      
      {/* TOPIC HERO SECTION START */}
      <section className="topic-hero" ref={heroRef} id="topic-hero">
        <div className="topic-hero__stage">
          <div className="topic-hero__cards" ref={cardsWrapRef} id="topic-hero-cards">
            {HERO_TOPICS_CARDS.map(topic => (
              <Link 
                key={topic.id} 
                to={`/category?cat=${topic.catSlug}`}
                className={`topic-card ${topic.posClass}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <img 
                  loading="eager" 
                  fetchPriority={topic.posClass === 'topic-card--main' || topic.id === 1 ? 'high' : 'low'}
                  decoding="async"
                  width="426"
                  height="639"
                  src={topic.image} 
                  alt={topic.title} 
                />
                <div className="topic-card__caption">
                  <time>{topic.date}</time>
                  <p>{topic.title}</p>
                  <span className="topic-card__author">{topic.author}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="topic-hero__text" ref={textWrapRef} id="topic-hero-text">
            <span className="topic-hero__eyebrow">Explore by Topic</span>
            <h1>Discover your next<br />favorite topic.</h1>
          </div>
        </div>
      </section>
      {/* TOPIC HERO SECTION END */}

      {/* CATEGORIES SECTION START */}
      <section className="categories-section" id="categories">
        <div className="container">
          <h2 className="categories-section__title">Explore Categories &amp; Subcategories</h2>

          <div className="categories-grid">
            {CATEGORIES.map(category => {
              const count = categoryCounts[category.id] || 0;
              return (
                <div key={category.id} className="topic-group-card">
                  {/* Category Header Link */}
                  <Link to={`/category?cat=${category.slug}`} className="topic-group-header">
                    <h3>{category.name}</h3>
                    <span className="category-card__count">{count} {count === 1 ? 'story' : 'stories'}</span>
                  </Link>
                  
                  {/* Clickable Subcategories */}
                  <div className="topic-group-subcategories">
                    {category.subcategories.map(subItem => {
                      const subName = typeof subItem === 'string' ? subItem : subItem.name;
                      const subDesc = typeof subItem === 'object' ? subItem.desc : '';
                      return (
                        <Link 
                          key={subName}
                          to={`/category?cat=${category.slug}&sub=${encodeURIComponent(subName)}`}
                          className="topic-sub-chip"
                          title={subDesc}
                        >
                          {subName}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* CATEGORIES SECTION END */}

      {/* FEATURED ARTICLES SECTION START */}
      <section className="topic-featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Latest Across Topics</h2>
            <Link to="/discover" className="view-all-link">View All Stories →</Link>
          </div>

          <div className="posts-grid posts-grid--3col">
            {featuredPosts.map(post => (
              <PostCard 
                key={post.id}
                id={post.id}
                title={post.title}
                image={post.cover_image || "/assets/images/content/default.jpg"}
                category={post.category?.split(' - ')[0] || 'Story'}
                categoryLink={`/category?cat=${encodeURIComponent(post.category?.split(' - ')[0] || '')}`}
                author={post.profiles?.username || 'Unknown Author'}
                author_id={post.author_id}
                date={new Date(post.created_at).toLocaleDateString()}
                isoDate={post.created_at}
                link={`/post/${post.id}`}
              />
            ))}
          </div>
        </div>
      </section>
      {/* FEATURED ARTICLES SECTION END */}

      </main>
      <Footer />
    </div>
  );
}
