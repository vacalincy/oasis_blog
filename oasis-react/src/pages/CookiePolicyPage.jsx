import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function CookiePolicyPage() {
  return (
    <div className="legal-body">
      <nav className="legal-nav">
        <Link to="/discover" className="nav__logo">
          <img src="/assets/images/brand/logo.svg" alt="OASIS Logo" style={{ height: '24px' }} />
        </Link>
        <Link to="/" className="back-link">← Back to Home</Link>
      </nav>

      <header className="legal-header">
        <h1>Cookie Policy</h1>
        <p>Last updated: October 2026</p>
      </header>

      <main className="legal-container">
        <div className="legal-content">
          <h2>1. What Are Cookies and Local Storage?</h2>
          <p>
            Cookies are small text files that are stored on your device (computer, smartphone, or tablet) when you visit a website. In addition to cookies, modern web applications like OASIS use browser <strong>Local Storage</strong> and <strong>Session Storage</strong> to store essential information securely on your device.
          </p>

          <h2>2. How OASIS Uses Cookies and Web Storage</h2>
          <p>
            OASIS is committed to user privacy. We do <strong>not</strong> sell your data, and we do <strong>not</strong> use invasive third-party cross-site advertising trackers. We use cookies and local storage strictly for the following purposes:
          </p>
          <ul>
            <li>
              <strong>Essential &amp; Authentication:</strong> To maintain your signed-in session securely via Supabase Auth, verify your identity when you access protected features, and protect against cross-site request forgery.
            </li>
            <li>
              <strong>Functionality &amp; Preferences:</strong> To remember your profile cache, preferences, and save draft stories locally so you never lose your writing progress if you accidentally close your browser.
            </li>
            <li>
              <strong>Security &amp; QR Auth:</strong> To manage one-time authorization tokens and desktop QR login handshakes securely.
            </li>
            <li>
              <strong>Consent Memory:</strong> To remember that you have reviewed and acknowledged this Cookie Policy so we don't display the banner repeatedly.
            </li>
          </ul>

          <h2>3. Categories of Storage We Use</h2>
          <ul>
            <li>
              <strong>Strictly Necessary:</strong> These are required for the website to function. Without them, you cannot log into your account, publish articles, or interact with creators.
            </li>
            <li>
              <strong>Functional:</strong> These enable enhanced functionality, such as remembering your draft text, active filters, and caching your profile data for instant page loads.
            </li>
          </ul>

          <h2>4. Third-Party Integrations</h2>
          <p>
            We use trusted infrastructure partners to operate OASIS safely:
          </p>
          <ul>
            <li>
              <strong>Supabase:</strong> For user authentication, encrypted database storage, and realtime notification broadcasts.
            </li>
            <li>
              <strong>Google Identity:</strong> Only if you choose to sign in using "Continue with Google".
            </li>
          </ul>

          <h2>5. How You Can Manage Cookies</h2>
          <p>
            Most modern browsers allow you to control cookies through their settings. You can choose to block or delete cookies in your browser preferences:
          </p>
          <ul>
            <li><strong>Google Chrome:</strong> Settings → Privacy and security → Third-party cookies</li>
            <li><strong>Apple Safari:</strong> Settings → Safari → Advanced → Block All Cookies</li>
            <li><strong>Mozilla Firefox:</strong> Settings → Privacy &amp; Security → Cookies and Site Data</li>
            <li><strong>Microsoft Edge:</strong> Settings → Cookies and site permissions</li>
          </ul>
          <p>
            <em>Please note:</em> If you choose to disable essential cookies or local storage, core features such as logging into OASIS or writing stories will not function properly.
          </p>

          <h2>6. Updates to This Policy</h2>
          <p>
            We may update our Cookie Policy from time to time to reflect changes in legal requirements or platform updates. We encourage you to review this page periodically.
          </p>

          <h2>7. Contact Us</h2>
          <p>
            If you have questions about how we use cookies or protect your data, please reach out through our <Link to="/contact">Contact Page</Link> or visit our <Link to="/support">Help Center</Link>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
