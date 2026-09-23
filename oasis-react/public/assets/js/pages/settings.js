// noinspection JSUnresolvedReference, JSCheckFunctionSignatures, JSUnusedGlobalSymbols
/* global gsap, ScrollTrigger */
// --- Extracted from settings.html (Script 1) ---
document.addEventListener('DOMContentLoaded', () => {
            // Tab Switching Logic
            const navItems = document.querySelectorAll('.nav-item');
            const panes = document.querySelectorAll('.settings-pane');

            navItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Remove active class from all tabs
                    navItems.forEach(nav => nav.classList.remove('active'));
                    
                    // Add active class to clicked tab
                    item.classList.add('active');
                    
                    // Hide all panes
                    panes.forEach(pane => pane.style.display = 'none');
                    
                    // Show target pane
                    const targetId = item.getAttribute('data-target');
                    const targetPane = document.getElementById(targetId);
                    if (targetPane) {
                        targetPane.style.display = 'block';
                    }
                });
            });

            
            
            
            // Toggle Switches Logic
            const toggles = document.querySelectorAll('.toggle-switch');
            toggles.forEach(toggle => {
                toggle.addEventListener('click', () => {
                    toggle.classList.toggle('off');
                });
            });
        });

