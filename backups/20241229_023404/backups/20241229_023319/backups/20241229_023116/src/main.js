console.log('🎯 Debug: main.js loaded');

import { VoidboxCore } from './core.js';
import themeManager from './theme.js';

console.log('🚀 Voidbox initializing...');

// Initialize Voidbox core
const voidbox = new VoidboxCore({
    webhookUrls: {
        'zero-background': 'https://hook.us1.make.com/f3d6i90kedqpcuut3y1691cs3onnjofw'
    }
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 DOM loaded');

    // DOM Elements
    const promptInput = document.getElementById('prompt');
    const generateBtn = document.getElementById('generate-btn');
    const resultContainer = document.getElementById('result-container');
    const loadingIndicator = document.getElementById('loading');
    const historyContainer = document.getElementById('history-container');
    const themeToggle = document.getElementById('theme-toggle');

    // Debug logging
    console.log('🔍 Debug: DOM Elements found:', {
        promptInput: !!promptInput,
        generateBtn: !!generateBtn,
        resultContainer: !!resultContainer,
        loadingIndicator: !!loadingIndicator,
        historyContainer: !!historyContainer,
        themeToggle: !!themeToggle
    });

    // Initialize theme and add click listener
    themeManager.init();
    if (themeToggle) {
        console.log('🎯 Adding click listener to theme toggle');
        themeToggle.addEventListener('click', () => {
            console.log('🌓 Theme toggle clicked!');
            themeManager.toggle();
        });
    }

    // Create fullscreen view container
    const fullscreenView = document.createElement('div');
    fullscreenView.id = 'fullscreen-view';
    document.body.appendChild(fullscreenView);

    // Create email form
    const emailForm = document.createElement('div');
    emailForm.className = 'email-form';
    emailForm.innerHTML = `
        <h3>Share Image</h3>
        <input type="email" id="email-input" placeholder="Enter email address">
        <button id="send-email">Send</button>
        <button id="cancel-email">Cancel</button>
    `;
    document.body.appendChild(emailForm);

    // Event listeners for generation
    if (generateBtn) {
        console.log('🎯 Adding click listener to generate button');
        generateBtn.addEventListener('click', () => {
            console.log('🖱️ Generate button clicked!');
            handleGenerate();
        });
    }

    if (promptInput) {
        console.log('🎯 Adding keypress listener to prompt input');
        promptInput.addEventListener('keypress', (e) => {
            console.log('⌨️ Key pressed:', e.key);
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
            }
        });
    }

    // Create datalist for prompt history
    const promptHistory = document.createElement('datalist');
    promptHistory.id = 'prompt-history';
    document.body.appendChild(promptHistory);

    // Show prompt history only on click
    promptInput.addEventListener('click', () => {
        promptInput.setAttribute('list', 'prompt-history');
        const { prompts } = voidbox.getHistory();
        updatePromptHistory(prompts);
    });

    // Hide prompt history when input loses focus
    promptInput.addEventListener('blur', () => {
        promptInput.removeAttribute('list');
    });

    // Load image history
    const { images } = voidbox.getHistory();
    images.forEach(url => addToHistory(url));

    // Info dropdowns
    const infoToggles = document.querySelectorAll('.info-toggle');
    let activeDropdown = null;

    infoToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdownId = toggle.getAttribute('aria-controls');
            const dropdown = document.getElementById(dropdownId);
            
            // Close any open dropdown
            if (activeDropdown && activeDropdown !== dropdown) {
                closeDropdown(activeDropdown);
            }
            
            if (dropdown.hidden) {
                openDropdown(dropdown);
                activeDropdown = dropdown;
            } else {
                closeDropdown(dropdown);
                activeDropdown = null;
            }
        });
    });

    function openDropdown(dropdown) {
        dropdown.hidden = false;
        dropdown.classList.add('active');
        dropdown.previousElementSibling.setAttribute('aria-expanded', 'true');
    }

    function closeDropdown(dropdown) {
        dropdown.classList.remove('active');
        dropdown.previousElementSibling.setAttribute('aria-expanded', 'false');
        setTimeout(() => {
            dropdown.hidden = true;
        }, 300);
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (activeDropdown && !e.target.closest('.info-toggle') && !e.target.closest('.info-dropdown')) {
            closeDropdown(activeDropdown);
            activeDropdown = null;
        }
    });

    // Prompt Guide Dropdowns
    const initPromptGuide = () => {
        const guideItems = document.querySelectorAll('.guide-item');
        let activeDropdown = null;

        const closeDropdown = (dropdown) => {
            if (dropdown) {
                dropdown.classList.remove('active');
                dropdown.setAttribute('hidden', '');
            }
        };

        const showDropdown = (dropdown) => {
            if (activeDropdown && activeDropdown !== dropdown) {
                closeDropdown(activeDropdown);
            }
            dropdown.classList.add('active');
            dropdown.removeAttribute('hidden');
            activeDropdown = dropdown;
        };

        guideItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const container = item.closest('.guide-item-container');
                const dropdown = container.querySelector('.guide-dropdown');
                
                if (dropdown.classList.contains('active')) {
                    closeDropdown(dropdown);
                    activeDropdown = null;
                } else {
                    showDropdown(dropdown);
                }
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.guide-item-container')) {
                if (activeDropdown) {
                    closeDropdown(activeDropdown);
                    activeDropdown = null;
                }
            }
        });

        // Close dropdown when pressing Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && activeDropdown) {
                closeDropdown(activeDropdown);
                activeDropdown = null;
            }
        });
    };

    initPromptGuide();

    // API endpoints
    const API_ENDPOINTS = {
        zbg: 'https://hook.us1.make.com/f3d6i90kedqpcuut3y1691cs3onnjofw',
        withBackground: 'https://hook.us1.make.com/YOUR_BACKGROUND_ENDPOINT',  // Replace with actual endpoint
        email: 'https://hook.us1.make.com/YOUR_EMAIL_ENDPOINT'  // Replace with actual endpoint
    };

    async function generateImage(prompt) {
        loadingIndicator.classList.remove('hidden');
        try {
            // Select API endpoint based on background toggle
            const endpoint = backgroundEnabled ? API_ENDPOINTS.withBackground : API_ENDPOINTS.zbg;
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt })
            });
            
            if (!response.ok) {
                throw new Error(backgroundEnabled ? 
                    'Failed to generate image with background' : 
                    'Failed to generate ZBG image'
                );
            }
            
            const data = await response.json();
            createImageContainer(data.imageUrl);
            
        } catch (error) {
            console.error('Error:', error);
            alert(error.message + '. Please try again.');
        } finally {
            loadingIndicator.classList.add('hidden');
        }
    }

    async function handleGenerate() {
        const prompt = promptInput.value.trim();
        if (!prompt) return;

        try {
            // Disable input while generating
            generateBtn.disabled = true;
            promptInput.disabled = true;

            await generateImage(prompt);
            
            // Clear input
            promptInput.value = '';
            
            // Add to prompt history
            const history = voidbox.getHistory();
            history.prompts.unshift(prompt);
            if (history.prompts.length > 10) history.prompts.pop();
            localStorage.setItem('voidbox_history', JSON.stringify(history));
            
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to generate image. Please try again.');
        } finally {
            // Re-enable input
            generateBtn.disabled = false;
            promptInput.disabled = false;
            promptInput.focus();
        }
    }

    function createImageContainer(imageUrl, isHistory = false) {
        const container = document.createElement('div');
        container.className = 'image-container';
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Generated image';
        img.loading = 'lazy';
        
        // Add loading animation
        img.style.opacity = '0';
        img.onload = () => {
            img.style.transition = 'opacity 0.3s';
            img.style.opacity = '1';
        };

        // For main image (not history), add direct download on image click
        if (!isHistory) {
            img.style.cursor = 'pointer';
            img.onclick = () => {
                const link = document.createElement('a');
                link.href = imageUrl;
                link.download = 'void-box-image.png';
                link.click();
            };
        }

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-button';
        deleteBtn.innerHTML = '×';
        deleteBtn.setAttribute('aria-label', 'Delete image');
        let clickCount = 0;
        let clickTimer;

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            clickCount++;
            if (clickCount === 1) {
                deleteBtn.innerHTML = '×';
                deleteBtn.style.background = 'rgba(220, 38, 38, 0.8)';
                clickTimer = setTimeout(() => {
                    clickCount = 0;
                    deleteBtn.innerHTML = '×';
                    deleteBtn.style.background = 'rgba(0, 0, 0, 0.5)';
                }, 300);
            } else if (clickCount === 2) {
                clearTimeout(clickTimer);
                clickCount = 0;
                container.style.transition = 'transform 0.3s, opacity 0.3s';
                container.style.transform = 'scale(0.9)';
                container.style.opacity = '0';
                setTimeout(() => {
                    container.remove();
                    // Update history
                    const history = voidbox.getHistory();
                    const updatedImages = history.images.filter(url => url !== imageUrl);
                    localStorage.setItem('voidbox_history', JSON.stringify(updatedImages));
                }, 300);
            }
        });
        
        const buttons = document.createElement('div');
        buttons.className = 'image-buttons';
        
        // View button
        const viewBtn = document.createElement('button');
        viewBtn.innerHTML = '👁️';
        viewBtn.setAttribute('aria-label', 'View full image');
        viewBtn.onclick = (e) => {
            e.stopPropagation();
            fullscreenView.innerHTML = `<img src="${imageUrl}" alt="Full size image">`;
            fullscreenView.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        };
        
        // Download button (only for history images)
        if (isHistory) {
            const downloadBtn = document.createElement('button');
            downloadBtn.innerHTML = '⬇️';
            downloadBtn.setAttribute('aria-label', 'Download image');
            downloadBtn.onclick = (e) => {
                e.stopPropagation();
                const link = document.createElement('a');
                link.href = imageUrl;
                link.download = `voidbox-${new Date().toISOString().slice(0,10)}.png`;
                link.click();
            };
            buttons.appendChild(downloadBtn);
        }

        // Email button
        const emailBtn = document.createElement('button');
        emailBtn.innerHTML = '✉️';
        emailBtn.setAttribute('aria-label', 'Share via email');
        emailBtn.onclick = (e) => {
            e.stopPropagation();
            const emailInput = document.getElementById('email-input');
            emailInput.value = '';
            emailForm.style.display = 'block';
            emailForm.dataset.imageUrl = imageUrl;
            document.body.style.overflow = 'hidden';
        };
        
        buttons.appendChild(viewBtn);
        if (!isHistory) {
            const downloadHint = document.createElement('div');
            downloadHint.className = 'download-hint';
            downloadHint.textContent = 'Click image to download';
            container.appendChild(downloadHint);
        }
        buttons.appendChild(emailBtn);
        
        container.appendChild(img);
        container.appendChild(deleteBtn);
        container.appendChild(buttons);

        if (isHistory) {
            historyContainer.insertBefore(container, historyContainer.firstChild);
        } else {
            resultContainer.innerHTML = '';
            resultContainer.appendChild(container);
            addToHistory(imageUrl);
        }
    }

    function addToHistory(imageUrl) {
        createImageContainer(imageUrl, true);
    }

    function updatePromptHistory(prompts) {
        promptHistory.innerHTML = prompts
            .map(prompt => `<option value="${prompt}">`)
            .join('');
    }

    // Fullscreen view click handler
    fullscreenView.addEventListener('click', () => {
        fullscreenView.style.display = 'none';
        document.body.style.overflow = '';
    });

    // Email form handlers
    document.getElementById('send-email')?.addEventListener('click', async () => {
        const emailInput = document.getElementById('email-input');
        const email = emailInput.value.trim();
        const imageUrl = emailForm.dataset.imageUrl;

        if (!email || !imageUrl) {
            alert('Please enter a valid email address.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        const sendBtn = document.getElementById('send-email');
        const cancelBtn = document.getElementById('cancel-email');
        
        try {
            // Disable buttons and show loading state
            sendBtn.disabled = true;
            cancelBtn.disabled = true;
            sendBtn.innerHTML = 'Sending...';

            const response = await fetch(API_ENDPOINTS.email, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: email,
                    imageUrl: imageUrl,
                    subject: 'Your Voidbox Generated Image',
                    message: `
                        Hello!

                        Here's your image generated with Voidbox.
                        
                        Generated Image: ${imageUrl}
                        
                        Feel free to download the image directly from the link above.
                        
                        Best regards,
                        Voidbox Team
                    `.trim().replace(/\n\s+/g, '\n')
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send email');
            }

            alert('Email sent successfully!');
            emailForm.style.display = 'none';
            document.body.style.overflow = '';
            emailInput.value = '';

        } catch (error) {
            console.error('Email error:', error);
            alert('Failed to send email. Please try again.');
        } finally {
            // Reset buttons
            sendBtn.disabled = false;
            cancelBtn.disabled = false;
            sendBtn.innerHTML = 'Send';
        }
    });

    document.getElementById('cancel-email')?.addEventListener('click', () => {
        emailForm.style.display = 'none';
        document.body.style.overflow = '';
        document.getElementById('email-input').value = '';
    });

    // Background toggle
    const backgroundToggle = document.getElementById('background-toggle');
    let backgroundEnabled = false;

    backgroundToggle.addEventListener('click', () => {
        backgroundEnabled = !backgroundEnabled;
        backgroundToggle.setAttribute('aria-pressed', backgroundEnabled);
        if (backgroundEnabled) {
            backgroundToggle.innerHTML = '<span class="background-icon">🖼️</span>Remove Background';
        } else {
            backgroundToggle.innerHTML = '<span class="background-icon">🖼️</span>Add Background';
        }
    });
});
