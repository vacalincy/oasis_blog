import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function DiscoverPage() {
  return (
    <div className="discover-page">
      <Header />
      
      {/* FEATURED POST SECTION START                    */}
{/* ============================================= */}
<section className="featured-post-section">
    <div className="container">
        <div className="featured-post">

            {/* Left column: image, links to the full post */}
            <Link to="/post" className="featured-post__link">
                <img src="/assets/images/content/discover_main_pc.jpg" alt="Snowboarding" />
            </Link>

            {/* Right column: badge, title, text, author */}
            <div className="featured-post__content">

                {/* category badge, links to the category archive */}
                <Link to="/category?cat=sports" className="featured-post__badge">
                    <span className="featured-post__title">Action & Extreme</span>
                </Link>

                {/* title + text group */}
                <div className="featured-post__info">

                    {/* title also links to the full post, same as the image */}
                    <Link to="/post" className="featured-post__title-link">
                        <h2>Defying Gravity: The Art of High-Altitude Snowboarding</h2>
                    </Link>

                    <p>Experience the raw thrill of winter sports. From soaring above the halfpipe to mastering complex aerial maneuvers, elite snowboarders are constantly pushing the boundaries of what is humanly possible in sub-zero conditions.</p>

                </div>

                {/* author block, pinned to the bottom via CSS — links to the author's profile page */}
                <Link to="/profile" className="featured-post__author">
                    <img loading="lazy" src="/assets/images/icons/avatar.svg" alt="Julian Vance" />
                    <div className="featured-post__author__name">
                        <p><b>Julian Vance</b></p>
                        <time dateTime="2024-02-12">February 12, 2024</time>
                    </div>
                </Link>

            </div>

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
            <ul className="filters">
                <li><button className="filter-btn active" data-filter="all">All</button></li>
                <li><button className="filter-btn" data-filter="design">Design</button></li>
                <li><button className="filter-btn" data-filter="technology">Technology</button></li>
                <li><button className="filter-btn" data-filter="lifestyle">Lifestyle</button></li>
            </ul>
        </div>

        <div className="posts-grid">

            {/* post-card__image is a div (not a link) so the save button
                 doesn't get trapped inside an <a> and trigger navigation.
                 Save button uses the "checkbox hack": a hidden checkbox
                 stores the saved/not-saved state, styled via CSS only — no JS needed. */}
            <article className="post-card">
                <div className="post-card__image">
                    <Link to="/post" className="post-card__image-link">
                        <img loading="lazy" src="/assets/images/content/mainfeed1.jpg" alt="The New Wave of Motion Photography in Fashion" />
                    </Link>
                    <span className="post-card__badge">Photography &amp; Film</span>

                    <label className="post-card__save-btn" aria-label="Save post">
                        <input type="checkbox" className="post-card__save-input" />
                        <svg className="post-card__save-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path className="post-card__save-icon-path" d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z" fill="currentColor" fillOpacity="0" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                        </svg>
                    </label>
                </div>
                <Link to="/post" className="post-card__title-link">
                    <h3 className="post-card__title">The New Wave of Motion Photography in Fashion</h3>
                </Link>
                <div className="post-card__meta">
                    <span className="post-card__author">Elena Rossi</span>
                    <span>·</span>
                    <time dateTime="2023-11-14">Nov 14, 2023</time>
                </div>
            </article>

            <article className="post-card">
                <div className="post-card__image">
                    <Link to="/post" className="post-card__image-link">
                        <img loading="lazy" src="/assets/images/content/mainfeed2.jpg" alt="Conquering the Alpine Giants: A Solo Ascent" />
                    </Link>
                    <span className="post-card__badge">Travel &amp; Outdoors</span>

                    <label className="post-card__save-btn" aria-label="Save post">
                        <input type="checkbox" className="post-card__save-input" />
                        <svg className="post-card__save-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path className="post-card__save-icon-path" d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z" fill="currentColor" fillOpacity="0" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                        </svg>
                    </label>
                </div>
                <Link to="/post" className="post-card__title-link">
                    <h3 className="post-card__title">Conquering the Alpine Giants: A Solo Ascent</h3>
                </Link>
                <div className="post-card__meta">
                    <span className="post-card__author">David Chen</span>
                    <span>·</span>
                    <time dateTime="2023-12-02">Dec 02, 2023</time>
                </div>
            </article>

            <article className="post-card">
                <div className="post-card__image">
                    <Link to="/post" className="post-card__image-link">
                        <img loading="lazy" src="/assets/images/content/mainfeed3.jpg" alt="Brutalist Typography: Breaking the Grid in Print" />
                    </Link>
                    <span className="post-card__badge">Design &amp; Interfaces</span>

                    <label className="post-card__save-btn" aria-label="Save post">
                        <input type="checkbox" className="post-card__save-input" />
                        <svg className="post-card__save-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path className="post-card__save-icon-path" d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z" fill="currentColor" fillOpacity="0" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                        </svg>
                    </label>
                </div>
                <Link to="/post" className="post-card__title-link">
                    <h3 className="post-card__title">Brutalist Typography: Breaking the Grid in Print</h3>
                </Link>
                <div className="post-card__meta">
                    <span className="post-card__author">Sarah Jenkins</span>
                    <span>·</span>
                    <time dateTime="2024-01-28">Jan 28, 2024</time>
                </div>
            </article>

            <article className="post-card">
                <div className="post-card__image">
                    <Link to="/post" className="post-card__image-link">
                        <img loading="lazy" src="/assets/images/content/mainfeed4.jpg" alt="Vertical Ice: The Psychology of Crevasse Climbing" />
                    </Link>
                    <span className="post-card__badge">Action &amp; Extreme</span>

                    <label className="post-card__save-btn" aria-label="Save post">
                        <input type="checkbox" className="post-card__save-input" />
                        <svg className="post-card__save-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path className="post-card__save-icon-path" d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z" fill="currentColor" fillOpacity="0" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                        </svg>
                    </label>
                </div>
                <Link to="/post" className="post-card__title-link">
                    <h3 className="post-card__title">Vertical Ice: The Psychology of Crevasse Climbing</h3>
                </Link>
                <div className="post-card__meta">
                    <span className="post-card__author">David Chen</span>
                    <span>·</span>
                    <time dateTime="2024-02-05">Feb 05, 2024</time>
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

        </div>

        <button className="load-more-btn">Load More Stories</button>

    </div>
</section>

{/* ============================================= */}
{/* LATEST POSTS SECTION END                       */}
{/* ============================================= */}






      <Footer />
    </div>
  );
}
