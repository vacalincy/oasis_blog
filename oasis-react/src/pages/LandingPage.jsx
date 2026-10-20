import React, { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { supabase } from '../supabaseClient';
import { useToast } from '../context/ToastContext';
import '../assets/css/qr-auth.css';

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [dob, setDob] = useState(null);
  const [showYearGrid1, setShowYearGrid1] = useState(false);
  const [showYearGrid2, setShowYearGrid2] = useState(false);
  const datePickerRef1 = useRef(null);
  const datePickerRef2 = useRef(null);
  const addToast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [showcasePostId, setShowcasePostId] = useState(null);

  // QR Login State
  const [_qrSessionId, setQrSessionId] = useState(null);
  const [qrStatus, setQrStatus] = useState('idle'); // 'idle' | 'loading' | 'ready' | 'approved' | 'declined' | 'expired'
  const [qrAuthUrl, setQrAuthUrl] = useState('');
  const [_qrTimeLeft, setQrTimeLeft] = useState(300);
  const qrChannelRef = useRef(null);
  const qrPollRef = useRef(null);
  const qrTimerRef = useRef(null);

  const cleanupQrSession = useCallback(() => {
    if (qrChannelRef.current) {
      supabase.removeChannel(qrChannelRef.current);
      qrChannelRef.current = null;
    }
    if (qrPollRef.current) {
      clearInterval(qrPollRef.current);
      qrPollRef.current = null;
    }
    if (qrTimerRef.current) {
      clearInterval(qrTimerRef.current);
      qrTimerRef.current = null;
    }
  }, []);

  const initQrSession = useCallback(async () => {
    cleanupQrSession();

    const sessionId = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : 'qr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);

    const lanIp = import.meta.env.VITE_DEV_LAN_IP;
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const effectiveOrigin = (isLocalhost && lanIp)
      ? `${window.location.protocol}//${lanIp}:${window.location.port || '5173'}`
      : window.location.origin;

    const qrTargetUrl = `${effectiveOrigin}/qr-auth?session=${sessionId}`;

    setQrSessionId(sessionId);
    setQrAuthUrl(qrTargetUrl);
    setQrStatus('loading');
    setQrTimeLeft(300);

    try {
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
      const { error } = await supabase.from('qr_logins').insert({
        session_id: sessionId,
        status: 'pending',
        expires_at: expiresAt
      });

      if (error) {
        console.error('Failed to register QR session:', error);
      }

      setQrStatus('ready');

      // 5-minute countdown
      qrTimerRef.current = setInterval(() => {
        setQrTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(qrTimerRef.current);
            cleanupQrSession();
            setQrStatus('expired');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Handler for updates from Realtime or polling
      const handleStatusUpdate = async (record) => {
        if (!record || record.session_id !== sessionId) return;

        if (record.status === 'approved' && record.access_token && record.refresh_token) {
          cleanupQrSession();
          setQrStatus('approved');
          addToast('Login approved via QR code! Welcome to OASIS.', 'success');

          try {
            await supabase.auth.setSession({
              access_token: record.access_token,
              refresh_token: record.refresh_token
            });
            // Clean up the temporary row from DB
            await supabase.from('qr_logins').delete().eq('session_id', sessionId);
          } catch (sessionErr) {
            console.error('Error establishing session from QR:', sessionErr);
          }

          setTimeout(() => {
            setShowLogin(false);
            navigate('/discover');
          }, 800);
        } else if (record.status === 'declined') {
          cleanupQrSession();
          setQrStatus('declined');
          addToast('QR login was declined on mobile device.', 'info');
        } else if (record.status === 'expired') {
          cleanupQrSession();
          setQrStatus('expired');
        }
      };

      // 1. Supabase Realtime channel
      try {
        qrChannelRef.current = supabase
          .channel(`qr-login-${sessionId}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'qr_logins',
              filter: `session_id=eq.${sessionId}`
            },
            (payload) => {
              handleStatusUpdate(payload.new);
            }
          )
          .subscribe();
      } catch (rtErr) {
        console.warn('Realtime subscription error for QR:', rtErr);
      }

      // 2. Dependable polling backup (every 2.5s)
      qrPollRef.current = setInterval(async () => {
        try {
          const { data } = await supabase
            .from('qr_logins')
            .select('*')
            .eq('session_id', sessionId)
            .maybeSingle();

          if (data) {
            handleStatusUpdate(data);
          }
        } catch (pollErr) {
          console.error('QR polling check error:', pollErr);
        }
      }, 2500);

    } catch (err) {
      console.error('QR init exception:', err);
      setQrStatus('ready');
    }
  }, [cleanupQrSession, addToast, navigate]);

  useEffect(() => {
    if (showLogin) {
      initQrSession();
    } else {
      cleanupQrSession();
      setQrStatus('idle');
    }

    return () => {
      cleanupQrSession();
    };
  }, [showLogin, initQrSession, cleanupQrSession]);

  useEffect(() => {
    let isMounted = true;
    const fetchShowcasePost = async () => {
      try {
        const { data: snowPost } = await supabase
          .from('posts')
          .select('id')
          .or('title.ilike.%snowboard%,title.ilike.%gravity%')
          .eq('status', 'published')
          .limit(1)
          .maybeSingle();

        if (snowPost && isMounted) {
          setShowcasePostId(snowPost.id);
          return;
        }

        const { data: latestPost } = await supabase
          .from('posts')
          .select('id')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (latestPost && isMounted) {
          setShowcasePostId(latestPost.id);
        }
      } catch (err) {
        console.error('Failed to fetch showcase post:', err);
      }
    };

    fetchShowcasePost();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const authAction = params.get('auth');
    if (authAction === 'login' || location.state?.openLogin) {
      setShowLogin(true);
      setShowSignup(false);
    } else if (authAction === 'signup' || location.state?.openSignup) {
      setShowSignup(true);
      setShowLogin(false);
    }
  }, [location]);

// Robust date formatter supporting ISO, US (MM/DD/YYYY) and European (DD.MM.YYYY / DD/MM/YYYY)
const formatToDateInput = (val) => {
  if (!val) return '';
  if (typeof val === 'string') {
    val = val.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    const dmyMatch = val.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})$/);
    if (dmyMatch) {
      const first = parseInt(dmyMatch[1], 10);
      const second = parseInt(dmyMatch[2], 10);
      const year = dmyMatch[3];
      if (second <= 12 && first <= 31) {
        return `${year}-${String(second).padStart(2, '0')}-${String(first).padStart(2, '0')}`;
      } else if (first <= 12 && second <= 31) {
        return `${year}-${String(first).padStart(2, '0')}-${String(second).padStart(2, '0')}`;
      }
    }
    const ymdMatch = val.match(/^(\d{4})[./](\d{1,2})[./](\d{1,2})$/);
    if (ymdMatch) {
      return `${ymdMatch[1]}-${ymdMatch[2].padStart(2, '0')}-${ymdMatch[3].padStart(2, '0')}`;
    }
  }
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
};

  const handleSignup = async (formElement) => {
    try {
        setIsLoading(true);

        const formDobVal = formElement.dob?.value;
        const targetDate = dob || formDobVal;

        if (!targetDate) {
            addToast('Please select your date of birth.', 'error');
            setIsLoading(false);
            return;
        }

        const dobFormatted = formatToDateInput(targetDate);

        // Validate age (minimum 13 years old)
        if (dobFormatted) {
            const birthDate = new Date(dobFormatted);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 13) {
                addToast('You must be at least 13 years old to register.', 'error');
                setIsLoading(false);
                return;
            }
        }
        
        const email = formElement.email.value;
        const password = formElement.password.value;
        
        // Cache in localStorage as a bulletproof fallback for onboarding & settings
        if (dobFormatted) {
            try {
                localStorage.setItem('oasis_registration_dob', dobFormatted);
            } catch {
                // Ignore storage write error
            }
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/onboarding`,
            data: {
              dob: dobFormatted,
              date_of_birth: dobFormatted
            }
          }
        });
        
        setIsLoading(false);
        
        if (error) {
          addToast(error.message, 'error');
        } else if (!data.session) {
          addToast('Check your email for the confirmation link, or log in if you already have an account.', 'success');
        } else {
          addToast('Welcome to OASIS!', 'success');
          setShowSignup(false);
          navigate('/onboarding');
        }
    } catch (err) {
        console.error("Signup error:", err);
        addToast("An unexpected error occurred.", "error");
        setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    if (error) {
      addToast('Error logging in with Google: ' + error.message, 'error');
    }
  };

  const handleLogin = async (formElement) => {
    setIsLoading(true);
    const email = formElement.email.value;
    const password = formElement.password.value;
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    setIsLoading(false);
    
    if (error) {
      addToast(error.message, 'error'); alert('Supabase Error: ' + error.message);
    } else {
      addToast('Welcome back!', 'success');
      setShowLogin(false);
      navigate('/discover');
    }
  };

  
  useEffect(() => {
    // Inject the GSAP script properly
    const script = document.createElement('script');
    script.src = '/assets/js/landing-scroll.js';
    script.async = true;
    script.onload = () => {
        if (window.initLandingAnimations) {
            window.initLandingAnimations();
        }
    };
    document.body.appendChild(script);

    return () => {
      // Clean up script if component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      // Also kill ScrollTriggers to prevent duplication
      if (window.ScrollTrigger) {
          window.ScrollTrigger.getAll().forEach(t => t.kill());
      }
      document.body.removeAttribute('data-landing-anim');
    };
  }, []);

  return (
    <div className="landing-page-wrapper">
      <nav className="landing-nav">
    <div className="container landing-nav__container">
        <Link to="/" className="landing-nav__logo" onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }}>
            <img src="/assets/images/brand/logo.svg" alt="OASIS Logo" width="96" height="32" />
        </Link>
        <div className="landing-nav__actions">
            <button type="button" className="landing-nav__login" onClick={() => setShowLogin(true)}>Log in</button>
            <button type="button" className="landing-nav__signup" onClick={() => setShowSignup(true)}>Sign up</button>
        </div>
    </div>
</nav>

<main id="main-content" className="landing-main">

{/* ============================================= */}
{/* SCROLL UNIVERSE (GSAP Pinned Section)         */}
{/* ============================================= */}
<div id="scroll-universe" className="scroll-universe">

    {/* Hero & Floating Cards */}
    <div className="cards-intro">
        <h1 className="cards-intro__title">A place to display your <br />masterpiece.</h1>

        <div className="cards-intro__content">
            <img src="/assets/images/content/landing_p1.jpg" alt="Artwork 1" className="cards-intro__card cards-intro__card--1" width="190" height="190" fetchpriority="high" />
            <img src="/assets/images/content/landing_p2.jpg" alt="Artwork 2" className="cards-intro__card cards-intro__card--2" width="190" height="190" />
            <img src="/assets/images/content/landing_p3.jpg" alt="Artwork 3" className="cards-intro__card cards-intro__card--3" width="190" height="190" />
            <img src="/assets/images/content/landing_p4.jpg" alt="Artwork 4" className="cards-intro__card cards-intro__card--4" width="190" height="190" />
            <img src="/assets/images/content/landing_p5.jpg" alt="Artwork 5" className="cards-intro__card cards-intro__card--5" width="190" height="190" />
            <img src="/assets/images/content/landing_p6.jpg" alt="Artwork 6" className="cards-intro__card cards-intro__card--6" width="190" height="190" />

            <span className="cards-intro__bubble cards-intro__bubble--left">Awesome!</span>
            <span className="cards-intro__bubble cards-intro__bubble--right">Nice!</span>
            <span className="cards-intro__bubble cards-intro__bubble--cascade">@vacalincy</span>
        </div>

        <div className="cards-intro__footer">
            <h2 className="cards-intro__subtitle">Writers share their insights, and readers discover stories about <br />design, code, and modern culture.</h2>
            <div className="cards-intro__button-group">
                <button type="button" className="cards-intro__btn cards-intro__btn--primary" onClick={() => setShowSignup(true)}>Join for free</button>
                <Link to="/discover" className="cards-intro__btn cards-intro__btn--secondary">Explore stories</Link>
            </div>
        </div>
    </div>

    {/* Editorial Cascade Block */}
    <section className="cascade">
        <div className="container cascade__container">
            <div className="cascade__text">
                <span className="cascade__badge">Curated Publication</span>
                <h2 className="cascade__title">Read, share, <br />&amp; explore stories <br />in one place.</h2>
                <p className="cascade__description">A dynamic ecosystem where designers, developers, and writers seamlessly merge. Oasis brings together creators and enthusiasts to share deep insights.</p>
            </div>
        </div>
    </section>

</div>

{/* ============================================= */}
{/* SECTION 6: VISUAL SHOWCASE & TRUST            */}
{/* ============================================= */}
<section className="showcase">
    <div className="container">
        <h2 className="showcase__big-title">A curated space to share <span>your</span> <br /> creative vision.</h2>
        <div className="showcase__media">
            <img src="/assets/images/content/snowboard.jpg" alt="Snowboarder carving through deep powder" className="showcase__image" width="1199" height="800" loading="lazy" />
            <Link to={showcasePostId ? `/post/${showcasePostId}` : '/discover'} className="showcase__preview-card">
                <div className="showcase__preview-content">
                    <span className="showcase__preview-badge">Action &amp; Extreme</span>
                    <h3 className="showcase__preview-title">Defying Gravity: The Art of High-Altitude Snowboarding</h3>
                    <p className="showcase__preview-excerpt">Exploring the untouched powder and breathtaking drops of the world's most remote alpine peaks.</p>
                </div>
                <span className="showcase__preview-arrow" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </span>
            </Link>
        </div>
        <div className="showcase__trust">
            <h2 className="showcase__trust-title">Trusted by <span>The Best.</span></h2>
            <p className="showcase__trust-description">Join thousands of curious minds who rely on OASIS for deep dives into design systems, technical photography, and culture.</p>
        </div>
    </div>
</section>

{/* ============================================= */}
{/* SECTION 7: FINAL SIGNUP CTA                   */}
{/* ============================================= */}
<section className="signup-cta">
    <div className="signup-cta__container">
        <div className="signup-cta__text">
            <h2 className="signup-cta__title">Start your reading <br />journey today.</h2>
            <p className="signup-cta__description">Become part of a quiet digital space designed for curious minds, creators, and deep readers.</p>
        </div>
        <div className="signup-cta__form">
            <div className="signup-cta__form-header">
                <img src="/assets/images/brand/favicon-label.png" alt="OASIS" className="signup-cta__form-icon" width="64" height="64" />
                <p className="signup-cta__form-headline">Join Oasis for free to discover more ideas and stories.</p>
            </div>
            <form className="signup-cta__fields" onSubmit={(e) => e.preventDefault()}>
                <div className="signup-cta__field">
                    <label htmlFor="signup-email" className="sr-only">Email address</label>
                    <input type="email" id="signup-email" name="email" placeholder="Email address" required />
                </div>
                <div className="signup-cta__field signup-cta__field--password">
                    <label htmlFor="signup-password" className="sr-only">Password</label>
                    <input type="password" id="signup-password" name="password" placeholder="Password" required minLength="8" />
                    <span className="validation-message">Minimum 8 characters</span>
                </div>
                <div className="signup-cta__field">
                    <label htmlFor="signup-dob" className="sr-only">Date of birth</label>
                    <div className="auth-modal__input-wrap">
                        <DatePicker selected={dob} onChange={(date) => { setDob(date); if (showYearGrid2) setShowYearGrid2(false); }} id="signup-dob" name="dob" placeholderText="Date of birth (MM/DD/YYYY)" required ref={datePickerRef2} maxDate={new Date()} popperPlacement="bottom-start" popperModifiers={[ { name: "flip", enabled: false }, { name: "offset", options: { offset: [0, 15] } } ]} showYearPicker={showYearGrid2} showMonthYearDropdown={false} shouldCloseOnSelect={!showYearGrid2} renderCustomHeader={({ date, decreaseMonth, increaseMonth, decreaseYear, increaseYear, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px 12px' }}>
            <button type="button" onClick={() => setShowYearGrid2(!showYearGrid2)} style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', color: 'var(--color-primary-dark)', fontSize: '1.1rem', background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}>
                {showYearGrid2 ? date.getFullYear() : date.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                <span style={{ marginLeft: '6px', fontSize: '1.2rem', color: 'var(--color-primary)' }}>›</span>
            </button>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button type="button" onClick={showYearGrid2 ? decreaseYear : decreaseMonth} disabled={prevMonthButtonDisabled} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontSize: '1.2rem', padding: 0, outline: 'none' }}>{'<'}</button>
              <button type="button" onClick={showYearGrid2 ? increaseYear : increaseMonth} disabled={nextMonthButtonDisabled} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontSize: '1.2rem', padding: 0, outline: 'none' }}>{'>'}</button>
            </div>
          </div>
        )} />
                        <button type="button" className="auth-modal__icon-btn" aria-label="Open calendar" onClick={() => datePickerRef2.current?.setOpen(true)} style={{position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', outline: 'none'}}>
                            <span className="dynamic-icon" style={{ WebkitMaskImage: 'url(/assets/images/icons/dateofbirth.svg)', width: '20px', height: '20px', backgroundColor: 'var(--color-text-light)' }}></span>
                        </button>
                    </div>
                </div>
                
                <div className="custom-checkbox-wrapper" style={{ marginTop: '8px' }}>
                    <input type="checkbox" id="signup-age-check" name="ageCheck" required className="custom-checkbox-input" />
                    <label htmlFor="signup-age-check" className="custom-checkbox-label">I confirm that I am at least 13 years old</label>
                </div>
                <button type="button" className="signup-cta__submit-btn react-datepicker-ignore-onclickoutside" disabled={isLoading} onClick={(e) => {
                    const form = e.target.closest('form');
                    if (form.checkValidity()) {
                        e.preventDefault();
                        handleSignup(form);
                    } else {
                        form.reportValidity();
                    }
                }}>Continue</button>
                <div className="signup-cta__divider"><span>or</span></div>
                <button type="button" className="signup-cta__google-btn react-datepicker-ignore-onclickoutside" onClick={handleGoogleLogin}>
                    <img src="/assets/images/brand/Google - Original.png" alt="Google Logo" className="signup-cta__google-icon" width="18" height="18" loading="lazy" />
                    Continue with Google
                </button>
                <p className="signup-cta__login-link">Already have an account? <button type="button" className="landing-nav__login" onClick={() => setShowLogin(true)}>Log in</button></p>
                <p className="signup-cta__legal">By continuing, you agree to Oasis's <Link to="/terms">Terms of Service</Link> and acknowledge you've read our <Link to="/privacy">Privacy Policy</Link>.</p>
            </form>
        </div>
    </div>
</section>
</main>

{/* ============================================= */}
{/* AUTH MODALS (LOGIN & SIGNUP)                  */}
{/* ============================================= */}

{/* 1. LOGIN MODAL (Wide layout with QR code, portaled to document.body) */}
{showLogin && createPortal(
<div className="auth-modal is-active" id="loginModal">
    <div className="auth-modal__overlay" onClick={() => setShowLogin(false)}></div>
    <div className="auth-modal__container auth-modal__container--wide">
        <button className="auth-modal__close" onClick={() => setShowLogin(false)} aria-label="Close modal">✕</button>

        {/* Left Column: Login Form */}
        <div className="auth-modal__left">
            <img src="/assets/images/brand/favicon-label.png" alt="Oasis Logo" className="auth-modal__logo" width="64" height="64" />
            <h2 className="auth-modal__title">Welcome to OASIS</h2>
            <p className="auth-modal__subtitle">Log in to discover more ideas just for you</p>

            <form className="auth-modal__form" onSubmit={(e) => e.preventDefault()}>
                <div className="auth-modal__field auth-modal__field--labeled">
                    <label htmlFor="modal-login-email">Email</label>
                    <input type="email" id="modal-login-email" name="email" placeholder="name@example.com" required autoComplete="off" />
                </div>

                <div className="auth-modal__field auth-modal__field--labeled">
                    <label htmlFor="modal-login-password">Password</label>
                    <div className="auth-modal__input-wrap">
                        <input type={showLoginPassword ? "text" : "password"} id="modal-login-password" name="password" placeholder="Enter your password" required minLength="8" autoComplete="new-password" />
                        <button type="button" className="auth-modal__icon-btn" aria-label="Toggle password visibility" onClick={() => setShowLoginPassword(!showLoginPassword)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                    </div>
                    <span className="validation-message">Minimum 8 characters</span>
                </div>

                <Link to="/forgot-password" className="auth-modal__forgot">forgotten password?</Link>

                <button type="button" className="auth-modal__submit react-datepicker-ignore-onclickoutside" disabled={isLoading} onClick={(e) => {
                    const form = e.target.closest('form');
                    if (form.checkValidity()) {
                        e.preventDefault();
                        handleLogin(form);
                    } else {
                        form.reportValidity();
                    }
                }}>Log In</button>

                <div className="auth-modal__divider"><span>OR</span></div>

                <button type="button" className="auth-modal__google react-datepicker-ignore-onclickoutside" onClick={handleGoogleLogin}>
                    <img src="/assets/images/brand/Google - Original.png" alt="Google icon" className="auth-modal__google-icon" width="18" height="18" loading="lazy" />
                    Continue with Google
                </button>
            </form>

            <p className="auth-modal__legal">
                By continuing, you agree to the <Link to="/terms">Terms of Service</Link><br /> and <Link to="/privacy">Privacy Policy</Link>.
            </p>
        </div>

        {/* Right Column: QR Code Scan (Figma glassmorphism) */}
        <div className="auth-modal__right">
            <div className="auth-modal__qr-box">
                {qrStatus === 'loading' && (
                    <div className="auth-modal__qr-loader">
                        <div className="auth-modal__spinner"></div>
                        <span>Preparing QR code...</span>
                    </div>
                )}

                {qrStatus === 'ready' && (
                    <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=6&data=${encodeURIComponent(qrAuthUrl)}`} 
                        alt="Scan QR code to log in" 
                        className="auth-modal__qr-image" 
                        onError={(e) => {
                            e.currentTarget.src = '/assets/images/brand/qr.png';
                        }}
                    />
                )}

                {qrStatus === 'approved' && (
                    <div className="auth-modal__qr-state" style={{ color: '#16a34a' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Approved! Logging in...</span>
                    </div>
                )}

                {qrStatus === 'declined' && (
                    <div className="auth-modal__qr-state" style={{ color: '#dc2626' }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        <span>Request Declined</span>
                        <button type="button" onClick={initQrSession} className="auth-modal__qr-refresh-btn">
                            Try Again
                        </button>
                    </div>
                )}

                {qrStatus === 'expired' && (
                    <div className="auth-modal__qr-state">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>QR Code Expired</span>
                        <button type="button" onClick={initQrSession} className="auth-modal__qr-refresh-btn">
                            Refresh QR
                        </button>
                    </div>
                )}
            </div>

            <p className="auth-modal__qr-text">
                Or, log in instantly by scanning code<br />with your phone.
            </p>
        </div>
    </div>
</div>,
document.body
)}

{/* 2. SIGN UP MODAL (Narrow layout, pill buttons, portaled to document.body) */}
{showSignup && createPortal(
<div className="auth-modal is-active" id="signupModal">
    <div className="auth-modal__overlay" onClick={() => setShowSignup(false)}></div>
    <div className="auth-modal__container auth-modal__container--narrow">
        <button className="auth-modal__close" onClick={() => setShowSignup(false)} aria-label="Close modal">✕</button>

        {/* Full Width Column: Registration Form */}
        <div className="auth-modal__left auth-modal__left--full">
            <img src="/assets/images/brand/favicon-label.png" alt="Oasis Logo" className="auth-modal__logo" width="64" height="64" />
            <h2 className="auth-modal__title">Welcome to OASIS</h2>
            <p className="auth-modal__subtitle">Sign up to discover more ideas<br />just for you.</p>

            <form className="auth-modal__form" onSubmit={(e) => e.preventDefault()}>
                <div className="auth-modal__field">
                    <label htmlFor="modal-signup-email" className="sr-only">Email address</label>
                    <input type="email" id="modal-signup-email" name="email" placeholder="Email address" required />
                </div>

                <div className="auth-modal__field">
                    <label htmlFor="modal-signup-password" className="sr-only">Password</label>
                    <div className="auth-modal__input-wrap">
                        <input type={showSignupPassword ? "text" : "password"} id="modal-signup-password" name="password" placeholder="Password" required minLength="8" />
                        <button type="button" className="auth-modal__icon-btn" aria-label="Toggle password visibility" onClick={() => setShowSignupPassword(!showSignupPassword)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                    </div>
                    <span className="validation-message">Minimum 8 characters</span>
                </div>

                <div className="auth-modal__field">
                    <label htmlFor="modal-signup-dob" className="sr-only">Date of birth</label>
                    <div className="auth-modal__input-wrap">
                        <DatePicker selected={dob} onChange={(date) => { setDob(date); if (showYearGrid1) setShowYearGrid1(false); }} id="modal-signup-dob" name="dob" placeholderText="Date of birth (MM/DD/YYYY)" required ref={datePickerRef1} maxDate={new Date()} popperPlacement="bottom-start" popperModifiers={[ { name: "flip", enabled: false }, { name: "offset", options: { offset: [0, 15] } } ]} showYearPicker={showYearGrid1} showMonthYearDropdown={false} shouldCloseOnSelect={!showYearGrid1} renderCustomHeader={({ date, decreaseMonth, increaseMonth, decreaseYear, increaseYear, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px 12px' }}>
            <button type="button" onClick={() => setShowYearGrid1(!showYearGrid1)} style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', color: 'var(--color-primary-dark)', fontSize: '1.1rem', background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}>
                {showYearGrid1 ? date.getFullYear() : date.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                <span style={{ marginLeft: '6px', fontSize: '1.2rem', color: 'var(--color-primary)' }}>›</span>
            </button>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button type="button" onClick={showYearGrid1 ? decreaseYear : decreaseMonth} disabled={prevMonthButtonDisabled} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontSize: '1.2rem', padding: 0, outline: 'none' }}>{'<'}</button>
              <button type="button" onClick={showYearGrid1 ? increaseYear : increaseMonth} disabled={nextMonthButtonDisabled} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontSize: '1.2rem', padding: 0, outline: 'none' }}>{'>'}</button>
            </div>
          </div>
        )} />
                        <button type="button" className="auth-modal__icon-btn" aria-label="Open calendar" onClick={() => datePickerRef1.current?.setOpen(true)} style={{ outline: 'none' }}>
                            <span className="dynamic-icon" style={{ WebkitMaskImage: 'url(/assets/images/icons/dateofbirth.svg)', width: '20px', height: '20px' }}></span>
                        </button>
                    </div>
                </div>
                
                <div className="custom-checkbox-wrapper">
                    <input type="checkbox" id="modal-signup-age-check" name="ageCheck" required className="custom-checkbox-input" />
                    <label htmlFor="modal-signup-age-check" className="custom-checkbox-label">I confirm that I am at least 13 years old</label>
                </div>

                <button type="button" className="auth-modal__submit react-datepicker-ignore-onclickoutside" disabled={isLoading} onClick={(e) => {
                    const form = e.target.closest('form');
                    if (form.checkValidity()) {
                        e.preventDefault();
                        handleSignup(form);
                    } else {
                        form.reportValidity();
                    }
                }}>Continue</button>

                <div className="auth-modal__divider"><span>OR</span></div>

                <button type="button" className="auth-modal__google react-datepicker-ignore-onclickoutside" onClick={handleGoogleLogin}>
                    <img src="/assets/images/brand/Google - Original.png" alt="Google icon" className="auth-modal__google-icon" width="18" height="18" loading="lazy" />
                    Continue with Google
                </button>
            </form>

            <p className="auth-modal__legal">
                By continuing, you agree to the <Link to="/terms">Terms of Service</Link><br /> and <Link to="/privacy">Privacy Policy</Link>.
            </p>
        </div>
    </div>
</div>,
document.body
)}

{/* ============================================= */}

    </div>
  );
}
