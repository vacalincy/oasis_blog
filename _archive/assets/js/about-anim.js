document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // --- HERO TEXT TIMELINE (Exactly like index.html) ---
    const aboutHeroTitle = document.querySelector('.about-hero__title');
    const aboutHeroSubtitle = document.querySelector('.about-hero__subtitle');
    
    const splitText = (el) => {
        if (!el || el.classList.contains('split-done')) return;
        const lines = el.innerHTML.split(/<br\s*\/?>/i);
        el.innerHTML = "";
        lines.forEach((line) => {
            const lineContainer = document.createElement("span");
            lineContainer.style.display = "block";
            const textOnly = line.replace(/<[^>]*>?/gm, '');
            const cleanWords = textOnly.trim().split(/\s+/);
            cleanWords.forEach(word => {
                if (word) {
                    const wordSpan = document.createElement("span");
                    wordSpan.innerHTML = word + "&nbsp;";
                    wordSpan.style.display = "inline-block";
                    wordSpan.classList.add("gsap-word");
                    lineContainer.appendChild(wordSpan);
                }
            });
            el.appendChild(lineContainer);
        });
        el.classList.add('split-done');
    };

    if (aboutHeroTitle || aboutHeroSubtitle) {
        splitText(aboutHeroTitle);
        splitText(aboutHeroSubtitle);
        
        const tl = gsap.timeline();
        if (aboutHeroTitle) {
            tl.fromTo(aboutHeroTitle.querySelectorAll('.gsap-word'), 
                { y: 30, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 1.3, ease: "power2.out", stagger: 0.15 }, 
                0
            );
        }
        if (aboutHeroSubtitle) {
            tl.fromTo(aboutHeroSubtitle.querySelectorAll('.gsap-word'), 
                { y: 20, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 1.0, ease: "power2.out", stagger: 0.05 }, 
                "-=0.8"
            );
        }
    }

    // --- OTHER TEXT ELEMENTS (ScrollTrigger) ---
    const textElements = document.querySelectorAll('.manifesto-text, .popular-hero__title, .category-description, .classics__content');
    
    textElements.forEach(el => {
        splitText(el);
        
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.fromTo(el.querySelectorAll('.gsap-word'), 
                { y: 30, opacity: 0 },
                {
                    scrollTrigger: { trigger: el, start: "top 90%" },
                    y: 0, opacity: 1, duration: 0.8, ease: "power2.out", stagger: 0.04
                }
            );
        } else {
            gsap.fromTo(el.querySelectorAll('.gsap-word'), 
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", stagger: 0.04 }
            );
        }
    });
});
