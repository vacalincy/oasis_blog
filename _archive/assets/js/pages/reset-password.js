// noinspection JSUnresolvedReference, JSCheckFunctionSignatures, JSUnusedGlobalSymbols
/* global gsap, ScrollTrigger */
// --- Extracted from reset-password.html (Script 1) ---
function handleReset(e) {
            e.preventDefault();
            const pass1 = document.getElementById('new-password').value;
            const pass2 = document.getElementById('confirm-password').value;
            const errorMsg = document.getElementById('password-error');
            
            if (pass1 !== pass2) {
                errorMsg.style.display = 'block';
                document.getElementById('confirm-password').style.borderColor = '#e53e3e';
            } else {
                errorMsg.style.display = 'none';
                document.getElementById('confirm-password').style.borderColor = 'var(--color-border)';
                // Simulate success
                const btn = document.querySelector('.btn-auth');
                btn.classList.add('btn-loading');
                setTimeout(() => {
                    btn.classList.remove('btn-loading');
                    btn.innerText = 'Password Reset!';
                    btn.style.background = '#10B981';
                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 1000);
                }, 800);
            }
        }

