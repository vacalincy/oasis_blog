import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const COOKIE_CONSENT_KEY = 'oasis_cookie_consent';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn('Unable to access localStorage for cookie consent:', e);
    }
  }, []);

  const handleConsent = (choice) => {
    setIsClosing(true);
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, choice);
    } catch (e) {
      console.warn('Unable to save cookie consent to localStorage:', e);
    }
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <aside
      className={`cookie-banner ${isClosing ? 'cookie-banner--closing' : ''}`}
      aria-label="Cookie consent banner"
      role="region"
    >
      <button
        type="button"
        className="cookie-banner__close"
        onClick={() => handleConsent('essential')}
        aria-label="Dismiss cookie notice"
      >
        ✕
      </button>

      <div className="cookie-banner__body">
        <div className="cookie-banner__icon" aria-hidden="true">
          🍪
        </div>
        <div className="cookie-banner__content">
          <h3 className="cookie-banner__title">We value your privacy</h3>
          <p className="cookie-banner__text">
            We use essential cookies and local storage to secure your login sessions, remember preferences, and safeguard story drafts. See our{' '}
            <Link to="/cookies" className="cookie-banner__link">
              Cookie Policy
            </Link>{' '}
            for full details.
          </p>
        </div>
      </div>

      <div className="cookie-banner__actions">
        <button
          type="button"
          className="cookie-banner__btn cookie-banner__btn--primary"
          onClick={() => handleConsent('accepted')}
        >
          Accept All
        </button>
        <button
          type="button"
          className="cookie-banner__btn cookie-banner__btn--secondary"
          onClick={() => handleConsent('essential')}
        >
          Necessary Only
        </button>
      </div>
    </aside>
  );
}
