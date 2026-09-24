import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function TermsPage() {
  return (
    <div className="legal-body">
      <nav className="legal-nav">
        <Link to="/discover" className="nav__logo">
            <img src="/assets/images/brand/logo.svg" alt="OASIS Logo" style={{ height: '24px' }} />
        </Link>
        <Link to="/" className="back-link">← Back to Home</Link>
      </nav>

      <header className="legal-header">
          <h1>Terms of Service</h1>
          <p>Last updated: October 2026</p>
      </header>

      <main className="legal-container">
        <div className="legal-content">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using the OASIS platform, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, you may not access the website or use any services.</p>

            <h2>2. User Content</h2>
            <p>OASIS allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.</p>
            <p>By posting Content on OASIS, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service. You retain any and all of your rights to any Content you submit, post or display.</p>

            <h2>3. Prohibited Conduct</h2>
            <p>You agree not to engage in any of the following prohibited activities:</p>
            <ul>
                <li>Copying, distributing, or disclosing any part of the Service in any medium.</li>
                <li>Using any automated system, including without limitation "robots," "spiders," "offline readers," etc., to access the Service.</li>
                <li>Transmitting spam, chain letters, or other unsolicited email.</li>
                <li>Attempting to interfere with, compromise the system integrity or security, or decipher any transmissions to or from the servers running the Service.</li>
                <li>Uploading invalid data, viruses, worms, or other software agents through the Service.</li>
            </ul>

            <h2>4. Intellectual Property</h2>
            <p>The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of OASIS and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.</p>

            <h2>5. Termination</h2>
            <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.</p>

            <h2>6. Changes to Terms</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
        </div>
    </main>

      <Footer />
    </div>
  );
}
