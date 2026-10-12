import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation , Navigate } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'
import ScrollToTop from './components/ScrollToTop'
import TabBar from './components/TabBar'
import LandingPage from './pages/LandingPage'
import OnboardingPage from './pages/OnboardingPage'
import DiscoverPage from './pages/DiscoverPage'
import SearchPage from './pages/SearchPage'
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
import ProtectedRoute from './components/ProtectedRoute'
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
import './assets/css/search.css'
import './assets/css/onboarding.css'
import './assets/css/dashboard.css'
import './assets/css/add-post.css'
import './assets/css/settings.css'
import './assets/css/about.css'
import './assets/css/notifications.css'
import './assets/css/contact.css'
import './assets/css/support.css'



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


import { useAuth } from './context/AuthContext'

function ProfileEnforcer({ children }) {
    const { user, profile, loading } = useAuth();
    const location = useLocation();
    
    useEffect(() => {
        if (loading) return;
        
        // If user is logged in but has no username/profile, they are new!
        // Redirect them to onboarding unless they are already there or on auth pages
        const isAuthPage = ['/', '/onboarding', '/terms', '/privacy'].includes(location.pathname);
        if (user && (!profile || !profile.username)) {
            if (!isAuthPage) {
                window.location.href = '/onboarding';
            }
        }
    }, [user, profile, loading, location]);
    
    return children;
}

function App() {
  console.log("App rendered with Settings Route!");
  return (
    <ToastProvider>
      <AuthProvider>
      <Router>
        <ScrollToTop />
        <ScrollObserver />
        <TabBar />
        <ProfileEnforcer>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/following" element={<FollowingPage />} />
          <Route path="/popular" element={<PopularPage />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/add-post" element={<ProtectedRoute><AddPostPage /></ProtectedRoute>} />
          <Route path="/edit-post/:id" element={<ProtectedRoute><AddPostPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </ProfileEnforcer>
      </Router>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
