import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function PrivacyPage() {
  return (
    <div className="legal-body">
      <nav className="legal-nav">
        <Link to="/discover" className="nav__logo">
            <img src="/assets/images/brand/logo.svg" alt="OASIS Logo" style={{ height: '24px' }} />
        </Link>
        <Link to="/" className="back-link">← Back to Home</Link>
      </nav>

      <header className="legal-header">
          <h1>Privacy Policy</h1>
          <p>Last updated: October 2026</p>
      </header>

      <main className="legal-container">
        <div className="legal-content">
            <h2>1. Introduction</h2>
            <p>Welcome to OASIS ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.</p>

            <h2>2. The Data We Collect About You</h2>
            <p>Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
            <ul>
                <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data</strong> includes email address.</li>
                <li><strong>Content Data</strong> includes articles, comments, and images you upload to the platform.</li>
                <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
            </ul>

            <h2>3. How We Use Your Personal Data</h2>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul>
                <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., publishing your articles).</li>
                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal or regulatory obligation.</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.</p>

            <h2>5. Your Legal Rights</h2>
            <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.</p>
            <p>If you wish to exercise any of the rights set out above, please <Link to="/contact">contact us</Link>.</p>
        </div>
    </main>

      <Footer />
    </div>
  );
}
