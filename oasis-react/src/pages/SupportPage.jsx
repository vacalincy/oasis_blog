import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import '../assets/css/legal.css';
import '../assets/css/support.css';

const FAQ_DATA = [
  {
    id: 1,
    question: "How do I format my articles?",
    answer: "OASIS uses a seamless WYSIWYG editor. You can format your text by highlighting it to reveal the floating toolbar, which includes options for bolding, italics, links, and blockquotes. Images can be dragged and dropped directly into the editor body or selected from your device."
  },
  {
    id: 2,
    question: "Can I schedule a post for later?",
    answer: "Currently, you can save your posts as Drafts to publish them manually when you are ready. Scheduled publishing is on our roadmap and will be released in the next major update."
  },
  {
    id: 3,
    question: "How do I reset my password?",
    answer: "If you've forgotten your password, click the \"Log In\" button on the homepage and select \"forgotten password?\". You will be prompted to enter your email address to receive a secure password reset link."
  },
  {
    id: 4,
    question: "How do I customize my profile?",
    answer: "Navigate to your Dashboard and click on the \"Edit Profile\" button located beneath your avatar. From there, you can update your display name, bio, and upload a custom header image or avatar."
  },
  {
    id: 5,
    question: "How does the Following feed work?",
    answer: "When you follow creators, their latest published stories automatically appear in your Following feed in an immersive, full-screen vertical reading format with scroll navigation."
  },
  {
    id: 6,
    question: "How can I bookmark or save stories?",
    answer: "Click the bookmark icon on any post card or article actions bar. Saved stories are collected directly in your private Dashboard under the 'Saved' tab for easy offline-ready reading."
  },
  {
    id: 7,
    question: "How do comments and discussions work?",
    answer: "Readers can engage with articles by clicking the comment button below any story. You can post top-level comments or reply directly to other readers in threaded discussions."
  },
  {
    id: 8,
    question: "Is Oasis free to use?",
    answer: "Yes! Oasis is a free publication platform for writers and readers. You can read, curate, publish stories, and connect with other creators without any subscription fees."
  }
];

function FaqItem({ question, answer, isOpen, onToggle }) {
    return (
        <div className={`faq-item ${isOpen ? 'active' : ''}`}>
            <div className="faq-question" onClick={onToggle}>
                <span>{question}</span>
                <div className="faq-icon dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/chevron-down.svg')", width: "20px", height: "20px" }}></div>
            </div>
            <div className="faq-answer">
                {answer}
            </div>
        </div>
    );
}

export default function SupportPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [openIds, setOpenIds] = useState(new Set());

    const filteredFaqs = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return FAQ_DATA;
        return FAQ_DATA.filter(faq => 
            faq.question.toLowerCase().includes(q) || 
            faq.answer.toLowerCase().includes(q)
        );
    }, [searchQuery]);

    // Auto-expand matching items when actively searching
    useEffect(() => {
        if (searchQuery.trim()) {
            setOpenIds(new Set(filteredFaqs.map(f => f.id)));
        } else {
            setOpenIds(new Set());
        }
    }, [searchQuery, filteredFaqs]);

    const handleToggleFaq = (id) => {
        setOpenIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    return (
        <div className="support-body" style={{ minHeight: "100vh" }}>
            <nav className="legal-nav">
                <Link to="/discover" className="nav__logo">
                    <img src="/assets/images/brand/logo.svg" alt="OASIS Logo" style={{ height: "24px" }} />
                </Link>
                <Link to="/" className="back-link">
                    <div className="dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/arrow-left.svg')", width: "16px", height: "16px", marginRight: "8px", verticalAlign: "middle" }}></div>
                    Back to Home
                </Link>
            </nav>

            <header className="support-hero">
                <h1>Help Center</h1>
                <div className="support-search">
                    <div className="dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/search.svg')", width: "20px", height: "20px" }}></div>
                    <input 
                        type="text" 
                        placeholder="Search for articles, guides, or FAQs..." 
                        aria-label="Search help center"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery.trim().length > 0 && (
                        <button 
                            type="button" 
                            className="support-search__clear" 
                            aria-label="Clear search" 
                            onClick={handleClearSearch}
                        >
                            ✕
                        </button>
                    )}
                </div>

                {searchQuery.trim().length > 0 && (
                    <div className="support-search-stats">
                        <span>
                            {filteredFaqs.length === 1 
                                ? <>Found <strong>1 result</strong> for "{searchQuery}"</>
                                : <>Found <strong>{filteredFaqs.length} results</strong> for "{searchQuery}"</>
                            }
                        </span>
                    </div>
                )}
            </header>

            <main className="support-container">
                <section className="faq-section">
                    <h2>Frequently Asked Questions</h2>

                    {filteredFaqs.length > 0 ? (
                        <div className="faq-list">
                            {filteredFaqs.map(faq => (
                                <FaqItem 
                                    key={faq.id}
                                    question={faq.question}
                                    answer={faq.answer}
                                    isOpen={openIds.has(faq.id)}
                                    onToggle={() => handleToggleFaq(faq.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="support-empty-search">
                            <h3>No answers found</h3>
                            <p>We couldn't find any questions matching "{searchQuery}". Try different keywords or reach out to our team directly.</p>
                            <button 
                                type="button" 
                                className="support-empty-search__btn" 
                                onClick={handleClearSearch}
                            >
                                Clear search
                            </button>
                        </div>
                    )}
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
