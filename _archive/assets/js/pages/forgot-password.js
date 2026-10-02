// noinspection JSUnresolvedReference, JSCheckFunctionSignatures, JSUnusedGlobalSymbols
/* global gsap, ScrollTrigger */
// --- Extracted from forgot-password.html (Script 1) ---
document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('forgot-form');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const emailInput = document.getElementById('email').value;
                    const btn = form.querySelector('.btn-auth');
                    if (emailInput && btn) {
                        btn.classList.add('btn-loading');
                        setTimeout(() => {
                            btn.classList.remove('btn-loading');
                            document.getElementById('reset-request-view').style.display = 'none';
                            document.getElementById('sent-email').innerText = emailInput;
                            document.getElementById('reset-success-view').style.display = 'flex';
                        }, 800);
                    }
                });
            }
        });

