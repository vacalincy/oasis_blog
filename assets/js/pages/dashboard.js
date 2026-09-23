// noinspection JSUnresolvedReference, JSCheckFunctionSignatures, JSUnusedGlobalSymbols
/* global gsap, ScrollTrigger */
// --- Extracted from dashboard.html (Script 1) ---
document.addEventListener('DOMContentLoaded', () => {
        // Tab switching logic for main content
        const tabs = document.querySelectorAll('.content-tabs .tab-pill');
        const indicator = document.querySelector('.active-tab-indicator');

        
        // Share Profile Modal Logic
        const btnShareProfile = document.getElementById('btn-share-profile');
        const shareProfileModal = document.getElementById('shareProfileModal');
        const closeShareModal = document.getElementById('closeShareModal');
        const copyShareLink = document.getElementById('copyShareLink');
        const shareLinkInput = document.getElementById('shareLinkInput');

        if (btnShareProfile && shareProfileModal && closeShareModal) {
            const openShareModal = () => {
                shareProfileModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            };
            
            const closeShareModalFn = () => {
                shareProfileModal.classList.remove('active');
                document.body.style.overflow = '';
            };

            btnShareProfile.addEventListener('click', openShareModal);
            closeShareModal.addEventListener('click', closeShareModalFn);

            // Close on overlay click
            shareProfileModal.addEventListener('click', (e) => {
                if (e.target === shareProfileModal) {
                    closeShareModalFn();
                }
            });
            
            // Close on ESC key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && shareProfileModal.classList.contains('active')) {
                    closeShareModalFn();
                }
            });
            
            // Copy link functionality
            if (copyShareLink && shareLinkInput) {
                copyShareLink.addEventListener('click', () => {
                    shareLinkInput.select();
                    shareLinkInput.setSelectionRange(0, 99999); /* For mobile devices */
                    navigator.clipboard.writeText(shareLinkInput.value).then(() => {
                        const originalHTML = copyShareLink.innerHTML;
                        copyShareLink.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                        if (window.showToast) window.showToast('Link copied to clipboard!');
                        setTimeout(() => {
                            copyShareLink.innerHTML = originalHTML;
                        }, 2000);
                    });
                });
            }
        }

        function updateIndicator(activeTab) {
            if (!activeTab || !indicator) return;
            indicator.style.width = activeTab.offsetWidth + 'px';
            indicator.style.left = activeTab.offsetLeft + 'px';
        }

        const initialActive = document.querySelector('.content-tabs .tab-pill.active');
        if (initialActive) {
            setTimeout(() => updateIndicator(initialActive), 10);

        // Follow / Unfollow logic
        const followBtns = document.querySelectorAll('.btn-following-action');
        followBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('unfollowed')) {
                    btn.classList.remove('unfollowed');
                    btn.innerText = 'unfollow';
                } else {
                    btn.classList.add('unfollowed');
                    btn.innerText = 'follow';
                }
            });
        });


        }

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                tabs.forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');
                updateIndicator(e.currentTarget);

                const target = e.currentTarget.getAttribute('data-target');
                if (target) {
                    document.querySelectorAll('.dashboard-main .tab-pane').forEach(pane => {
                        pane.style.display = 'none';
                    });
                    const targetPane = document.getElementById('pane-' + target);
                    if (targetPane) {
                        targetPane.style.display = 'block';
                    }
                }
            });
        });

        // Following Modal Logic
        const btnFollowing = document.getElementById('btn-following');
        const followingOverlay = document.getElementById('following-modal-overlay');
        const btnCloseFollowingModal = document.querySelector('.btn-close-modal');

        if (btnFollowing && followingOverlay) {
            btnFollowing.addEventListener('click', () => {
                followingOverlay.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            });

            const closeFollowing = () => {
                followingOverlay.classList.add('hidden');
                document.body.style.overflow = '';
            };

            btnCloseFollowingModal.addEventListener('click', closeFollowing);

            followingOverlay.addEventListener('click', (e) => {
                if (e.target === followingOverlay) {
                    closeFollowing();
                }
            });
            
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && !followingOverlay.classList.contains('hidden')) {
                    closeFollowing();
                }
            });
        }

        // Inline Profile Editing Logic
        const btnEditProfile = document.getElementById('btn-edit-profile');
        const btnSettings = document.getElementById('btn-settings');
        
        const btnSaveProfile = document.getElementById('btn-save-profile');
        const btnCancelProfile = document.getElementById('btn-cancel-profile');
        const coverOverlay = document.getElementById('change-photo-btn');
        const nameText = document.getElementById('profile-name-text');
        const nameInput = document.getElementById('profile-name-input');
        const bioText = document.getElementById('profile-bio-text');
        const bioInput = document.getElementById('profile-bio-input');
        const dashboardHero = document.querySelector('.dashboard-hero');

        let originalName = '';
        let originalBio = '';
        let originalBg = '';

        function toggleEditMode(isEditing) {
            if (isEditing) {
                originalName = nameText.innerText;
                originalBio = bioText.innerText;
                originalBg = dashboardHero.style.backgroundImage;

                nameInput.value = originalName;
                bioInput.value = originalBio;
                const charCounter = document.getElementById('bio-char-counter');
                if (charCounter) charCounter.innerText = `${originalBio.length}/160`;

                btnEditProfile.style.display = 'none';
                if(btnSettings) btnSettings.style.display = 'none';
            document.getElementById('btn-support').style.display = 'none';
                
                btnSaveProfile.style.display = 'inline-flex';
                btnCancelProfile.style.display = 'inline-flex';

                nameText.style.display = 'none';
                nameInput.style.display = 'block';
                bioText.style.display = 'none';
                bioInput.style.display = 'block';
                if (charCounter) charCounter.style.display = 'block';

                coverOverlay.style.display = 'inline-flex';
            } else {
                btnEditProfile.style.display = 'inline-flex';
                if(btnSettings) btnSettings.style.display = 'inline-flex';
                const btnSupport = document.getElementById('btn-support');
                if (btnSupport) btnSupport.style.display = 'inline-flex';
                
                btnSaveProfile.style.display = 'none';
                btnCancelProfile.style.display = 'none';

                nameText.style.display = 'block';
                nameInput.style.display = 'none';
                bioText.style.display = 'block';
                bioInput.style.display = 'none';
                const charCounter = document.getElementById('bio-char-counter');
                if (charCounter) charCounter.style.display = 'none';

                coverOverlay.style.display = 'none';
            }
        }

        if (btnEditProfile) {
            btnEditProfile.addEventListener('click', () => toggleEditMode(true));
            btnCancelProfile.addEventListener('click', () => {
                dashboardHero.style.backgroundImage = originalBg;
                toggleEditMode(false);
            });
            btnSaveProfile.addEventListener('click', () => {
                nameText.innerText = nameInput.value;
                bioText.innerText = bioInput.value;
                toggleEditMode(false);
            });
        }

        if (bioInput) {
            bioInput.addEventListener('input', () => {
                document.getElementById('bio-char-counter').innerText = `${bioInput.value.length}/160`;
            });
        }

        
        if (btnSettings) {
            btnSettings.addEventListener('click', () => {
                window.location.href = 'settings.html';
            });
        }

        // Handle Cover Photo Upload Preview
        const coverPhotoInput = document.getElementById('cover-photo-input');
        if (coverPhotoInput && dashboardHero) {
            coverPhotoInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const objectUrl = URL.createObjectURL(file);
                    dashboardHero.style.backgroundImage = `url('${objectUrl}')`;
                }
            });
        }

        // Re-calculate on window resize
        window.addEventListener('resize', () => {
            const active = document.querySelector('.content-tabs .tab-pill.active');
            if (active) updateIndicator(active);
        });
    });

