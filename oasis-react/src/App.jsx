import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
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
import QrAuthPage from './pages/QrAuthPage'
import CookiePolicyPage from './pages/CookiePolicyPage'
import CookieBanner from './components/CookieBanner'
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

    // Dynamic document title based on current route
    const routeTitles = {
      '/': 'OASIS — Read, Share & Explore Stories',
      '/discover': 'Discover Stories — OASIS',
      '/following': 'Following Feed — OASIS',
      '/popular': 'Popular Stories & Discussions — OASIS',
      '/topics': 'Topics & Themes — OASIS',
      '/about': 'About OASIS — A Curated Digital Space',
      '/dashboard': 'Your Dashboard — OASIS',
      '/add-post': 'Write a Story — OASIS',
      '/notifications': 'Notifications — OASIS',
      '/settings': 'Settings & Account — OASIS',
      '/support': 'Help Center & FAQ — OASIS',
      '/contact': 'Contact Support — OASIS',
      '/terms': 'Terms of Service — OASIS',
      '/privacy': 'Privacy Policy — OASIS',
      '/onboarding': 'Welcome to OASIS — Onboarding',
      '/forgot-password': 'Reset Password — OASIS',
      '/reset-password': 'Create New Password — OASIS',
      '/qr-auth': 'Approve Login — OASIS',
      '/cookies': 'Cookie Policy — OASIS'
    };

    if (routeTitles[location.pathname]) {
      document.title = routeTitles[location.pathname];
    } else if (location.pathname.startsWith('/edit-post/')) {
      document.title = 'Edit Story — OASIS';
    }
    
    const revealSelectors = [
      '.section-header h2', '.category-title', '.category-description',
      '.filters', '.post-card', '.load-more-btn',
      '.post-body h3', '.post-body p', '.post-body blockquote', '.post-body img',
      '.classics__title', '.classics__image', '.classics__content',
      '.discussions__title', '.discussions__item',
      '.post-header__title', '.post-header__badge', '.post-header__author',
      '.post-media__img', '.post-media__caption',
      '.popular-hero__title', '.manifesto-label', '.manifesto-text',
      '.number-item', '.about-hero__title', '.about-hero__subtitle'
    ].join(', ');
    
    const observer = new IntersectionObserver((entries) => {
      let delay = 0;
      const activeEntries = entries.filter(e => e.isIntersecting);
      
      activeEntries.forEach(entry => {
        entry.target.style.transitionDelay = `${delay}s`;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
        delay += 0.08;
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -40px 0px'
    });

    const observedSet = new WeakSet();
    const observeAll = () => {
      const elements = document.querySelectorAll(revealSelectors);
      elements.forEach(el => {
        if (!observedSet.has(el) && !el.classList.contains('is-visible')) {
          observedSet.add(el);
          observer.observe(el);
        }
      });
    };

    observeAll();
    const t1 = setTimeout(observeAll, 150);
    const t2 = setTimeout(observeAll, 500);

    const mutationObserver = new MutationObserver(() => {
      observeAll();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]);

  return null;
}


import { useAuth } from './context/AuthContext'
import { useToast } from './context/ToastContext'

function SupabaseAuthCallbackListener() {
  const addToast = useToast();

  useEffect(() => {
    // Check hash for Supabase auth responses / errors
    const hash = window.location.hash;
    if (hash) {
      try {
        const params = new URLSearchParams(hash.replace(/^#/, ''));
        const errorDesc = params.get('error_description');
        const errorCode = params.get('error_code');
        const type = params.get('type');

        if (errorDesc) {
          const decoded = decodeURIComponent(errorDesc.replace(/\+/g, ' '));
          if (errorCode === 'otp_expired') {
            addToast('This verification link has already been used or expired. Please request a new link from your computer.', 'error');
          } else {
            addToast(decoded, 'error');
          }
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        } else if (type === 'email_change' || hash.includes('type=email_change')) {
          addToast('Your email address has been successfully confirmed and updated!', 'success');
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      } catch (e) {
        console.error('Error parsing auth hash:', e);
      }
    }

    // Also check query search params for errors (?error=...)
    if (window.location.search) {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const searchError = searchParams.get('error_description');
        if (searchError) {
          addToast(decodeURIComponent(searchError.replace(/\+/g, ' ')), 'error');
          searchParams.delete('error');
          searchParams.delete('error_code');
          searchParams.delete('error_description');
          const cleanSearch = searchParams.toString() ? `?${searchParams.toString()}` : '';
          window.history.replaceState(null, '', window.location.pathname + cleanSearch);
        }
      } catch (e) {
        console.error('Error parsing search params:', e);
      }
    }
  }, [addToast]);

  return null;
}

function ProfileEnforcer({ children }) {
    const { user, profile, loading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (loading) return;
        
        // If user is logged in but has no username/profile, they are new!
        // Redirect them to onboarding unless they are already there or on auth pages
        const isAuthPage = ['/', '/onboarding', '/terms', '/privacy', '/cookies', '/forgot-password', '/reset-password', '/qr-auth'].includes(location.pathname);
        if (user && (!profile || !profile.username)) {
            if (!isAuthPage) {
                navigate('/onboarding', { replace: true });
            }
        }
    }, [user, profile, loading, location, navigate]);
    
    return children;
}

function App() {
  console.log("App rendered with Settings Route!");
  return (
    <ToastProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <ScrollToTop />
            <ScrollObserver />
            <SupabaseAuthCallbackListener />
            <TabBar />
            <CookieBanner />
            <ProfileEnforcer>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/cookies" element={<CookiePolicyPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/post" element={<Navigate to="/discover" replace />} />
              <Route path="/post/:id" element={<PostPage />} />
              <Route path="/category" element={<CategoryPage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/following" element={<ProtectedRoute><FollowingPage /></ProtectedRoute>} />
              <Route path="/popular" element={<ProtectedRoute><PopularPage /></ProtectedRoute>} />
              <Route path="/topics" element={<ProtectedRoute><TopicsPage /></ProtectedRoute>} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/add-post" element={<ProtectedRoute><AddPostPage /></ProtectedRoute>} />
              <Route path="/edit-post/:id" element={<ProtectedRoute><AddPostPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/qr-auth" element={<QrAuthPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            </ProfileEnforcer>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
