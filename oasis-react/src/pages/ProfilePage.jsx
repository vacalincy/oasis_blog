import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ProfilePage() {
  return (
    <div className="profile-page">
      <Header />
      
      {/* AUTHOR HERO START                              */}
{/* ============================================= */}
<section className="author-hero">
  <div className="container author-hero__container">

    <img loading="lazy" src="/assets/images/avatars/JaneDoe.jpg" alt="Jane Doe" className="author-hero__avatar" />

    <h1 className="author-hero__name">Jane Doe</h1>

    <div className="author-hero__stats">
      <div className="author-hero__stat">
        <span className="author-hero__stat-number">120</span>
        <span className="author-hero__stat-label">Posts</span>
      </div>
      <div className="author-hero__stat">
        <span className="author-hero__stat-number">10.5K</span>
        <span className="author-hero__stat-label">Followers</span>
      </div>
      <div className="author-hero__stat">
        <span className="author-hero__stat-number">450</span>
        <span className="author-hero__stat-label">Following</span>
      </div>
    </div>

    <p className="author-hero__bio">Tech enthusiast and writer exploring the intersection of human experience and emerging technologies. Formerly a lead researcher at a major AI lab, now dedicated to translating complex systems into compelling stories.</p>

    <button className="author-hero__follow-btn">Follow</button>

  </div>
</section>
{/* ============================================= */}
{/* AUTHOR HERO END                                */}
{/* ============================================= */}


{/* ============================================= */}
{/* AUTHOR POSTS GRID START                        */}
{/* ============================================= */}
<section className="latest-posts-section">
  <div className="container">

    <h2 className="author-posts__title">Latest from Jane Doe</h2>

    <div className="posts-grid posts-grid--3col">

      <article className="post-card">
        <div className="post-card__image">
          <Link to="/post" className="post-card__image-link">
            <img loading="lazy" src="/assets/images/content/vr.jpg" alt="The Future of Virtual Reality in Modern Education" />
          </Link>
          <span className="post-card__badge">Science &amp; Technology</span>
          <label className="post-card__save-btn" aria-label="Save post">
            <input type="checkbox" className="post-card__save-input" />
            <svg className="post-card__save-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path className="post-card__save-icon-path" d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z" fill="currentColor" fillOpacity="0" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </label>
        </div>
        <Link to="/post" className="post-card__title-link">
          <h3 className="post-card__title">The Future of Virtual Reality in Modern Education</h3>
        </Link>
        <div className="post-card__meta">
          <span className="post-card__author">Jane Doe</span>
          <span>·</span>
          <time dateTime="2023-10-12">Oct 12, 2023</time>
        </div>
      </article>

      <article className="post-card">
        <div className="post-card__image">
          <Link to="/post" className="post-card__image-link">
            <img loading="lazy" src="/assets/images/content/villa.jpg" alt="Material Honesty: Why Digital Spaces Need Authenticity" />
          </Link>
          <span className="post-card__badge">Design</span>
          <label className="post-card__save-btn" aria-label="Save post">
            <input type="checkbox" className="post-card__save-input" />
            <svg className="post-card__save-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path className="post-card__save-icon-path" d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z" fill="currentColor" fillOpacity="0" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </label>
        </div>
        <Link to="/post" className="post-card__title-link">
          <h3 className="post-card__title">Material Honesty: Why Digital Spaces Need Authenticity</h3>
        </Link>
        <div className="post-card__meta">
          <span className="post-card__author">Jane Doe</span>
          <span>·</span>
          <time dateTime="2023-09-28">Sep 28, 2023</time>
        </div>
      </article>

      <article className="post-card">
        <div className="post-card__image">
          <Link to="/post" className="post-card__image-link">
            <img loading="lazy" src="/assets/images/content/vr.jpg" alt="Redefining Productivity in an Always-On World" />
          </Link>
          <span className="post-card__badge">Culture</span>
          <label className="post-card__save-btn" aria-label="Save post">
            <input type="checkbox" className="post-card__save-input" />
            <svg className="post-card__save-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path className="post-card__save-icon-path" d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z" fill="currentColor" fillOpacity="0" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </label>
        </div>
        <Link to="/post" className="post-card__title-link">
          <h3 className="post-card__title">Redefining Productivity in an Always-On World</h3>
        </Link>
        <div className="post-card__meta">
          <span className="post-card__author">Jane Doe</span>
          <span>·</span>
          <time dateTime="2023-08-15">Aug 15, 2023</time>
        </div>
      </article>

      <article className="post-card">
        <div className="post-card__image">
          <Link to="/post" className="post-card__image-link">
            <img loading="lazy" src="/assets/images/content/vr.jpg" alt="The Ethics of Sentient Machines" />
          </Link>
          <span className="post-card__badge">Technology</span>
          <label className="post-card__save-btn" aria-label="Save post">
            <input type="checkbox" className="post-card__save-input" />
            <svg className="post-card__save-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path className="post-card__save-icon-path" d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z" fill="currentColor" fillOpacity="0" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </label>
        </div>
        <Link to="/post" className="post-card__title-link">
          <h3 className="post-card__title">The Ethics of Sentient Machines</h3>
        </Link>
        <div className="post-card__meta">
          <span className="post-card__author">Jane Doe</span>
          <span>·</span>
          <time dateTime="2023-07-02">Jul 02, 2023</time>
        </div>
      </article>

      <article className="post-card">
        <div className="post-card__image">
          <Link to="/post" className="post-card__image-link">
            <img loading="lazy" src="/assets/images/content/vr.jpg" alt="Beyond the Screen: Interfaces of Tomorrow" />
          </Link>
          <span className="post-card__badge">UX Research</span>
          <label className="post-card__save-btn" aria-label="Save post">
            <input type="checkbox" className="post-card__save-input" />
            <svg className="post-card__save-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path className="post-card__save-icon-path" d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z" fill="currentColor" fillOpacity="0" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </label>
        </div>
        <Link to="/post" className="post-card__title-link">
          <h3 className="post-card__title">Beyond the Screen: Interfaces of Tomorrow</h3>
        </Link>
        <div className="post-card__meta">
          <span className="post-card__author">Jane Doe</span>
          <span>·</span>
          <time dateTime="2023-06-11">Jun 11, 2023</time>
        </div>
      </article>

      <article className="post-card">
        <div className="post-card__image">
          <Link to="/post" className="post-card__image-link">
            <img loading="lazy" src="/assets/images/content/vr.jpg" alt="Minimalism as a Strategy for Focus" />
          </Link>
          <span className="post-card__badge">Lifestyle</span>
          <label className="post-card__save-btn" aria-label="Save post">
            <input type="checkbox" className="post-card__save-input" />
            <svg className="post-card__save-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path className="post-card__save-icon-path" d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z" fill="currentColor" fillOpacity="0" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </label>
        </div>
        <Link to="/post" className="post-card__title-link">
          <h3 className="post-card__title">Minimalism as a Strategy for Focus</h3>
        </Link>
        <div className="post-card__meta">
          <span className="post-card__author">Jane Doe</span>
          <span>·</span>
          <time dateTime="2023-05-20">May 20, 2023</time>
        </div>
      </article>

    </div>

    <button className="load-more-btn">Load More Stories</button>

  </div>
</section>
{/* ============================================= */}
{/* AUTHOR POSTS GRID END                          */}
{/* ============================================= */}




      <Footer />
    </div>
  );
}
