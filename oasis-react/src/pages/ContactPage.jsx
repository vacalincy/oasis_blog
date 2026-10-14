import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import '../assets/css/legal.css';
import '../assets/css/contact.css';

export default function ContactPage() {
    const { user, profile } = useAuth();
    const addToast = useToast();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Auto-fill name and email if user is logged in
    useEffect(() => {
        if (profile?.username) {
            setName(prev => prev || profile.username);
        }
        if (user?.email) {
            setEmail(prev => prev || user.email);
        }
    }, [user, profile]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !subject || !message.trim()) {
            addToast('Please fill in all required fields.', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('contact_messages')
                .insert({
                    name: name.trim(),
                    email: email.trim(),
                    subject,
                    message: message.trim(),
                    user_id: user?.id || null
                });

            if (error) {
                console.error('Error inserting contact message:', error);
                addToast('Failed to send message: ' + (error.message || 'Please try again later'), 'error');
                return;
            }

            setIsSubmitted(true);
            addToast('Message sent successfully! We will get back to you shortly.', 'success');
        } catch (err) {
            console.error('Contact submit error:', err);
            addToast('An unexpected error occurred. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setIsSubmitted(false);
        setSubject('');
        setMessage('');
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
                        <h3>Direct Email</h3>
                        <p><a href="mailto:support@oasis.design">support@oasis.design</a></p>
                    </div>

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
                                <input 
                                    type="text" 
                                    id="name" 
                                    className="form-control" 
                                    placeholder="Jane Doe" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required 
                                    disabled={isSubmitting}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    className="form-control" 
                                    placeholder="jane@example.com" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">How can we help?</label>
                                <select 
                                    id="subject" 
                                    className="form-control" 
                                    value={subject} 
                                    onChange={(e) => setSubject(e.target.value)} 
                                    required
                                    disabled={isSubmitting}
                                >
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
                                <textarea 
                                    id="message" 
                                    className="form-control" 
                                    placeholder="Tell us more about your issue..." 
                                    value={message} 
                                    onChange={(e) => setMessage(e.target.value)} 
                                    required
                                    disabled={isSubmitting}
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                className="btn-submit" 
                                disabled={isSubmitting}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isSubmitting ? 0.75 : 1 }}
                            >
                                {isSubmitting && (
                                    <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite', display: 'inline-block' }}></span>
                                )}
                                {isSubmitting ? 'Sending Message...' : 'Send Message'}
                            </button>
                        </form>
                    ) : (
                        <div id="success-message" className="success-message" style={{ display: 'block' }}>
                            <div className="success-icon">
                                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <h2>Message Sent!</h2>
                            <p>Thanks for reaching out. A member of the OASIS team will get back to you shortly.</p>
                            <button 
                                className="btn-submit" 
                                style={{ marginTop: "2rem", background: "#f3f4f6", color: "#374151" }} 
                                onClick={handleReset}
                            >
                                Send another message
                            </button>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
