// noinspection JSUnresolvedReference, JSCheckFunctionSignatures, JSUnusedGlobalSymbols
/* global gsap, ScrollTrigger */
// --- Extracted from edit-post.html (Script 1) ---
document.addEventListener('DOMContentLoaded', () => {
            

            
            // Rich Text Formatting
            const btnBold = document.getElementById('btn-bold');
            const btnItalic = document.getElementById('btn-italic');
            const btnLink = document.getElementById('btn-link');
            const btnH2 = document.getElementById('btn-h2');
            const btnQuote = document.getElementById('btn-quote');
            const editorBody = document.getElementById('editor-body');

            function execCmd(command, value = null) {
                document.execCommand(command, false, value);
                editorBody.focus();
                updateToolbar();
            }

            if (editorBody) {
                if (btnBold) btnBold.addEventListener('click', () => execCmd('bold'));
                if (btnItalic) btnItalic.addEventListener('click', () => execCmd('italic'));
                if (btnLink) btnLink.addEventListener('click', () => {
                    const url = prompt('Enter link URL:');
                    if (url) execCmd('createLink', url);
                });
                if (btnH2) btnH2.addEventListener('click', () => {
                    const isH2 = document.queryCommandValue('formatBlock') === 'h2';
                    execCmd('formatBlock', isH2 ? 'div' : 'H2');
                });
                if (btnQuote) btnQuote.addEventListener('click', () => {
                    const isQuote = document.queryCommandValue('formatBlock') === 'blockquote';
                    execCmd('formatBlock', isQuote ? 'div' : 'BLOCKQUOTE');
                });

                // Selection Listener
                function updateToolbar() {
                    if (document.queryCommandState('bold')) btnBold.classList.add('active'); else btnBold.classList.remove('active');
                    if (document.queryCommandState('italic')) btnItalic.classList.add('active'); else btnItalic.classList.remove('active');
                    
                    const formatBlock = document.queryCommandValue('formatBlock');
                    if (formatBlock === 'h2') btnH2.classList.add('active'); else btnH2.classList.remove('active');
                    if (formatBlock === 'blockquote') btnQuote.classList.add('active'); else btnQuote.classList.remove('active');
                }

                editorBody.addEventListener('keyup', updateToolbar);
                editorBody.addEventListener('mouseup', updateToolbar);
                editorBody.addEventListener('click', updateToolbar);
                editorBody.addEventListener('input', updateToolbar);
            }

            // Complete Taxonomy
            const categoryData = {
              "Code & Development": ["HTML & CSS Architecture", "Grid & Flexbox Layouts", "Web Animations", "Responsive Components", "Other"],
              "Travel & Outdoors": ["Mountain Hiking", "Alpine Routes", "Gear & Preparation", "Travel Logistics", "Other"],
              "Photography & Film": ["Camera Settings", "Landscape & Nature", "Video & Slow-Motion", "Post-Production", "Other"],
              "Design & Interfaces": ["Figma Mastery", "Minimalist UI", "Typography", "UX Case Studies", "Other"],
              "Science & Technology": ["Ecosystems & Devices", "Audio & Streaming Systems", "Software & Tools", "Tech Trends", "Other"],
              "Music & Culture": ["Progressive & Classic Rock", "Alternative & Synthpop", "Artist Retrospectives", "Music Theory & Meaning", "Other"],
              "Food & Culinary": ["Healthy Grains", "Cheese & Veggie Bowls", "Quick Everyday Meals", "Culinary Chemistry", "Other"],
              "Automotive & Mobility": ["Classic & Sports Cars", "Ownership & Insurance", "Driving Culture", "Road Trips", "Other"],
              "Education & Lifestyle": ["Student Life", "Financial Logistics", "Productivity", "Career & Freelance", "Other"],
              "Literature & Culture": ["Dystopian Fiction", "Literary Influences", "Modern Prose", "Art & Society", "Other"],
              "Sports & Movement": ["Action & Extreme", "Fitness & Lifestyle", "Pro & Competitive", "Body & Recovery"],
              "Other": ["Other"]
            };

            const mainRow = document.getElementById('main-categories-row');
            const subRow = document.getElementById('sub-categories-row');

            const btnDraft = document.getElementById('btn-draft');
            const btnPublish = document.getElementById('btn-publish');

            function checkValidation() {
                const title = document.querySelector('.editor-title').value.trim();
                const hasImage = document.getElementById('upload-zone').classList.contains('has-image');
                const subtitle = document.querySelector('.editor-subtitle').value.trim();
                const mainActive = document.querySelector('.main-tag.active');
                const subRow = document.getElementById('sub-categories-row');
                const subActive = subRow ? subRow.querySelector('.tag.active') : null;
                const bodyContent = document.getElementById('editor-body').innerText.trim();
                const wrapper = document.getElementById('footer-tooltip-wrapper');
                
                let missingFields = [];
                if (!title) missingFields.push('title');
                if (!hasImage) missingFields.push('picture');
                if (!subtitle) missingFields.push('subtitle');
                if (!mainActive || !subActive) missingFields.push('category');
                if (!bodyContent) missingFields.push('main text');

                if (missingFields.length === 0) {
                    if (btnDraft) btnDraft.disabled = false;
                    if (btnPublish) btnPublish.disabled = false;
                    if (wrapper) wrapper.classList.remove('show-tooltip');
                } else {
                    if (btnDraft) btnDraft.disabled = true;
                    if (btnPublish) btnPublish.disabled = true;
                    if (wrapper) wrapper.classList.add('show-tooltip');
                    
                    let msg;
                    if (missingFields.length > 1) {
                        msg = "Please fill out all required fields to continue.";
                    } else {
                        msg = "Please add a " + missingFields[0] + " to continue.";
                    }
                    wrapper.setAttribute('data-tooltip', msg);
                }
            }
            
            // Add event listeners to input fields to trigger validation
            document.querySelector('.editor-title').addEventListener('input', checkValidation);
            document.querySelector('.editor-subtitle').addEventListener('input', checkValidation);
            document.getElementById('editor-body').addEventListener('input', checkValidation);
            checkValidation(); // Initial check
            function renderSubCategories(mainCat) {
                if (!subRow) return;
                
                // Fade out transition
                subRow.style.opacity = '0';
                
                setTimeout(() => {
                    subRow.innerHTML = ''; // Clear row 2
                    checkValidation();
                    const subs = categoryData[mainCat] || [];
                    subs.forEach(sub => {
                        const btn = document.createElement('button');
                        btn.className = 'tag';
                        btn.innerText = String(sub);
                        btn.addEventListener('click', () => {
                            btn.classList.toggle('active'); checkValidation();
                        });
                        subRow.appendChild(btn);
                    });
                    
                    // Fade in transition
                    subRow.style.opacity = '1';
                }, 150);
            }

            if (mainRow && subRow) {
                Object.keys(categoryData).forEach((mainCat) => {
                    const btn = document.createElement('button');
                    btn.className = 'tag main-tag';
                    btn.innerText = mainCat;
                    
                    

                    btn.addEventListener('click', () => {
                        // Deselect other main categories
                        document.querySelectorAll('.main-tag').forEach(t => t.classList.remove('active'));
                        btn.classList.add('active');
                        renderSubCategories(mainCat); checkValidation();
                    });
                    
                    mainRow.appendChild(btn);
                });
            }

            // Upload File Handling & Drag/Drop
            const uploadZone = document.getElementById('upload-zone');
            const fileInput = document.getElementById('cover-upload');
            
            function handleFile(file) {
                if (file && file.type.startsWith('image/')) {
                    const url = URL.createObjectURL(file);
                    uploadZone.style.backgroundImage = `url('${url}')`;
                    uploadZone.style.backgroundSize = 'cover';
                    uploadZone.style.backgroundPosition = 'center';
                    uploadZone.classList.add('has-image');
                    checkValidation(); // Trigger validation on image upload
                }
            }

            if(uploadZone && fileInput) {
                // Click to browse
                uploadZone.addEventListener('click', (e) => {
                    if (e.target !== fileInput) {
                        fileInput.click();
                    }
                });

                // Input change (file selected)
                fileInput.addEventListener('change', (e) => {
                    if (e.target.files.length > 0) {
                        handleFile(e.target.files[0]);
                    }
                });

                // Drag over
                uploadZone.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    uploadZone.classList.add('drag-active');
                });

                // Drag leave
                uploadZone.addEventListener('dragleave', (e) => {
                    e.preventDefault();
                    uploadZone.classList.remove('drag-active');
                });

                // Drop
                uploadZone.addEventListener('drop', (e) => {
                    e.preventDefault();
                    uploadZone.classList.remove('drag-active');
                    if (e.dataTransfer.files.length > 0) {
                        fileInput.files = e.dataTransfer.files;
                        handleFile(e.dataTransfer.files[0]);
                    }
                });
            }
            // --- EDIT MODE PRE-FILL SIMULATION ---
            setTimeout(() => {
                const targetMain = Array.from(document.querySelectorAll('.main-tag')).find(btn => btn.innerText === 'Design & Interfaces');
                if (targetMain) {
                    targetMain.click(); // Select main category
                    setTimeout(() => {
                        const targetSub = Array.from(document.querySelectorAll('#sub-categories-row .tag')).find(btn => btn.innerText === 'Minimalist UI');
                        if (targetSub) {
                            targetSub.click(); // Select sub category
                            checkValidation(); // Ensure buttons unlock
                        }
                    }, 200);
                }
            }, 300);
        });

