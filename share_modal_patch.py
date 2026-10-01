import re

with open('oasis-react/src/pages/DashboardPage.jsx', 'r') as f:
    content = f.read()

modal_jsx = """
{/* SHARE MODAL */}
{showShareModal && (
<div className="share-modal-overlay" id="shareProfileModal" onClick={(e) => { if(e.target.id === 'shareProfileModal') setShowShareModal(false); }}>
    <div className="share-modal">
        <div className="share-modal__top-icon">
            <img loading="lazy" src="/assets/images/icons/link.png" alt="Link Icon" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
        </div>
        
        <button className="share-modal__close" id="closeShareModal" onClick={() => setShowShareModal(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
        
        <h3 className="share-modal__title">Share with Friends</h3>
        <p className="share-modal__subtitle">Curating is more effective when<br/>you connect with friends!</p>
        
        <div className="share-modal__section">
            <label htmlFor="shareLinkInput">Share your link</label>
            <div className="share-modal__link-box">
                <input type="text" value={window.location.href} readOnly id="shareLinkInput" />
                <button className="share-modal__copy-btn" id="copyShareLink" aria-label="Copy link" onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    addToast('Profile link copied to clipboard!', 'success');
                    setShowShareModal(false);
                }}>
                    <img loading="lazy" src="/assets/images/icons/copy.png" alt="Copy" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                </button>
            </div>
        </div>
        
        <div className="share-modal__section">
            <label>Share to</label>
            <div className="share-modal__socials">
                <a href="#" className="social-btn facebook" aria-label="Facebook">
                    <div className="social-icon">
                        <img loading="lazy" src="/assets/images/brand/Facebook - Original.png" alt="Facebook" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span>Facebook</span>
                </a>
                <a href="#" className="social-btn instagram" aria-label="Instagram">
                    <div className="social-icon">
                        <img loading="lazy" src="/assets/images/brand/instagram.png" alt="Instagram" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span>Instagram</span>
                </a>
                <a href="#" className="social-btn whatsapp" aria-label="WhatsApp">
                    <div className="social-icon">
                        <img loading="lazy" src="/assets/images/brand/whatsapp.png" alt="WhatsApp" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span>WhatsApp</span>
                </a>
                <a href="#" className="social-btn telegram" aria-label="Telegram">
                    <div class="social-icon">
                        <img loading="lazy" src="/assets/images/brand/Telegram - Original.png" alt="Telegram" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span>Telegram</span>
                </a>
                <a href="#" className="social-btn linkedin" aria-label="LinkedIn">
                    <div className="social-icon">
                        <img loading="lazy" src="/assets/images/brand/LinkedIn - Original.png" alt="LinkedIn" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span>LinkedIn</span>
                </a>
            </div>
        </div>
    </div>
</div>
)}
"""

new_content = content.replace("      <Footer />", modal_jsx + "\n      <Footer />")

with open('oasis-react/src/pages/DashboardPage.jsx', 'w') as f:
    f.write(new_content)

