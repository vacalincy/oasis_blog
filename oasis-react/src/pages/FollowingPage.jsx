import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function FollowingPage() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, {
        threshold: 0.5
    });

    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => observer.observe(slide));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="following-page">
      <Header />
      
      {/* SLIDES CONTAINER START                         */}
{/* ============================================= */}
<main className="following-feed">

    {/* Slide 1 */}
    <article className="slide">
        <div className="slide__bg">
            <img loading="lazy" src="/assets/images/content/modernbuildingfacade.jpg" alt="" className="slide__bg-blur" aria-hidden="true" />
            <img loading="lazy" src="/assets/images/content/modernbuildingfacade.jpg" alt="Modern building facade" className="slide__bg-image" />
        </div>
        <div className="slide__content">

            <div className="slide__author">
                {/* avatar + name/role are clickable, links to the author's profile */}
                <Link to="/profile" className="slide__author-badge">
                    <span className="avatar">ER</span>
                    <div className="slide__author-info">
                        <p>Elena Rostova</p>
                        <span>Architecture Critic</span>
                    </div>
                </Link>
                <span className="slide__new-badge">New</span>
            </div>

            <h2 className="slide__title">The Architecture of Silence: Designing for Empty Spaces</h2>
            <p className="slide__excerpt">In a world of constant noise, the ultimate luxury is a space engineered for complete and utter stillness.</p>

            <Link to="/post" className="slide__cta">Read Article</Link>

        </div>

        <div className="slide__scroll-hint">
            <span>Scroll to explore</span>
            <div className="slide__scroll-track">
                <div className="slide__scroll-highlight"></div>
            </div>
        </div>
    </article>

    {/* Slide 2 */}
    <article className="slide">
        <div className="slide__bg">
            <img loading="lazy" src="/assets/images/content/abstractcurvedlight.jpg" alt="" className="slide__bg-blur" aria-hidden="true" />
            <img loading="lazy" src="/assets/images/content/abstractcurvedlight.jpg" alt="Abstract curved light" className="slide__bg-image" />
        </div>
        <div className="slide__content">

            <div className="slide__author">
                <Link to="/profile" className="slide__author-badge">
                    <span className="avatar">MC</span>
                    <div className="slide__author-info">
                        <p>Marcus Chen</p>
                        <span>Design Theorist</span>
                    </div>
                </Link>
            </div>

            <h2 className="slide__title">Curvature &amp; Light: The Evolution of Modernism</h2>
            <p className="slide__excerpt">How parametric design is softening the rigid edges of the cities we inhabit.</p>

            <Link to="/post" className="slide__cta">Read Article</Link>

        </div>

        <div className="slide__scroll-hint">
            <span>Scroll to explore</span>
            <div className="slide__scroll-track">
                <div className="slide__scroll-highlight"></div>
            </div>
        </div>
    </article>

    {/* Slide 3 */}
    <article className="slide">
        <div className="slide__bg">
            <img loading="lazy" src="/assets/images/content/landscape-photo.jpg" alt="" className="slide__bg-blur" aria-hidden="true" />
            <img loading="lazy" src="/assets/images/content/landscape-photo.jpg" alt="Green rolling hills at sunset" className="slide__bg-image" />
        </div>
        <div className="slide__content">

            <div className="slide__author">
                <Link to="/profile" className="slide__author-badge">
                    <span className="avatar">SL</span>
                    <div className="slide__author-info">
                        <p>Sofia Lindqvist</p>
                        <span>Landscape Photographer</span>
                    </div>
                </Link>
            </div>

            <h2 className="slide__title">Chasing the Golden Hour: A Field Journal</h2>
            <p className="slide__excerpt">Notes from six months spent photographing the same valley in every season and every light.</p>

            <Link to="/post" className="slide__cta">Read Article</Link>

        </div>

        <div className="slide__scroll-hint">
            <span>Scroll to explore</span>
            <div className="slide__scroll-track">
                <div className="slide__scroll-highlight"></div>
            </div>
        </div>
    </article>

</main>
{/* ============================================= */}
{/* SLIDES CONTAINER END                           */}
{/* ============================================= */}




      <Footer />
    </div>
  );
}
