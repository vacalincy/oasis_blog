/* ==========================================================================
   MAIN JAVASCRIPT FILE (main.js)
   Main Oasis Blog script: handles navigation, animations, and global interactivity.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

    const navItems = document.querySelector('.nav__items');
    const openNavBtn = document.querySelector('#open__nav-btn');
    const closeNavBtn = document.querySelector('#close__nav-btn');

    if (openNavBtn && closeNavBtn && navItems) {

        openNavBtn.addEventListener('click', () => {
            navItems.classList.add('show');
        });

        closeNavBtn.addEventListener('click', () => {
            navItems.classList.remove('show');
        });
    }

    // --- TAB BAR ANIMATION LOGIC (Circular Flexbox) ---
    const tabWrapper = document.querySelector('.tab-bar-wrapper');
    if (tabWrapper) {
        const highlight = tabWrapper.querySelector('.tab-bar-highlight');
        const items = Array.from(tabWrapper.querySelectorAll('.tab-bar-base .nav-item'));
        
        let activeIndex = items.findIndex(item => item.classList.contains('active'));
        if (activeIndex === -1) activeIndex = 0; // Default if none active

        // Read prev index
        const prevIndex = sessionStorage.getItem('tabBarCirclePrev');
        
        if (prevIndex !== null && prevIndex !== String(activeIndex)) {
            // Start at prev index instantly
            highlight.style.transition = 'none';
            highlight.className = `tab-bar-highlight active-${prevIndex}`;
            
            // Force reflow
            highlight.getBoundingClientRect();
            
            // Animate to new
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    highlight.style.transition = 'clip-path 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
                    highlight.className = `tab-bar-highlight active-${activeIndex}`;
                });
            });
        } else {
            highlight.className = `tab-bar-highlight active-${activeIndex}`;
        }
        
        sessionStorage.removeItem('tabBarCirclePrev');

        items.forEach((item, index) => {
            item.addEventListener('click', () => {
                sessionStorage.setItem('tabBarCirclePrev', activeIndex);
                highlight.className = `tab-bar-highlight active-${index}`;
            });
        });
    }
    // --- FEATURED POST STAGGERED TEXT ANIMATION (Vanilla JS matching GSAP) ---
    const badge = document.querySelector('.featured-post__badge');
    if (badge) {
        badge.style.opacity = '0';
        badge.style.transform = 'translateY(15px)';
        badge.style.animation = 'hero-fade-in 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards';
        badge.style.animationDelay = '0s'; // Animates absolutely first
    }

    const featuredTitle = document.querySelector('.featured-post__title-link h2');
    if (featuredTitle) {
        const text = featuredTitle.textContent;
        featuredTitle.innerHTML = '';
        text.trim().split(/\s+/).forEach((word, index) => {
            const span = document.createElement('span');
            span.innerHTML = word + '&nbsp;';
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateY(30px)';
            span.style.animation = 'hero-fade-in 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards';
            span.style.animationDelay = `${0.1 + (index * 0.08)}s`;
            featuredTitle.appendChild(span);
        });
        
        // Stagger the description text word by word
        let lastDescDelay = 0.7; // fallback
        const featuredDesc = document.querySelector('.featured-post__info p');
        if (featuredDesc) {
            const descText = featuredDesc.textContent;
            featuredDesc.innerHTML = '';
            descText.trim().split(/\s+/).forEach((word, index) => {
                const span = document.createElement('span');
                span.innerHTML = word + '&nbsp;';
                span.style.display = 'inline-block';
                span.style.opacity = '0';
                span.style.transform = 'translateY(30px)';
                span.style.animation = 'hero-fade-in 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards';
                // Very fast stagger for paragraph words
                const delay = 0.5 + (index * 0.015);
                span.style.animationDelay = `${delay}s`;
                featuredDesc.appendChild(span);
                lastDescDelay = delay;
            });
        }
        
        // Stagger the author block
        const featuredAuthor = document.querySelector('.featured-post__author');
        if (featuredAuthor) {
            featuredAuthor.style.opacity = '0';
            featuredAuthor.style.transform = 'translateY(30px)';
            featuredAuthor.style.animation = 'hero-fade-in 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards';
            // Start the author animation 0.2s after the final word of the description begins animating
            featuredAuthor.style.animationDelay = `${lastDescDelay + 0.2}s`;
        }
    }

    
    // --- SINGLE POST STAGGERED TEXT ANIMATION ---
    const postTitle = document.querySelector('.post-header__title, .popular-hero__title, .about-hero__title');
    if (postTitle) {
        const rawHTML = postTitle.innerHTML;
        const lines = rawHTML.split(/<br\s*\/?>/i); // Split by <br> tags
        postTitle.innerHTML = '';
        postTitle.style.opacity = '1';
        postTitle.style.transform = 'none';
        
        let lastTitleDelay = 0;
        let globalWordIndex = 0;
        
        lines.forEach((line, lineIndex) => {
            const cleanText = line.replace(/(<([^>]+)>)/gi, ""); // strip any other tags just in case
            cleanText.trim().split(/\s+/).forEach(word => {
                if (!word) return;
                const span = document.createElement('span');
                
                span.innerHTML = word + '&nbsp;';
                
                span.style.display = 'inline-block';
                span.style.opacity = '0';
                span.style.transform = 'translateY(30px)';
                span.style.animation = 'hero-fade-in 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards';
                const delay = 0.1 + (globalWordIndex * 0.04);
                span.style.animationDelay = `${delay}s`;
                postTitle.appendChild(span);
                lastTitleDelay = delay;
                globalWordIndex++;
            });
            
            // Re-insert the <br> if it's not the last line
            if (lineIndex < lines.length - 1) {
                postTitle.appendChild(document.createElement('br'));
            }
        });
        
        
        

        const postBadge = document.querySelector('.post-header__badge');
        if (postBadge) {
            postBadge.style.opacity = '0';
            postBadge.style.transform = 'translateY(15px)';
            postBadge.style.animation = 'hero-fade-in 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards';
            postBadge.style.animationDelay = '0s';
        }

        const postAuthor = document.querySelector('.post-header__author');
        if (postAuthor) {
            postAuthor.style.opacity = '0';
            postAuthor.style.transform = 'translateY(20px)';
            postAuthor.style.animation = 'hero-fade-in 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards';
            postAuthor.style.animationDelay = `${lastTitleDelay + 0.2}s`;
        }
        
        const postMediaImg = document.querySelector('.post-media__img');
        if (postMediaImg) {
            postMediaImg.style.opacity = '0';
            postMediaImg.style.transform = 'translateY(30px)';
            postMediaImg.style.animation = 'hero-fade-in 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards';
            postMediaImg.style.animationDelay = `${lastTitleDelay + 0.4}s`;
        }
        
        const postMediaCaption = document.querySelector('.post-media__caption');
        if (postMediaCaption) {
            postMediaCaption.style.opacity = '0';
            postMediaCaption.style.transform = 'translateY(20px)';
            postMediaCaption.style.animation = 'hero-fade-in 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards';
            postMediaCaption.style.animationDelay = `${lastTitleDelay + 0.6}s`;
        }
    }

    
    // --- MANIFESTO STAGGERED TEXT ANIMATION ---
    const manifestoTexts = document.querySelectorAll('.manifesto-text');
    const manifestoLabels = document.querySelectorAll('.manifesto-label');
    
    // Animate labels normally as blocks
    const manifestoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                entry.target.style.animation = 'hero-fade-in 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards';
                entry.target.style.animationDelay = '0s';
                manifestoObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    manifestoLabels.forEach(label => manifestoObserver.observe(label));
    
    // Animate text word by word
    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                
                // Only split if not already split
                if (!el.hasAttribute('data-animated')) {
                    el.setAttribute('data-animated', 'true');
                    
                    const cleanText = el.textContent;
                    el.innerHTML = '';
                    el.style.opacity = '1'; // container is fully opaque, spans are hidden
                    
                    cleanText.trim().split(/\s+/).forEach(word => {
                        if (!word) return;
                        const span = document.createElement('span');
                        span.innerHTML = word + '&nbsp;';
                        span.style.display = 'inline-block';
                        span.style.opacity = '0';
                        span.style.transform = 'translateY(30px)';
                        span.style.animation = 'hero-fade-in 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards';
                        // Stagger very fast for body text
                        const delay = 0.2 + (wordIdx * 0.025);
                        span.style.animationDelay = `${delay}s`;
                        el.appendChild(span);
                    });
                }
                
                textObserver.unobserve(el);
            }
        });
    }, { threshold: 0.3 });

    manifestoTexts.forEach(text => textObserver.observe(text));
    

    
    // --- MANIFESTO NUMBERS CASCADE ---
    const numberItems = document.querySelectorAll('.number-item');
    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.animation = 'hero-fade-in 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards';
                
                // Get index relative to siblings for left-to-right stagger
                const childIdx = Array.from(el.parentNode.children).indexOf(el);
                
                // Base delay of 0.8s (waits for text to almost finish) + 0.15s per item
                el.style.animationDelay = `${0.8 + (childIdx * 0.15)}s`;
                
                numberObserver.unobserve(el);
            }
        });
    }, { threshold: 0.1 });

    numberItems.forEach(item => numberObserver.observe(item));

    // --- GRID SCROLL REVEAL CASCADE ---
    const gridElements = document.querySelectorAll('.section-header h2, .category-title, .category-description, .filters, .post-card, .load-more-btn, .post-body h3, .post-body p, .post-body blockquote, .post-body img, .pick-card, .classics__title, .classics__image, .classics__content, .discussions__title, .discussions__item');
    if (gridElements.length > 0) {
        const gridObserver = new IntersectionObserver((entries) => {
            let delay = 0;
            let activeEntries = entries.filter(e => e.isIntersecting);
            
            // If the grid is visible immediately on page load, force it to wait 
            // for the Featured Post text animations to finish first (~2.6 seconds)
            // Dynamically set delay based on which page we are on
            let baseDelay = 0;
            if (performance.now() < 1500) {
                if (document.querySelector('.featured-post__info') || document.querySelector('.post-header__title')) {
                    baseDelay = 1.6; // Discover and Single Post have long text animations
                } else if (document.querySelector('.popular-hero__title')) {
                    baseDelay = 0.6; // Popular page title is short, so cards appear sooner
                }
            }
            
            activeEntries.forEach(entry => {
                entry.target.style.animation = 'hero-fade-in 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards';
                entry.target.style.animationDelay = `${baseDelay + delay}s`;
                gridObserver.unobserve(entry.target);
                delay += 0.08; // Smooth stagger interval
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        });

        gridElements.forEach(el => {
            gridObserver.observe(el);
        });
    }

});


    // =================================================================
    // SMART TAB BAR (Hide on Mobile Keyboard Open)
    // =================================================================
    const tabBar = document.querySelector('.tab-bar-wrapper');
    if (tabBar) {
        const inputs = document.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                if (window.innerWidth <= 768) {
                    tabBar.style.display = 'none';
                }
            });
            
            input.addEventListener('blur', () => {
                if (window.innerWidth <= 768) {
                    // Small delay to prevent flickering if jumping between inputs
                    setTimeout(() => {
                        if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                            tabBar.style.display = 'block';
                        }
                    }, 100);
                }
            });
        });
    }


// =================================================================
// TOAST NOTIFICATIONS (Phase 2)
// =================================================================
window.showToast = function(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' 
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
        
    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after 3s
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
};

// =================================================================
// FORM VALIDATIONS & LOADING STATES (Phase 2)
// =================================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Settings Update Button
    const btnUpdateSettings = document.querySelector('.settings-actions .btn-primary');
    if (btnUpdateSettings) {
        btnUpdateSettings.addEventListener('click', (e) => {
            // Very basic frontend validation example
            const emailInput = document.querySelector('input[type="email"]');
            if (emailInput && !emailInput.value.includes('@')) {
                showToast('Please enter a valid email address.', 'error');
                emailInput.focus();
                return;
            }

            e.preventDefault();
            btnUpdateSettings.classList.add('btn-loading');
            
            // Simulate network request
            setTimeout(() => {
                btnUpdateSettings.classList.remove('btn-loading');
                showToast('Settings saved successfully!');
            }, 800);
        });
    }

    // 2. Profile Editing Save Button (dashboard.html)
    const btnSaveProfile = document.getElementById('btn-save-profile');
    if (btnSaveProfile) {
        // We need to inject this carefully because dashboard.html already has an event listener for this button
        // Let's hook into it by overriding the onclick or just letting the existing click run and we add the toast
        btnSaveProfile.addEventListener('click', () => {
            btnSaveProfile.classList.add('btn-loading');
            setTimeout(() => {
                btnSaveProfile.classList.remove('btn-loading');
                showToast('Profile updated!');
            }, 600);
        });
    }

    // 3. Delete Account Button (Settings)
    const btnDeleteAccount = document.querySelector('.btn-danger');
    if (btnDeleteAccount) {
        btnDeleteAccount.addEventListener('click', (e) => {
            e.preventDefault();
            btnDeleteAccount.classList.add('btn-loading');
            setTimeout(() => {
                btnDeleteAccount.classList.remove('btn-loading');
                showToast('Account scheduled for deletion.', 'error');
            }, 1000);
        });
    }
});

