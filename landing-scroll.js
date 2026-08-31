document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // =================================================================
    // 0-4. RESPONSIVE GSAP ANIMATIONS (Hero & Cascade)
    // =================================================================
    let mm = gsap.matchMedia();

    mm.add({
        isDesktop: "(min-width: 769px)",
        isMobile: "(max-width: 768px)"
    }, (context) => {
        let { isDesktop, isMobile } = context.conditions;

        // Clean states inside matchMedia to handle resizing properly
        gsap.set("#scroll-universe", { position: "relative" });
        gsap.set(".cards-intro__title", { animation: "none" });
        gsap.set(".cards-intro__title, .cards-intro__footer, .cards-intro__btn", { opacity: 1 });
        gsap.set(".cards-intro__card", { opacity: 0, rotation: -12, scale: 0.9, y: window.innerHeight });

        gsap.set(".cards-intro__bubble--left, .cards-intro__bubble--right, .cards-intro__bubble--cascade", {
            opacity: 0, scale: 0, visibility: "hidden"
        });

        // Поднимаем текст выше на мобильных, чтобы освободить место для карточек внизу
        gsap.set(".cascade", {
            position: "absolute",
            top: isMobile ? "5%" : "20%",
            left: 0, width: "100%", autoAlpha: 0, zIndex: 10
        });

        // =================================================================
        // 1. TEXT PREPARATION (Word-by-word splits)
        // =================================================================
        const title = document.querySelector(".cards-intro__title");
        if (title) {
            const lines = ["A place to display your", "masterpiece."];
            title.innerHTML = "";
            lines.forEach((line, index) => {
                const lineContainer = document.createElement("span");
                lineContainer.style.display = "inline-block";
                line.split(" ").forEach(word => {
                    const wordSpan = document.createElement("span");
                    wordSpan.innerHTML = word + "&nbsp;";
                    wordSpan.style.display = "inline-block";
                    wordSpan.classList.add("hero-word");
                    lineContainer.appendChild(wordSpan);
                });
                title.appendChild(lineContainer);
                if (index === 0) title.appendChild(document.createElement("br"));
            });
        }

        const subtitle = document.querySelector(".cards-intro__subtitle");
        if (subtitle) {
            const subtitleText = subtitle.innerText;
            subtitle.innerHTML = "";
            subtitleText.split(" ").forEach(word => {
                const wordSpan = document.createElement("span");
                wordSpan.innerHTML = word + "&nbsp;";
                wordSpan.style.display = "inline-block";
                wordSpan.classList.add("subtitle-word");
                subtitle.appendChild(wordSpan);
            });
        }

        const cascadeTitle = document.querySelector(".cascade__title");
        if (cascadeTitle) {
            const htmlContent = cascadeTitle.innerHTML;
            const cascadeLines = htmlContent.split(/<br\s*\/?>/i);
            cascadeTitle.innerHTML = "";

            cascadeLines.forEach((line, index) => {
                const lineContainer = document.createElement("span");
                lineContainer.style.display = "block";

                if (index === 1) {
                    lineContainer.style.color = "var(--color-primary)";
                }

                const words = line.trim().split(/\s+/);
                words.forEach(word => {
                    if (word) {
                        const wordSpan = document.createElement("span");
                        wordSpan.innerHTML = word + "&nbsp;";
                        wordSpan.style.display = "inline-block";
                        wordSpan.style.verticalAlign = "top";
                        wordSpan.classList.add("cascade-word");
                        lineContainer.appendChild(wordSpan);
                    }
                });
                cascadeTitle.appendChild(lineContainer);
            });
        }

        const heroTl = gsap.timeline();
        heroTl.fromTo(".hero-word", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.3, ease: "power2.out", stagger: 0.25 }, 0);
        heroTl.to(".cards-intro__card", { y: 0, opacity: 1, duration: 1.5, ease: "power3.out", stagger: 0 }, 0);

        // Идеальная центровка веера
        const finalPositions = isDesktop ? [
            { left: "0px",   top: "10px",  rotation: -16 },
            { left: "140px", top: "8px",   rotation: -10 },
            { left: "280px", top: "-5px",  rotation: -4 },
            { left: "420px", top: "-5px",  rotation: 4 },
            { left: "560px", top: "-15px", rotation: 10 },
            { left: "700px", top: "35px",  rotation: 16 }
        ] : [
            { left: "calc(50% - 125px)", top: "10px", rotation: -15 },
            { left: "calc(50% - 95px)",  top: "5px",  rotation: -8 },
            { left: "calc(50% - 65px)",  top: "0px",  rotation: -2 },
            { left: "calc(50% - 35px)",  top: "0px",  rotation: 2 },
            { left: "calc(50% - 5px)",   top: "5px",  rotation: 8 },
            { left: "calc(50% + 25px)",  top: "10px", rotation: 15 }
        ];

        heroTl.to(".cards-intro__card", {
            left: (i) => finalPositions[i] ? finalPositions[i].left : "0px",
            top: (i) => finalPositions[i] ? finalPositions[i].top : "0px",
            rotation: (i) => finalPositions[i] ? finalPositions[i].rotation : 0,
            scale: 1, duration: 1.3, ease: "power3.inOut", stagger: { amount: 0.35, from: "center" }
        }, 0.5);

        if (isDesktop) {
            heroTl.to(".cards-intro__bubble--left, .cards-intro__bubble--right", {
                autoAlpha: 1, scale: 1, duration: 0.8, ease: "back.out(3)", transformOrigin: "bottom center", stagger: 0.2
            }, 1.2);
        }

        heroTl.fromTo(".subtitle-word", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "power2.out", stagger: 0.08 }, 1.3);
        heroTl.fromTo(".cards-intro__btn", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", stagger: 0.4 }, 1.8);

        const cascadeTextTl = gsap.timeline({ paused: true });
        cascadeTextTl.to(".cascade", { autoAlpha: 1, duration: 0.1 });
        cascadeTextTl.fromTo(".cascade__badge", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" });
        cascadeTextTl.fromTo(".cascade-word", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: "power2.out" }, "-=0.4");
        cascadeTextTl.fromTo(".cascade__description", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, "+=0.1");

        const cascadeBubbleTl = gsap.timeline({ paused: true });
        if (isDesktop) {
            cascadeBubbleTl.fromTo(".cards-intro__bubble--cascade",
                { scale: 0, autoAlpha: 0 },
                { autoAlpha: 1, scale: 1, duration: 0.8, ease: "back.out(3)", transformOrigin: "bottom left" }
            );
        }

        let textTriggered = false;
        let bubbleTriggered = false;

        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: "#scroll-universe",
                start: "top top",
                end: "+=2500",
                scrub: 1,
                pin: true,
                onUpdate: (self) => {
                    if (self.progress >= 0.45 && !textTriggered) {
                        textTriggered = true; cascadeTextTl.timeScale(1).play();
                    } else if (self.progress < 0.45 && textTriggered) {
                        textTriggered = false; cascadeTextTl.timeScale(4).reverse();
                    }
                    if (isDesktop) {
                        if (self.progress >= 0.80 && !bubbleTriggered) {
                            bubbleTriggered = true; cascadeBubbleTl.timeScale(1).play();
                        } else if (self.progress < 0.80 && bubbleTriggered) {
                            bubbleTriggered = false; cascadeBubbleTl.timeScale(4).reverse();
                        }
                    }
                }
            }
        });

        scrollTl.to(".cards-intro__title, .cards-intro__footer", { y: -80, opacity: 0, duration: 1 }, 0);
        if (isDesktop) {
            scrollTl.to(".cards-intro__bubble--left, .cards-intro__bubble--right", { scale: 0, opacity: 0, duration: 0.5 }, 0);
        }

        // Промежуточная анимация при скролле: карточки собираются в центре
        scrollTl.to(".cards-intro__card", {
            left: isMobile ? "calc(50% - 50px)" : "550px",
            top: isMobile ? "80px" : "140px",
            rotation: 0,
            scale: isMobile ? 0.85 : 0.95, // Немного уменьшили масштаб
            boxShadow: "0 0px 0px rgba(15, 23, 42, 0)",
            duration: 1.5,
            stagger: 0.05,
            ease: "power2.inOut"
        }, 0);

        // ФИНАЛЬНЫЕ КООРДИНАТЫ (Компактный каскад)
        const cascadePositions = isDesktop ? [
            { left: "420px", top: "80px" },
            { left: "510px", top: "110px" },
            { left: "600px", top: "140px" },
            { left: "690px", top: "170px" },
            { left: "780px", top: "200px" },
            { left: "870px", top: "230px" }
        ] : [
            // Теперь карточки собраны намного плотнее и выше, чтобы не пересекать showcase
            { left: "calc(50% - 100px)", top: "160px" },
            { left: "calc(50% - 75px)",  top: "175px" },
            { left: "calc(50% - 50px)",  top: "190px" },
            { left: "calc(50% - 25px)",  top: "205px" },
            { left: "calc(50% + 0px)",   top: "220px" },
            { left: "calc(50% + 25px)",  top: "235px" }
        ];

        scrollTl.to(".cards-intro__card", {
            left: (i) => cascadePositions[i] ? cascadePositions[i].left : (isMobile ? "calc(50% - 50px)" : "870px"),
            top: (i) => cascadePositions[i] ? cascadePositions[i].top : (isMobile ? "235px" : "230px"),
            rotation: 0,
            scale: isMobile ? 0.85 : 1.1, // Оставляем их компактными
            boxShadow: "0 16px 32px rgba(15, 23, 42, 0.15)",
            duration: 1.5,
            ease: "power2.out",
            stagger: 0
        }, 1.8);

    }); // <-- THIS WAS THE MISSING BRACKET

    // =================================================================
    // 5. SHOWCASE ANIMATION (Natural flow without gaps)
    // =================================================================
    const showcaseBigTitle = document.querySelector(".showcase__big-title");
    if (showcaseBigTitle) {
        showcaseBigTitle.innerHTML = `
            <div style="display:block">
                <div class="showcase-word" style="display:inline-block; vertical-align:top;">A&nbsp;</div>
                <div class="showcase-word" style="display:inline-block; vertical-align:top;">curated&nbsp;</div>
                <div class="showcase-word" style="display:inline-block; vertical-align:top;">space&nbsp;</div>
                <div class="showcase-word" style="display:inline-block; vertical-align:top;">to&nbsp;</div>
                <div class="showcase-word" style="display:inline-block; vertical-align:top;">share&nbsp;</div>
                <div class="showcase-word" style="display:inline-block; vertical-align:top; color:var(--color-primary);">your&nbsp;</div>
            </div>
            <div style="display:block">
                <div class="showcase-word" style="display:inline-block; vertical-align:top;">creative&nbsp;</div>
                <div class="showcase-word" style="display:inline-block; vertical-align:top;">vision.</div>
            </div>
        `;
    }

    const showcaseTrustTitle = document.querySelector(".showcase__trust-title");
    if (showcaseTrustTitle) {
        showcaseTrustTitle.innerHTML = `
            <div style="display:block">
                <div class="showcase-trust-word" style="display:inline-block; vertical-align:top;">Trusted&nbsp;</div>
                <div class="showcase-trust-word" style="display:inline-block; vertical-align:top;">by&nbsp;</div>
                <div class="showcase-trust-word" style="display:inline-block; vertical-align:top; color:var(--color-primary);">The&nbsp;Best.</div>
            </div>
        `;
    }

    gsap.set(".showcase-word, .showcase-trust-word, .showcase__trust-description", { opacity: 0, y: 30 });
    gsap.set(".showcase__image", { opacity: 0, y: 50 });
    gsap.set(".showcase__preview-card", { opacity: 0, y: 30 });

    const showcaseTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".showcase",
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });

    showcaseTl
        .to(".showcase-word", { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: "power2.out" })
        .to(".showcase__image", { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.4")
        .to(".showcase__preview-card", { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.5)" }, "-=0.5")
        .to(".showcase-trust-word", { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: "power2.out" }, "-=0.4")
        .to(".showcase__trust-description", { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.3");

    // =================================================================
    // 6. SIGNUP CTA ANIMATION (Slower, elegant pace)
    // =================================================================
    const signupTitle = document.querySelector(".signup-cta__title");
    if (signupTitle) {
        signupTitle.innerHTML = `
            <div style="display:block">
                <div class="signup-word" style="display:inline-block; vertical-align:top;">Start&nbsp;</div>
                <div class="signup-word" style="display:inline-block; vertical-align:top;">your&nbsp;</div>
                <div class="signup-word" style="display:inline-block; vertical-align:top;">reading&nbsp;</div>
            </div>
            <div style="display:block">
                <div class="signup-word" style="display:inline-block; vertical-align:top;">journey&nbsp;</div>
                <div class="signup-word" style="display:inline-block; vertical-align:top;">today.</div>
            </div>
        `;
    }

    gsap.set(".signup-word", { opacity: 0, y: 40 });
    gsap.set(".signup-cta__description", { opacity: 0, y: 20 });
    gsap.set(".signup-cta__form", { opacity: 0, y: 60, scale: 0.95 });

    const signupTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".signup-cta__container",
            start: "top 75%",
            toggleActions: "play none none reverse"
        }
    });

    signupTl
        .to(".signup-word", { y: 0, opacity: 1, duration: 1.4, stagger: 0.15, ease: "power2.out" })
        .to(".signup-cta__description", { y: 0, opacity: 1, duration: 1.0, ease: "power2.out" }, "-=0.8")
        .to(".signup-cta__form", { y: 0, opacity: 1, scale: 1, duration: 1.4, ease: "back.out(1.2)" }, "-=0.8");

    // =================================================================
    // 7. AUTH MODALS LOGIC (Login & Signup)
    // =================================================================
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');

    // Buttons that trigger the Login modal
    const loginBtns = document.querySelectorAll('.landing-nav__login');
    // Buttons that trigger the Sign Up modal
    const signupBtns = document.querySelectorAll('.landing-nav__signup, .cards-intro__btn--primary');

    // Universal function to open a modal
    const openModal = (modalElement) => {
        if (!modalElement) return;
        modalElement.classList.add('is-active');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
    };

    // Universal function to close all modals
    const closeAllModals = () => {
        if (loginModal) loginModal.classList.remove('is-active');
        if (signupModal) signupModal.classList.remove('is-active');
        document.body.style.overflow = ''; // Restore background scrolling
    };

    // Bind open events
    loginBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(loginModal);
        });
    });

    signupBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(signupModal);
        });
    });

    // Bind close events (close button or overlay click)
    document.querySelectorAll('[data-close]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            closeAllModals();
        });
    });
});