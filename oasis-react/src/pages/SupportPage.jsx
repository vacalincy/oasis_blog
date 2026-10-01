import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import '../assets/css/legal.css';
import '../assets/css/support.css';

function FaqItem({ question, answer }) {
    const [isActive, setIsActive] = useState(false);
    return (
        <div className={`faq-item ${isActive ? 'active' : ''}`}>
            <div className="faq-question" onClick={() => setIsActive(!isActive)}>
                <span>{question}</span>
                <div className="faq-icon dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/chevron-down.svg')", width: "20px", height: "20px" }}></div>
            </div>
            <div className="faq-answer">
                {answer}
            </div>
        </div>
    )
}

export default function SupportPage() {
    return (
        <div className="support-body" style={{ minHeight: "100vh" }}>
            <nav className="legal-nav">
                <Link to="/discover" className="nav__logo">
                    <img src="/assets/images/brand/logo.svg" alt="OASIS Logo" style={{ height: "24px" }} />
                </Link>
                <Link to="/" className="back-link">← Back to Home</Link>
            </nav>

            <header className="support-hero">
                <h1>Help Center</h1>
                <div className="support-search">
                    <div className="dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/search.svg')", width: "20px", height: "20px" }}></div>
                    <input type="text" placeholder="Search for articles, guides, or FAQs..." aria-label="Search help center" />
                </div>
            </header>

            <main className="support-container">
                <section className="faq-section">
                    <h2>Frequently Asked Questions</h2>
                    <div className="faq-list">
                        <FaqItem 
                            question="How do I format my articles?" 
                            answer="OASIS uses a seamless WYSIWYG editor. You can format your text by highlighting it to reveal the floating toolbar, which includes options for bolding, italics, links, and blockquotes. Images can be dragged and dropped directly into the editor body."
                        />
                        <FaqItem 
                            question="Can I schedule a post for later?" 
                            answer="Currently, you can save your posts as Drafts to publish them manually when you are ready. Scheduled publishing is on our roadmap and will be released in the next major update."
                        />
                        <FaqItem 
                            question="How do I reset my password?" 
                            answer="If you've forgotten your password, click the &quot;Log In&quot; button on the homepage and select &quot;forgotten password?&quot;. You will be prompted to enter your email address to receive a secure reset link."
                        />
                        <FaqItem 
                            question="How do I customize my profile?" 
                            answer="Navigate to your Dashboard and click on the &quot;Edit Profile&quot; button located beneath your avatar. From there, you can update your display name, bio, and upload a custom header image."
                        />
                    </div>
                </section>

                <section className="support-cta">
                    <h3>Can't find what you're looking for?</h3>
                    <p>Our support team is available Monday through Friday to help you out.</p>
                    <Link to="/contact" className="btn-outline">Contact Support</Link>
                </section>
            </main>
            <Footer />
        </div>
    );
}
