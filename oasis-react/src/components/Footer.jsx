import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
        <div className="footer-content">
            <div className="footer-column">
                <img src="/assets/images/brand/logo.svg" alt="OASIS Logo" style={{ height: '24px', marginBottom: '20px', display: 'block' }} />
                <ul>
                    <li><a href="/about">About Us</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </div>
            <div className="footer-column">
                <h4>Discover</h4>
                <ul>
                    <li><a href="/topics">All Topics</a></li>
                    <li><a href="/popular">Popular Stories</a></li>
                    <li><a href="/discover">Recommended</a></li>
                </ul>
            </div>
            <div className="footer-column">
                <h4>Legal &amp; Help</h4>
                <ul>
                    <li><a href="/terms">Terms of Service</a></li>
                    <li><a href="/privacy">Privacy Policy</a></li>
                    <li><a href="/support">Support / Help Center</a></li>
                </ul>
            </div>
        </div>
        <div className="footer-bottom">
            &copy; 2026 OASIS Platform. All rights reserved.
        </div>
    </footer>
  );
}
