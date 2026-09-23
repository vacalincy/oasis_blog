import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DiscoverPage from './pages/DiscoverPage'
import './index.css'
import './assets/css/style.css'
import './assets/css/landing.css'
import './assets/css/auth-modal.css'
import './assets/css/discover.css' // Import discover css


function ScrollObserver() {
  const location = useLocation();

  useEffect(() => {
    const revealSelectors = [
        '.section-header h2', '.category-title', '.category-description',
        '.filters', '.post-card', '.load-more-btn',
        '.post-body h3', '.post-body p', '.post-body blockquote', '.post-body img',
        '.pick-card', '.classics__title', '.classics__image', '.classics__content',
        '.discussions__title', '.discussions__item',
        '.post-header__title', '.post-header__badge', '.post-header__author',
        '.post-media__img', '.post-media__caption', '.popular-hero__title'
    ].join(', ');
    
    const revealElements = document.querySelectorAll(revealSelectors);
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // We don't unobserve so it re-triggers if needed, or we can unobserve
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(el => observer.observe(el));
        
        return () => observer.disconnect();
    }
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollObserver />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
      </Routes>
    </Router>
  )
}

export default App
