document.addEventListener('DOMContentLoaded', () => {

    const heroSection = document.getElementById('topic-hero');
    const cardsWrap = document.getElementById('topic-hero-cards');
    const textWrap = document.getElementById('topic-hero-text');

    if (!heroSection || !cardsWrap || !textWrap) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cardEls = cardsWrap.querySelectorAll('.topic-card');

    // Rest values match the CSS "rest" transforms in topics.css.
    // extraXVw / extraRotate = how much MORE to move/rotate at full
    // scroll (progress = 1). extraXVw is in vw so cards reach the
    // edges of the screen on any monitor size.
    const cardConfig = [
        { el: cardEls[0], restY: 10,  restRotate: -14, extraXVw: -20, extraRotate: -14 },
        { el: cardEls[1], restY: 0,   restRotate: -7,  extraXVw: -10, extraRotate: -8 },
        { el: cardEls[2], restY: -10, restRotate: 0,   extraXVw: 0,   extraRotate: 0 },  // center/main card
        { el: cardEls[3], restY: 0,   restRotate: 7,   extraXVw: 10,  extraRotate: 8 },
        { el: cardEls[4], restY: 10,  restRotate: 14,  extraXVw: 20,  extraRotate: 14 },
    ];

    let ticking = false;

    // 0 = hero section's top is at (or below) the top of the viewport —
    //     i.e. the very start of the page, nothing scrolled yet.
    // 1 = we've scrolled all the way through the hero section's extra height.
    function getProgress() {
        const rect = heroSection.getBoundingClientRect();
        const scrollable = heroSection.offsetHeight - window.innerHeight;
        if (scrollable <= 0) return 0;
        const progress = -rect.top / scrollable;
        return Math.min(Math.max(progress, 0), 1);
    }

    function update() {
        const progress = getProgress();
        const vw = window.innerWidth / 100;

        cardConfig.forEach(({ el, restY, restRotate, extraXVw, extraRotate }) => {
            if (!el) return;
            const x = extraXVw * vw * progress;
            const y = restY - progress * 10; // cards drift up as you scroll
            const rotate = restRotate + extraRotate * progress;
            el.style.transform = `translate(calc(-50% + ${x}px), ${y}px) rotate(${rotate}deg)`;
        });

        // Heading stays fully visible; it just lifts slightly as you scroll.
        textWrap.style.transform = `translateY(${20 - progress * 30}px)`;

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    update(); // run once on load in case the page is already scrolled
});