import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  
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
            <img src="/assets/images/brand/logo.svg" alt="OASIS Logo" />
        </Link>
        <div className="landing-nav__actions">
            <button type="button" className="landing-nav__login" onClick={() => setShowLogin(true)}>Log in</button>
            <button type="button" className="landing-nav__signup" onClick={() => setShowSignup(true)}>Sign up</button>
        </div>
    </div>
</nav>

{/* ============================================= */}

{/* ============================================= */}
{/* SCROLL UNIVERSE (GSAP Pinned Section)         */}
{/* ============================================= */}
<div id="scroll-universe" className="scroll-universe">

    {/* Hero & Floating Cards */}
    <div className="cards-intro">
        <h1 className="cards-intro__title">A place to display your <br />masterpiece.</h1>

        <div className="cards-intro__content">
            <img src="/assets/images/content/landing_p1.jpg" alt="Artwork 1" className="cards-intro__card cards-intro__card--1" loading="lazy" />
            <img src="/assets/images/content/landing_p2.jpg" alt="Artwork 2" className="cards-intro__card cards-intro__card--2" loading="lazy" />
            <img src="/assets/images/content/landing_p3.jpg" alt="Artwork 3" className="cards-intro__card cards-intro__card--3" loading="lazy" />
            <img src="/assets/images/content/landing_p4.jpg" alt="Artwork 4" className="cards-intro__card cards-intro__card--4" loading="lazy" />
            <img src="/assets/images/content/landing_p5.jpg" alt="Artwork 5" className="cards-intro__card cards-intro__card--5" loading="lazy" />
            <img src="/assets/images/content/landing_p6.jpg" alt="Artwork 6" className="cards-intro__card cards-intro__card--6" loading="lazy" />

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
            <img src="/assets/images/content/snowboard.jpg" alt="Snowboarder carving through deep powder" className="showcase__image" loading="lazy" />
            <Link to="/post" className="showcase__preview-card">
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
                <img src="/assets/images/brand/favicon-label.png" alt="OASIS" className="signup-cta__form-icon" />
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
                </div>
                <div className="signup-cta__field">
                    <label htmlFor="signup-dob" className="sr-only">Date of birth</label>
                    <input type="text" id="signup-dob" name="dob" placeholder="Date of birth (MM/DD/YYYY)" onFocus="(this.type='date')" onBlur="(this.type='text')" />
                </div>
                <button type="submit" className="signup-cta__submit-btn">Continue</button>
                <div className="signup-cta__divider"><span>or</span></div>
                <button type="button" className="signup-cta__google-btn">
                    <img src="/assets/images/brand/Google - Original.png" alt="Google Logo" className="signup-cta__google-icon" loading="lazy" />
                    Continue with Google
                </button>
                <p className="signup-cta__login-link">Already have an account? <button type="button" className="landing-nav__login" onClick={() => setShowLogin(true)}>Log in</button></p>
                <p className="signup-cta__legal">By continuing, you agree to Oasis's <Link to="/terms">Terms of Service</Link> and acknowledge you've read our <Link to="/privacy">Privacy Policy</Link>.</p>
            </form>
        </div>
    </div>
</section>

{/* ============================================= */}
{/* AUTH MODALS (LOGIN & SIGNUP)                  */}
{/* ============================================= */}

{/* 1. LOGIN MODAL (Wide layout with QR code) */}
<div className={`auth-modal ${showLogin ? "active" : ""}`} id="loginModal">
    <div className="auth-modal__overlay" onClick={() => setShowLogin(false)}></div>
    <div className="auth-modal__container auth-modal__container--wide">
        <button className="auth-modal__close" onClick={() => setShowLogin(false)} aria-label="Close modal">✕</button>

        {/* Left Column: Login Form */}
        <div className="auth-modal__left">
            <img src="/assets/images/brand/favicon-label.png" alt="Oasis Logo" className="auth-modal__logo" />
            <h2 className="auth-modal__title">Welcome to OASIS</h2>
            <p className="auth-modal__subtitle">Log in to discover more ideas just for you</p>

            <form className="auth-modal__form" onSubmit={(e) => e.preventDefault()}>
                <div className="auth-modal__field auth-modal__field--labeled">
                    <label htmlFor="modal-login-email">Email</label>
                    <input type="email" id="modal-login-email" name="email" placeholder="name@example.com" required />
                </div>

                <div className="auth-modal__field auth-modal__field--labeled">
                    <label htmlFor="modal-login-password">Password</label>
                    <div className="auth-modal__input-wrap">
                        <input type="password" id="modal-login-password" name="password" placeholder="Enter your password" required minLength="8" />
                        <button type="button" className="auth-modal__icon-btn" aria-label="Toggle password visibility">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                    </div>
                </div>

                <Link to="/forgot-password" className="auth-modal__forgot">forgotten password?</Link>

                <button type="submit" className="auth-modal__submit">Log In</button>

                <div className="auth-modal__divider"><span>OR</span></div>

                <button type="button" className="auth-modal__google">
                    <img src="/assets/images/brand/Google - Original.png" alt="Google icon" className="auth-modal__google-icon" loading="lazy" />
                    Continue with Google
                </button>
            </form>

            <p className="auth-modal__legal">
                By continuing, you agree to the <Link to="/terms">Terms of Service</Link><br /> and <Link to="/privacy">Privacy Policy</Link>.
            </p>
        </div>

        {/* Right Column: QR Code Scan */}
        <div className="auth-modal__right">
            <div className="auth-modal__qr-box">
                <img src="/assets/images/brand/qr.png" alt="Scan QR code to log in" className="auth-modal__qr-image" loading="lazy" />
            </div>
            <p className="auth-modal__qr-text">Or, log in instantly by scanning code<br />with your phone.</p>
        </div>
    </div>
</div>

{/* 2. SIGN UP MODAL (Narrow layout, pill buttons) */}
<div className={`auth-modal ${showSignup ? "active" : ""}`} id="signupModal">
    <div className="auth-modal__overlay" onClick={() => setShowSignup(false)}></div>
    <div className="auth-modal__container auth-modal__container--narrow">
        <button className="auth-modal__close" onClick={() => setShowSignup(false)} aria-label="Close modal">✕</button>

        {/* Full Width Column: Registration Form */}
        <div className="auth-modal__left auth-modal__left--full">
            <img src="/assets/images/brand/favicon-label.png" alt="Oasis Logo" className="auth-modal__logo" />
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
                        <input type="password" id="modal-signup-password" name="password" placeholder="Password" required minLength="8" />
                        <button type="button" className="auth-modal__icon-btn" aria-label="Toggle password visibility">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                    </div>
                </div>

                <div className="auth-modal__field">
                    <label htmlFor="modal-signup-dob" className="sr-only">Date of birth</label>
                    <div className="auth-modal__input-wrap">
                        <input type="text" id="modal-signup-dob" name="dob" placeholder="Date of birth (MM/DD/YYYY)" onFocus="(this.type='date')" onBlur="(this.type='text')" required />
                        <button type="button" className="auth-modal__icon-btn" aria-label="Open calendar">
                            <span className="dynamic-icon" style={{ WebkitMaskImage: 'url(/assets/images/icons/dateofbirth.svg)', width: '20px', height: '20px' }}></span>
                        </button>
                    </div>
                </div>

                <button type="submit" className="auth-modal__submit">Continue</button>

                <div className="auth-modal__divider"><span>OR</span></div>

                <button type="button" className="auth-modal__google">
                    <img src="/assets/images/brand/Google - Original.png" alt="Google icon" className="auth-modal__google-icon" loading="lazy" />
                    Continue with Google
                </button>
            </form>

            <p className="auth-modal__legal">
                By continuing, you agree to the <Link to="/terms">Terms of Service</Link><br /> and <Link to="/privacy">Privacy Policy</Link>.
            </p>
        </div>
    </div>
</div>

{/* ============================================= */}

    </div>
  );
}
