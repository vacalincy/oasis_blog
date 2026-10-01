import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/legal.css';
import '../assets/css/contact.css';

export default function ContactPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    return (
        <div className="contact-body" style={{ minHeight: "100vh" }}>
            <nav className="legal-nav">
                <Link to="/discover" className="nav__logo">
                    <img src="/assets/images/brand/logo.svg" alt="OASIS Logo" style={{ height: "24px" }} />
                </Link>
                <Link to="/" className="back-link">
                    <div className="dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/arrow-left.svg')", width: "16px", height: "16px", marginRight: "8px", verticalAlign: "middle" }}></div>
                    Back to Home
                </Link>
            </nav>

            <main className="contact-container">
                <div className="contact-info">
                    <h1>How can we help?</h1>
                    <p>Whether you have a question about publishing, need technical support, or just want to say hi, we're always here for you.</p>

                    <div className="info-block">
                        <h3>Support Hours</h3>
                        <p>Monday - Friday<br/>9:00 AM - 6:00 PM (EST)</p>
                    </div>

                    <div className="info-block">
                        <h3>Average Response Time</h3>
                        <p>We typically reply within 24 hours.</p>
                    </div>

                    <div className="info-block">
                        <h3>Other Resources</h3>
                        <p>Check out our <Link to="/terms">Terms of Service</Link> or <Link to="/privacy">Privacy Policy</Link>.</p>
                    </div>
                </div>

                <div className="contact-form-wrapper">
                    {!isSubmitted ? (
                        <form id="contact-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input type="text" id="name" className="form-control" placeholder="Jane Doe" required />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input type="email" id="email" className="form-control" placeholder="jane@example.com" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">How can we help?</label>
                                <select id="subject" className="form-control" defaultValue="" required>
                                    <option value="" disabled>Select a topic...</option>
                                    <option value="account">Account &amp; Billing</option>
                                    <option value="publishing">Publishing &amp; Editor Help</option>
                                    <option value="bug">Report a Bug</option>
                                    <option value="other">General Inquiry</option>
                                    <option value="privacy">Privacy &amp; Data Request</option>
                                    <option value="others">Others</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea id="message" className="form-control" placeholder="Tell us more about your issue..." required></textarea>
                            </div>

                            <button type="submit" className="btn-submit">Send Message</button>
                        </form>
                    ) : (
                        <div id="success-message" className="success-message" style={{ display: 'block' }}>
                            <div className="success-icon">
                                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <h2>Message Sent!</h2>
                            <p>Thanks for reaching out. A member of the OASIS team will get back to you shortly.</p>
                            <button className="btn-submit" style={{ marginTop: "2rem", background: "#f3f4f6", color: "#374151" }} onClick={() => setIsSubmitted(false)}>Send another message</button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
