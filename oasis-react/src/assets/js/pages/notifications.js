// noinspection JSUnresolvedReference, JSCheckFunctionSignatures, JSUnusedGlobalSymbols
/* global gsap, ScrollTrigger */
// --- Extracted from notifications.html (Script 1) ---
document.addEventListener('DOMContentLoaded', () => {
        const btnMarkRead = document.getElementById('btn-mark-all-read');
        if (btnMarkRead) {
            btnMarkRead.addEventListener('click', () => {
                const unreadItems = document.querySelectorAll('.notification-item.unread');
                unreadItems.forEach(item => {
                    item.classList.remove('unread');
                });
            });
        }

        const btnFollow = document.getElementById('btn-follow-back');
        if (btnFollow) {
            btnFollow.addEventListener('click', (e) => {
                e.preventDefault();
                if (btnFollow.innerText === 'Follow') {
                    btnFollow.innerText = 'Following';
                    btnFollow.style.background = 'var(--color-bg-light)';
                    btnFollow.style.color = 'var(--color-text-main)';
                    btnFollow.style.border = '1px solid var(--color-border)';
                } else {
                    btnFollow.innerText = 'Follow';
                    btnFollow.style.background = 'var(--color-primary)';
                    btnFollow.style.color = 'white';
                    btnFollow.style.border = 'none';
                }
            });
        }
    });

    // Tab switching logic and filtering for notifications
    const filterTabs = document.querySelectorAll('.filter-tab');
    const notifItems = document.querySelectorAll('.notification-item');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active state
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Filter logic
            const filter = tab.getAttribute('data-filter');
            notifItems.forEach(item => {
                if (filter === 'all') {
                    item.style.display = 'flex';
                } else {
                    const type = item.getAttribute('data-type');
                    // Show item if its type matches the filter. 'like' and 'comment' both fall under 'Mentions'
                    if (type === filter || (filter === 'mention' && type === 'like')) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
        });
    });

