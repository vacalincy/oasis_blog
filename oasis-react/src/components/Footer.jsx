import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
        <div className="footer-content">
            <div className="footer-column">
                <img src="/assets/images/brand/logo.svg" alt="OASIS Logo" width="72" height="24" style={{ height: '24px', width: '72px', marginBottom: '20px', display: 'block' }} />
                <ul>
                    <li><Link to="/about">About Us</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>
            </div>
            <div className="footer-column">
                <h3 className="footer-column-heading">Discover</h3>
                <ul>
                    <li><Link to="/topics">All Topics</Link></li>
                    <li><Link to="/popular">Popular Stories</Link></li>
                    <li><Link to="/discover">Recommended</Link></li>
                </ul>
            </div>
            <div className="footer-column">
                <h3 className="footer-column-heading">Legal &amp; Help</h3>
                <ul>
                    <li><Link to="/terms">Terms of Service</Link></li>
                    <li><Link to="/privacy">Privacy Policy</Link></li>
                    <li><Link to="/cookies">Cookie Policy</Link></li>
                    <li><Link to="/support">Support / Help Center</Link></li>
                </ul>
            </div>
        </div>
        <div className="footer-bottom">
            &copy; 2026 OASIS Platform. All rights reserved.
        </div>
    </footer>
  );
}
