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
});