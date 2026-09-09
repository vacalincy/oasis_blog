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
});
