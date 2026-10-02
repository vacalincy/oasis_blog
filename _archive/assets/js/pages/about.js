// noinspection JSUnresolvedReference, JSCheckFunctionSignatures, JSUnusedGlobalSymbols
/* global gsap, ScrollTrigger */
// --- Extracted from about.html (Script 1) ---
document.addEventListener('DOMContentLoaded', () => {
        const steps = document.querySelectorAll('.timeline-step');
        const img = document.getElementById('hiw-image');
        let currentIndex = 0;
        let timer;
        
        function updateTimeline(index) {
            // Remove classes and force reflow to perfectly restart CSS animations
            steps.forEach(step => { step.classList.remove('active', 'done'); });
            // noinspection BadExpressionStatementJS
            img.offsetWidth; // trigger reflow
            
            steps.forEach((step, i) => {
                if (i < index) {
                    step.classList.add('done');
                } else if (i === index) {
                    step.classList.add('active');
                }
            });
            
            const activeStep = steps[index];
            
            // Crossfade image
            img.style.opacity = '0';
            setTimeout(() => {
                img.src = activeStep.dataset.img;
                img.style.opacity = '1';
            }, 400);
        }
        
        function nextStep() {
            currentIndex = (currentIndex + 1) % steps.length;
            updateTimeline(currentIndex);
        }
        
        function startTimer() {
            clearInterval(timer);
            timer = setInterval(nextStep, 4000);
        }
        
        steps.forEach((step, index) => {
            step.addEventListener('click', () => {
                currentIndex = index;
                updateTimeline(currentIndex);
                startTimer();
            });
            step.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    currentIndex = index;
                    updateTimeline(currentIndex);
                    startTimer();
                }
            });
        });
        
        const hiwSection = document.querySelector('.how-it-works-section');
        if (hiwSection) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    updateTimeline(0);
                    startTimer();
                    observer.disconnect();
                }
            }, { threshold: 0.3 });
            observer.observe(hiwSection);
        } else {
            updateTimeline(0);
            startTimer();
        }
    });

// --- Extracted from about.html (Script 2) ---
document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // 1. HERO SECTION (Exactly like index.html)
    const title = document.querySelector(".about-hero__title");
    if (title) {
        const lines = ["Curated Stories.", "Meaningful Whitespace."];
        title.innerHTML = "";
        lines.forEach((line, index) => {
            const lineContainer = document.createElement("span");
            lineContainer.style.display = "inline-block";
            line.split(" ").forEach(word => {
                const wordSpan = document.createElement("span");
                wordSpan.innerHTML = word + "&nbsp;";
                wordSpan.style.display = "inline-block";
                wordSpan.classList.add("about-hero-word");
                lineContainer.appendChild(wordSpan);
            });
            title.appendChild(lineContainer);
            if (index === 0) title.appendChild(document.createElement("br"));
        });
    }

    const subtitle = document.querySelector(".about-hero__subtitle");
    if (subtitle) {
        const subtitleText = "OASIS is a digital sanctuary for high-end photography, editorial reads, and minimalist design.";
        subtitle.innerHTML = "";
        subtitleText.split(" ").forEach(word => {
            const wordSpan = document.createElement("span");
            wordSpan.innerHTML = word + "&nbsp;";
            wordSpan.style.display = "inline-block";
            wordSpan.classList.add("about-subtitle-word");
            subtitle.appendChild(wordSpan);
        });
    }

    
    // 3. ANIMATE HERO (Timeline without ScrollTrigger)
    const heroTl = gsap.timeline();
    if (title) {
        heroTl.fromTo(".about-hero-word", 
            { y: 30, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1.3, ease: "power2.out", stagger: 0.25 }, 
            0
        );
    }
    if (subtitle) {
        heroTl.fromTo(".about-subtitle-word", 
            { y: 20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1.0, ease: "power2.out", stagger: 0.05 }, 
            "-=0.8"
        );
    }
});

