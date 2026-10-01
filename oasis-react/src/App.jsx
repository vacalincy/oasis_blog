import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation , Navigate } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import ScrollToTop from './components/ScrollToTop'
import LandingPage from './pages/LandingPage'
import DiscoverPage from './pages/DiscoverPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import PostPage from './pages/PostPage'
import CategoryPage from './pages/CategoryPage'
import ProfilePage from './pages/ProfilePage'
import FollowingPage from './pages/FollowingPage'
import PopularPage from './pages/PopularPage'
import TopicsPage from './pages/TopicsPage'
import AboutPage from './pages/AboutPage'
import NotificationsPage from './pages/NotificationsPage'
import DashboardPage from './pages/DashboardPage'
import AddPostPage from './pages/AddPostPage'
import SettingsPage from './pages/SettingsPage'
import SupportPage from './pages/SupportPage'
import ContactPage from './pages/ContactPage'
import './assets/css/legal.css'
import './index.css'
import './assets/css/style.css'
import './assets/css/landing.css'
import './assets/css/auth-modal.css'
import './assets/css/auth.css'
import './assets/css/post.css'
import './assets/css/category-post.css'
import './assets/css/profile.css'
import './assets/css/following.css'
import './assets/css/popular.css'
import './assets/css/topics.css'
import './assets/css/discover.css'


function ScrollObserver() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
    
    const revealSelectors = [
        '.section-header h2', '.category-title', '.category-description',
        '.filters', '.post-card', '.load-more-btn',
        '.post-body h3', '.post-body p', '.post-body blockquote', '.post-body img',
        '.pick-card', '.classics__title', '.classics__image', '.classics__content',
        '.discussions__title', '.discussions__item',
        '.post-header__title', '.post-header__badge', '.post-header__author',
        '.post-media__img', '.post-media__caption', '.popular-hero__title, .manifesto-label, .manifesto-text, .number-item, .about-hero__title, .about-hero__subtitle'
    ].join(', ');
    
    const revealElements = document.querySelectorAll(revealSelectors);
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            let delay = 0;
            let activeEntries = entries.filter(e => e.isIntersecting);
            
            activeEntries.forEach(entry => {
                // Remove the animation conflict for Popular Page
                // by using only the is-visible transition but staggering it.
                if (entry.target.classList.contains('pick-card')) {
                    entry.target.style.transitionDelay = `${0.3 + delay}s`;
                } else {
                    entry.target.style.transitionDelay = `${delay}s`;
                }
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
                delay += 0.08;
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
  console.log("App rendered with Settings Route!");
  return (
    <ToastProvider>
      <Router>
        <ScrollToTop />
        <ScrollObserver />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/post" element={<PostPage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/following" element={<FollowingPage />} />
          <Route path="/popular" element={<PopularPage />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/add-post" element={<AddPostPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ToastProvider>
  )
}

export default App
