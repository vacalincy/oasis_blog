import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function CategoryPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('cat');

  // We could use `category` to dynamically change the title, but for now we just render the static template.
  
  return (
    <div className="category-page">
      <Header />
      
      {/* Pass through the converted HTML block */}
      {/* CATEGORY HEADER START                         */}
{/* ============================================= */}
<section className="category-header">
    <div className="container category-header__container">
        <h1 className="category-header__title">Science &amp; Technology</h1>
        <p className="category-header__description">
            Explore the latest innovations, breakthroughs, and insights shaping our digital future.
        </p>

        {/* Subcategory filter buttons */}
        <div className="category-header__filters">
            <button className="category-header__filter-btn active">All</button>
            <button className="category-header__filter-btn">Ecosystems &amp; Devices</button>
            <button className="category-header__filter-btn">Audio &amp; Streaming</button>
            <button className="category-header__filter-btn">Software &amp; Tools</button>
            <button className="category-header__filter-btn">Tech Trends</button>
        </div>
    </div>
</section>
{/* ============================================= */}
{/* CATEGORY HEADER END                           */}
{/* ============================================= */}


{/* ============================================= */}
{/* CATEGORY POSTS GRID START — reuses .post-card  */}
{/* and .posts-grid from index.html, same markup,  */}
{/* just filtered to this category's posts +       */}
{/* Load More button, same as index.html           */}
{/* ============================================= */}
<section className="latest-posts-section">
    <div className="container">

        <div className="posts-grid">

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
                        <img loading="lazy" src="/assets/images/content/vr.jpg" alt="How AI is Shaping the Next Generation of Robotics" />
                    </Link>
                    <span className="post-card__badge">Artificial Intelligence</span>
                    <label className="post-card__save-btn" aria-label="Save post">
                        <input type="checkbox" className="post-card__save-input" />
                        <svg className="post-card__save-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path className="post-card__save-icon-path" d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z" fill="currentColor" fillOpacity="0" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                        </svg>
                    </label>
                </div>
                <Link to="/post" className="post-card__title-link">
                    <h3 className="post-card__title">How AI is Shaping the Next Generation of Robotics</h3>
                </Link>
                <div className="post-card__meta">
                    <span className="post-card__author">John Smith</span>
                    <span>·</span>
                    <time dateTime="2023-10-12">Oct 12, 2023</time>
                </div>
            </article>

            <article className="post-card">
                <div className="post-card__image">
                    <Link to="/post" className="post-card__image-link">
                        <img loading="lazy" src="/assets/images/content/vr.jpg" alt="The Evolution of Consumer Wearables in 2024" />
                    </Link>
                    <span className="post-card__badge">Hardware</span>
                    <label className="post-card__save-btn" aria-label="Save post">
                        <input type="checkbox" className="post-card__save-input" />
                        <svg className="post-card__save-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path className="post-card__save-icon-path" d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z" fill="currentColor" fillOpacity="0" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                        </svg>
                    </label>
                </div>
                <Link to="/post" className="post-card__title-link">
                    <h3 className="post-card__title">The Evolution of Consumer Wearables in 2024</h3>
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
                        <img loading="lazy" src="/assets/images/content/vr.jpg" alt="Building Resilient Systems for the Cloud Era" />
                    </Link>
                    <span className="post-card__badge">Software</span>
                    <label className="post-card__save-btn" aria-label="Save post">
                        <input type="checkbox" className="post-card__save-input" />
                        <svg className="post-card__save-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path className="post-card__save-icon-path" d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z" fill="currentColor" fillOpacity="0" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                        </svg>
                    </label>
                </div>
                <Link to="/post" className="post-card__title-link">
                    <h3 className="post-card__title">Building Resilient Systems for the Cloud Era</h3>
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
                        <img loading="lazy" src="/assets/images/content/vr.jpg" alt="Protecting Your Digital Identity in a Connected World" />
                    </Link>
                    <span className="post-card__badge">Cybersecurity</span>
                    <label className="post-card__save-btn" aria-label="Save post">
                        <input type="checkbox" className="post-card__save-input" />
                        <svg className="post-card__save-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path className="post-card__save-icon-path" d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z" fill="currentColor" fillOpacity="0" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                        </svg>
                    </label>
                </div>
                <Link to="/post" className="post-card__title-link">
                    <h3 className="post-card__title">Protecting Your Digital Identity in a Connected World</h3>
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
                        <img loading="lazy" src="/assets/images/content/vr.jpg" alt="Sustainable Tech: Greener Solutions for Tomorrow" />
                    </Link>
                    <span className="post-card__badge">Innovation</span>
                    <label className="post-card__save-btn" aria-label="Save post">
                        <input type="checkbox" className="post-card__save-input" />
                        <svg className="post-card__save-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path className="post-card__save-icon-path" d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z" fill="currentColor" fillOpacity="0" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                        </svg>
                    </label>
                </div>
                <Link to="/post" className="post-card__title-link">
                    <h3 className="post-card__title">Sustainable Tech: Greener Solutions for Tomorrow</h3>
                </Link>
                <div className="post-card__meta">
                    <span className="post-card__author">Jane Doe</span>
                    <span>·</span>
                    <time dateTime="2023-10-12">Oct 12, 2023</time>
                </div>
            </article>

        </div>

        <button className="load-more-btn">Load More Stories</button>

    </div>
</section>
{/* ============================================= */}
{/* CATEGORY POSTS GRID END                        */}
{/* ============================================= */}




      <Footer />
    </div>
  );
}
