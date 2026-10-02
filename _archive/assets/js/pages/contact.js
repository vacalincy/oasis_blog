// noinspection JSUnresolvedReference, JSCheckFunctionSignatures, JSUnusedGlobalSymbols
/* global gsap, ScrollTrigger */
// --- Extracted from contact.html (Script 1) ---
document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('contact-form');
            const resetBtn = document.getElementById('btn-reset');
            const successMessage = document.getElementById('success-message');

            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    // Hide form, show success
                    form.style.display = 'none';
                    successMessage.style.display = 'block';
                });
            }

            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    form.reset();
                    form.style.display = 'block';
                    successMessage.style.display = 'none';
                });
            }
        });

