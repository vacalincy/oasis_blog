/* ==========================================================================
   MAIN JAVASCRIPT FILE (main.js)
   Главный скрипт сайта Oasis Blog: отвечает за меню, анимации и интерактив.
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
            cleanText.trim().split(/\s+/).forEach((word, wordIdx) => {
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
                const rawHTML = el.innerHTML;
                
                // Only split if not already split
                if (!el.hasAttribute('data-animated')) {
                    el.setAttribute('data-animated', 'true');
                    
                    const cleanText = el.textContent;
                    el.innerHTML = '';
                    el.style.opacity = '1'; // container is fully opaque, spans are hidden
                    
                    cleanText.trim().split(/\s+/).forEach((word, wordIdx) => {
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
