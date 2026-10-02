// noinspection JSUnresolvedReference, JSCheckFunctionSignatures, JSUnusedGlobalSymbols
/* global gsap, ScrollTrigger */
// --- Extracted from post.html (Script 1) ---
document.addEventListener('DOMContentLoaded', () => {
        // Comments Modal Logic
        const btnViewAll = document.querySelector('.comments__view-all');
        const commentsModal = document.getElementById('comments-modal');
        const closeCommentsModal = document.querySelector('.comments-modal__close');

        if (btnViewAll && commentsModal && closeCommentsModal) {
            const openModal = () => {
                commentsModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            };
            
            const closeModal = () => {
                commentsModal.classList.remove('active');
                document.body.style.overflow = '';
            };

            btnViewAll.addEventListener('click', openModal);
            closeCommentsModal.addEventListener('click', closeModal);

            // Close on overlay click
            commentsModal.addEventListener('click', (e) => {
                if (e.target === commentsModal) {
                    closeModal();
                }
            });

            // Close on ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && commentsModal.classList.contains('active')) {
                    closeModal();
                }
            });
        }
    });

