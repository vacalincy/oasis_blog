import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';


const TOPICS_DATA = [
    {
        id: 1,
        image: "/assets/images/content/topic-architecture.jpg",
        date: "Jan 8, 2025 · 6 min read",
        isoDate: "2025-01-08",
        title: "Reading a City Through Its Old Signs",
        author: "Bastian Voss",
        posClass: "topic-card--pos-1"
    },
    {
        id: 2,
        image: "/assets/images/content/topic-street.jpg",
        date: "Jan 11, 2025 · 4 min read",
        isoDate: "2025-01-11",
        title: "A Moment, Held in One Hand",
        author: "Jack Murphy",
        posClass: "topic-card--pos-2"
    },
    {
        id: 3,
        image: "/assets/images/content/topic-skyline.jpg",
        date: "Jan 15, 2025 · 8 min read",
        isoDate: "2025-01-15",
        title: "Skyline in the Morning Fog",
        author: "Nikita Pisarenko",
        posClass: "topic-card--main"
    },
    {
        id: 4,
        image: "/assets/images/content/topic-guitar.jpg",
        date: "Jan 18, 2025 · 5 min read",
        isoDate: "2025-01-18",
        title: "Footsteps on an Empty Street",
        author: "Hojol Rahman",
        posClass: "topic-card--pos-3"
    },
    {
        id: 5,
        image: "/assets/images/content/topic-couple.jpg",
        date: "Jan 21, 2025 · 3 min read",
        isoDate: "2025-01-21",
        title: "Two People, One Frame",
        author: "Satu Amrita",
        posClass: "topic-card--pos-4"
    }
];

export default function TopicsPage() {
  const heroRef = useRef(null);
  const cardsWrapRef = useRef(null);
  const textWrapRef = useRef(null);

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
    
    // Trigger CSS fan-out animation on mobile after a tiny delay
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
      
      {/* TOPIC HERO SECTION START                       */}
{/* ============================================= */}
<section className="topic-hero" ref={heroRef} id="topic-hero">
    <div className="topic-hero__stage">

        <div className="topic-hero__cards" ref={cardsWrapRef} id="topic-hero-cards">
            {TOPICS_DATA.map(topic => (
                <div key={topic.id} className={`topic-card ${topic.posClass}`}>
                    <img loading="lazy" src={topic.image} alt={topic.title} />
                    <div className="topic-card__caption">
                        <time dateTime={topic.isoDate}>{topic.date}</time>
                        <p>{topic.title}</p>
                        <span className="topic-card__author">{topic.author}</span>
                    </div>
                </div>
            ))}
        </div>

        <div className="topic-hero__text" ref={textWrapRef} id="topic-hero-text">
            <Link to="/category" className="topic-hero__eyebrow">Explore by Topic</Link>
            <h1>Discover your next<br />favorite topic.</h1>
        </div>

    </div>
</section>
{/* ============================================= */}
{/* TOPIC HERO SECTION END                         */}
{/* ============================================= */}


{/* ============================================= */}
{/* CATEGORIES SECTION START                       */}
{/* ============================================= */}
<section className="categories-section" id="categories">
    <div className="container">

        <h2 className="categories-section__title">Explore Categories</h2>

        <div className="categories-grid">
            <Link to="/category?cat=code-development" className="category-card">
                <span className="category-card__name">Code &amp; Development</span>
                <span className="category-card__count">124</span>
            </Link>
            <Link to="/category?cat=travel-outdoors" className="category-card">
                <span className="category-card__name">Travel &amp; Outdoors</span>
                <span className="category-card__count">86</span>
            </Link>
            <Link to="/category?cat=photography-film" className="category-card">
                <span className="category-card__name">Photography &amp; Film</span>
                <span className="category-card__count">245</span>
            </Link>
            <Link to="/category?cat=design-interfaces" className="category-card">
                <span className="category-card__name">Design &amp; Interfaces</span>
                <span className="category-card__count">52</span>
            </Link>
            <Link to="/category?cat=science-technology" className="category-card">
                <span className="category-card__name">Science &amp; Technology</span>
                <span className="category-card__count">198</span>
            </Link>
            <Link to="/category?cat=music-culture" className="category-card">
                <span className="category-card__name">Music &amp; Culture</span>
                <span className="category-card__count">110</span>
            </Link>
            <Link to="/category?cat=food-culinary" className="category-card">
                <span className="category-card__name">Food &amp; Culinary</span>
                <span className="category-card__count">73</span>
            </Link>
            <Link to="/category?cat=automotive-mobility" className="category-card">
                <span className="category-card__name">Automotive &amp; Mobility</span>
                <span className="category-card__count">142</span>
            </Link>
            <Link to="/category?cat=education-lifestyle" className="category-card">
                <span className="category-card__name">Education &amp; Lifestyle</span>
                <span className="category-card__count">215</span>
            </Link>
            <Link to="/category?cat=literature-culture" className="category-card">
                <span className="category-card__name">Literature &amp; Culture</span>
                <span className="category-card__count">108</span>
            </Link>
        </div>

    </div>
</section>
{/* ============================================= */}
{/* CATEGORIES SECTION END                         */}
{/* ============================================= */}


{/* ============================================= */}
{/* FEATURED ARTICLES SECTION START                */}
{/* ============================================= */}
<section className="topic-featured-section">
    <div className="container">

        <div className="section-header">
            <h2>Featured Articles</h2>
            <Link to="/popular" className="view-all-link">View All →</Link>
        </div>

        <div className="topic-featured-grid">

            <article className="topic-featured-card">
                <Link to="/post" className="topic-featured-card__image">
                    <img loading="lazy" src="/assets/images/content/swiss-typography.jpg" alt="Swiss typography grid layout" />
                </Link>
                <Link to="/post" className="topic-featured-card__title-link">
                    <h3>The Principles of Swiss Typography</h3>
                </Link>
                <div className="topic-featured-card__meta">
                    <time dateTime="2024-10-12">Oct 12, 2024</time>
                    <span>·</span>
                    <span>Julian Hayes</span>
                </div>
            </article>

            <article className="topic-featured-card">
                <Link to="/post" className="topic-featured-card__image">
                    <img loading="lazy" src="/assets/images/content/resilient-architecture.jpg" alt="Server architecture diagram" />
                </Link>
                <Link to="/post" className="topic-featured-card__title-link">
                    <h3>Building Resilient Architectures</h3>
                </Link>
                <div className="topic-featured-card__meta">
                    <time dateTime="2024-10-15">Oct 15, 2024</time>
                    <span>·</span>
                    <span>Marcus Vance</span>
                </div>
            </article>

            <article className="topic-featured-card">
                <Link to="/post" className="topic-featured-card__image">
                    <img loading="lazy" src="/assets/images/content/natural-light-photography.jpg" alt="Portrait photo using natural light" />
                </Link>
                <Link to="/post" className="topic-featured-card__title-link">
                    <h3>Mastering Natural Light</h3>
                </Link>
                <div className="topic-featured-card__meta">
                    <time dateTime="2024-10-18">Oct 18, 2024</time>
                    <span>·</span>
                    <span>Clara Hoffman</span>
                </div>
            </article>

        </div>

    </div>
</section>
{/* ============================================= */}
{/* FEATURED ARTICLES SECTION END                  */}
{/* ============================================= */}

<script src="/assets/js/parallax.js" defer></script>



      <Footer />
    </div>
  );
}
