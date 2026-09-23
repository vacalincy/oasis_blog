// noinspection JSUnresolvedReference, JSCheckFunctionSignatures, JSUnusedGlobalSymbols
/* global gsap, ScrollTrigger */
// --- Extracted from 403.html (Script 1) ---
const images = [
            '../assets/images/content/q1.jpg', '../assets/images/content/q2.jpg', '../assets/images/content/q3.jpg', '../assets/images/content/q4.jpg', '../assets/images/content/q5.jpg', '../assets/images/content/q6.jpg', '../assets/images/content/q7.jpg', '../assets/images/content/q8.jpg', '../assets/images/content/q9.jpg', '../assets/images/content/q10.jpg', '../assets/images/content/q11.jpg', '../assets/images/content/q12.jpg', '../assets/images/content/q13.jpg', '../assets/images/content/q14.jpg', '../assets/images/content/q15.jpg', '../assets/images/content/q16.jpg', '../assets/images/content/q17.jpg', '../assets/images/content/q18.jpg', '../assets/images/content/q19.jpg', '../assets/images/content/q20.jpg', '../assets/images/content/q21.jpg', '../assets/images/content/q22.jpg', '../assets/images/content/q23.jpg', '../assets/images/content/q24.jpg', '../assets/images/content/q25.jpg', '../assets/images/content/q26.jpg', '../assets/images/content/q27.jpg', '../assets/images/content/q28.jpg', '../assets/images/content/q30.jpg', '../assets/images/content/q31.jpg', '../assets/images/content/q32.jpg', '../assets/images/content/q33.jpg', '../assets/images/content/q34.jpg', '../assets/images/content/q35.jpg', '../assets/images/content/q36.jpg'
        ];
        let imgIndex = 0;
        function getNextImage() {
            const img = images[imgIndex];
            imgIndex = (imgIndex + 1) % images.length;
            return img;
        }
        const grid14x7 = [
            [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0],
            [0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1],
            [1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1],
            [0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1],
            [0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0],
        ];
        const wrapper = document.getElementById('icon-grid');
        let delayCounter = 0;
        grid14x7.forEach((row) => {
            row.forEach(cell => {
                const el = document.createElement('div');
                if (cell === 1) {
                    el.className = 'icon-cell';
                    el.style.backgroundImage = `url('${getNextImage()}')`;
                    el.style.animationDelay = `${delayCounter * 0.05}s`;
                    delayCounter++;
                } else {
                    el.className = 'empty-cell';
                }
                wrapper.appendChild(el);
            });
        });

