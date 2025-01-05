// Constants
const APPROVED_PROMPTS = [
    "White Wolf, blue eyes, staring, vintage, flat color, magical, woodblock",
    "American Bulldog, kind eyes, standing, vintage, flat color, patriotic, woodblock",
    "Black Cat, olive eyes, poppies, vintage, flat color, peaceful, woodblock",
    "Racoon, grin, vintage, flat color, funny, woodblock",
    "Sloth, floating on a water tube, pop art, flat color, cute, woodblock"
];

// Default prompt
const DEFAULT_PROMPT = "White Wolf, blue eyes, staring, vintage, flat color, magical, woodblock";

// State management
let isGenerating = false;
let promptHistory = JSON.parse(localStorage.getItem('promptHistory') || '[]');

/**
 * Generates an image based on the current prompt and background settings
 * @param {boolean} withBackground - Whether to generate image with background
 * @returns {Promise<void>}
 */
async function generateImage(withBackground = false) {
    if (isGenerating) return;

    const searchInput = document.getElementById('search-input');
    const result = document.getElementById('result');
    const prompt = searchInput.value.trim();
    
    if (!prompt) {
        showNotification('Please enter a prompt', true);
        return;
    }

    isGenerating = true;

    // Show loading animation
    result.innerHTML = `
        <div class="loading">
            <div class="perspective-container">
                <div class="cube">
                    <div class="cube-face front"></div>
                    <div class="cube-face back"></div>
                    <div class="cube-face right"></div>
                    <div class="cube-face left"></div>
                    <div class="cube-face top"></div>
                    <div class="cube-face bottom"></div>
                </div>
            </div>
            <p style="margin-top: 20px; color: var(--text-color);">Generating your image...</p>
        </div>
    `;

    // Hide action buttons during generation
    const actionButtons = document.querySelectorAll('.action-button');
    if (actionButtons) {
        actionButtons.forEach(button => button.style.display = 'none');
    }

    try {
        const response = await fetch(withBackground ? 
            'https://hook.us1.make.com/f3d6i90kedqpcuut3y1691cs3onnjofw' : 
            'https://hook.us1.make.com/x4gwbl1cqz789cqe23a187s411plbwo2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': window.location.origin
            },
            mode: 'cors',
            credentials: 'omit',
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            throw new Error('Generation failed');
        }

        const imageUrl = await response.text();
        updatePromptHistory(prompt);
        displayImage(imageUrl);
        
        // Show action buttons after successful generation
        if (actionButtons) {
            actionButtons.forEach(button => button.style.display = 'flex');
        }
    } catch (error) {
        console.error('Generation error:', error);
        result.innerHTML = `
            <div class="error-message">
                Failed to generate image. Please try again.
            </div>
        `;
        showNotification(error.message || 'Failed to generate image', true);
    } finally {
        isGenerating = false;
    }
}

/**
 * Opens image in new tab (view) or displays in result area
 */
function displayImage(imageUrl, isPreview = false) {
    if (isPreview) window.open(imageUrl, '_blank');
    else {
        const result = document.getElementById('result');
        if (result) {
            result.innerHTML = `<img src="${imageUrl}" alt="Generated image">`;
            addCloseButton();
        }
    }
}

/**
 * Forces file download instead of opening in browser
 */
function downloadImage(imageUrl) {
    fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            const timestamp = new Date().toISOString().replace(/[:T]/g, '-').split('.')[0];
            
            link.href = blobUrl;
            link.download = `Void-Box-${timestamp}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        })
        .catch(error => {
            console.error('Error downloading image:', error);
            showNotification('Failed to download image', true);
        });
}

/**
 * Sends image via email using Make.com webhook
 */
async function sendEmail(imageUrl, email) {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', true);
        return;
    }

    try {
        // Show loading state
        const sendButton = document.getElementById('send-email');
        const originalContent = sendButton.innerHTML;
        sendButton.innerHTML = '<div class="loading-spinner"></div>';
        sendButton.disabled = true;

        const response = await fetch('https://hook.us1.make.com/ge2xit3rtum5nvk1vfmbu89z5p9um54e', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageUrl, email })
        });

        if (!response.ok) {
            throw new Error(`Failed to send email: ${response.status}`);
        }

        // Clear and close form
        const emailForm = document.querySelector('.email-form');
        const emailInput = document.getElementById('email-input');
        emailForm.classList.remove('active');
        emailInput.value = '';
        document.getElementById('email-container').style.display = 'none';
        
        showNotification('Message sent! Please check your email', false, 5000); // Show for 5 seconds
    } catch (error) {
        console.error('Error sending email:', error);
        showNotification('Failed to send email. Please try again later.', true, 5000);
    } finally {
        // Restore send button
        const sendButton = document.getElementById('send-email');
        sendButton.innerHTML = '<img src="images/icons/send.svg" alt="Send">';
        sendButton.disabled = false;
    }
}

/**
 * Shows the email sharing form and handles the email submission
 * @param {string} imageUrl - URL of the image to share
 */
function showEmailForm(imageUrl) {
    const emailContainer = document.getElementById('email-container');
    if (emailContainer) {
        emailContainer.style.display = 'block';
        const emailInput = document.getElementById('email-input');
        if (emailInput) {
            emailInput.focus();
        }
    }
}

/**
 * Adds a close button to the current image display
 */
function addCloseButton() {
    const resultContainer = document.getElementById('result');
    if (!resultContainer) return;

    // Remove existing close button if any
    const existingButton = resultContainer.querySelector('.close-button');
    if (existingButton) {
        existingButton.remove();
    }

    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.innerHTML = `
        <span style="line-height: 1;">×</span>
        <span class="tooltip">Close</span>
    `;
    
    closeButton.addEventListener('click', () => {
        resultContainer.innerHTML = '';
        showNotification('Image deleted');
    });

    resultContainer.appendChild(closeButton);
}

/**
 * Shows a notification message to the user
 * @param {string} message - The message to display
 * @param {boolean} isError - Whether this is an error message
 * @param {number} duration - How long to show the message (ms)
 */
function showNotification(message, isError = false, duration = 3000) {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '120px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = isError ? '#f44336' : '#4caf50';
    notification.style.color = '#ffffff';
    notification.style.padding = '12px 24px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    notification.style.fontSize = '16px';
    notification.style.fontWeight = '500';
    notification.style.zIndex = '1000';
    notification.style.transition = 'opacity 0.3s ease';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

/**
 * Updates the prompt history in local storage
 * @param {string} prompt - Prompt to add to history
 */
function updatePromptHistory(prompt) {
    if (prompt && !promptHistory.includes(prompt)) {
        promptHistory.unshift(prompt);
        if (promptHistory.length > 8) {
            promptHistory.pop();
        }
        localStorage.setItem('promptHistory', JSON.stringify(promptHistory));
        displayPromptHistory();
    }
}

/**
 * Displays the prompt history UI
 */
function displayPromptHistory() {
    const searchHistory = document.getElementById('search-history');
    if (searchHistory && promptHistory.length > 0) {
        searchHistory.innerHTML = promptHistory
            .map(prompt => `<div class="history-item" tabindex="0">${prompt}</div>`)
            .join('');
        
        const historyItems = searchHistory.querySelectorAll('.history-item');
        historyItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                    searchInput.value = promptHistory[index];
                    searchInput.focus();
                }
            });
        });
    }
}

/**
 * Gets a random approved prompt from the list
 * @returns {string} Random approved prompt
 */
function getApprovedPrompt() {
    return APPROVED_PROMPTS[Math.floor(Math.random() * APPROVED_PROMPTS.length)];
}

/**
 * Toggles the theme between light and dark mode
 */
function toggleTheme() {
    document.body.setAttribute('data-theme', 
        document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    );
    localStorage.setItem('theme', document.body.getAttribute('data-theme'));
}

/**
 * Closes the email form
 */
function closeEmailForm() {
    const emailContainer = document.getElementById('email-container');
    if (emailContainer) {
        emailContainer.style.display = 'none';
    }
}

// Initialize theme
document.addEventListener('DOMContentLoaded', () => {
    // Theme initialization
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);

    // Set version display
    const versionDisplay = document.getElementById('version-display');
    if (versionDisplay) {
        versionDisplay.textContent = 'v1.3.0-beta.1';
    }

    // Setup UI elements
    const searchInput = document.getElementById('search-input');
    const clearButton = document.getElementById('clear-button');
    const withbgBtn = document.getElementById('withbg-btn');
    const generateBtn = document.getElementById('generate-btn');
    const luckyBtn = document.getElementById('lucky-btn');

    // Set up generation buttons
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            if (!isGenerating) {
                generateImage(false);  // ZBG - no background (now primary button)
            }
        });
    }

    if (withbgBtn) {
        withbgBtn.addEventListener('click', () => {
            if (!isGenerating) {
                generateImage(true);  // BG - with background (now secondary button)
            }
        });
    }

    if (luckyBtn) {
        luckyBtn.addEventListener('click', () => {
            if (!isGenerating) {
                searchInput.value = getApprovedPrompt();
                generateImage(false);  // ZBG for random prompts
            }
        });
    }

    // Set up action buttons directly
    const viewButton = document.getElementById('view-button');
    const downloadButton = document.getElementById('download-button');
    const emailButton = document.getElementById('email-button');

    if (viewButton) {
        viewButton.addEventListener('click', () => {
            console.log('View button clicked directly');
            const imageUrl = document.querySelector('#result img')?.src;
            if (imageUrl) {
                displayImage(imageUrl, true);
            }
        });
    }

    if (downloadButton) {
        downloadButton.addEventListener('click', () => {
            const imageUrl = document.querySelector('#result img')?.src;
            if (imageUrl) {
                downloadImage(imageUrl);
            }
        });
    }

    if (emailButton) {
        emailButton.addEventListener('click', () => {
            const imageUrl = document.querySelector('#result img')?.src;
            if (imageUrl) {
                showEmailForm(imageUrl);
            }
        });
    }

    // Set up search input
    if (searchInput) {
        searchInput.addEventListener('focus', () => {
            if (promptHistory.length > 0) {
                document.getElementById('search-history').classList.add('active');
            }
        });

        searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                document.getElementById('search-history').classList.remove('active');
            }, 200);
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !isGenerating) {
                generateImage(false);
            }
        });
    }

    // Set up clear button
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
                searchInput.focus();
            }
        });

        // Show/hide clear button based on input content
        searchInput.addEventListener('input', () => {
            clearButton.style.display = searchInput.value ? 'flex' : 'none';
        });

        // Initialize clear button visibility
        clearButton.style.display = searchInput.value ? 'flex' : 'none';
    }

    // Initialize prompt history
    displayPromptHistory();

    // Reset generating state when returning to main window
    window.addEventListener('focus', () => {
        isGenerating = false;
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    });

    // Run default prompt on page load
    const promptInput = document.getElementById('search-input');
    if (promptInput) {
        promptInput.value = DEFAULT_PROMPT;
        // Trigger ZBG generation
        document.getElementById('generate-btn').click();
    }
});

// Email form handling
document.addEventListener('DOMContentLoaded', () => {
    const emailButton = document.getElementById('email-button');
    const emailContainer = document.getElementById('email-container');
    const emailInput = document.getElementById('email-input');
    const closeEmailButton = document.getElementById('close-email');
    
    // Show email form
    emailButton?.addEventListener('click', () => {
        emailContainer.style.display = 'flex';
        emailInput?.focus();
    });
    
    // Close email form
    closeEmailButton?.addEventListener('click', () => {
        emailContainer.style.display = 'none';
        emailInput.value = '';
    });
    
    // Send on Enter
    emailInput?.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            const email = emailInput.value.trim();
            const imageUrl = document.querySelector('#result img')?.src;
            if (email && imageUrl) {
                await sendEmail(imageUrl, email);
                emailContainer.style.display = 'none';
            }
        }
    });
    
    // Send on button click
    document.getElementById('send-email')?.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        const imageUrl = document.querySelector('#result img')?.src;
        if (email && imageUrl) {
            await sendEmail(imageUrl, email);
            emailContainer.style.display = 'none';
        }
    });
});

// Email functionality
document.getElementById('email-button').addEventListener('click', () => {
    const emailForm = document.querySelector('.email-form');
    const emailInput = document.getElementById('email-input');
    
    // Show email form
    emailForm.classList.add('show');
    emailInput.focus();
});

document.getElementById('close-email').addEventListener('click', () => {
    const emailForm = document.querySelector('.email-form');
    emailForm.classList.remove('show');
});

document.getElementById('send-email').addEventListener('click', async () => {
    const emailInput = document.getElementById('email-input');
    const email = emailInput.value.trim();
    
    if (!email || !email.includes('@')) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    const currentImage = document.querySelector('#result img');
    if (!currentImage) {
        showNotification('No image to send', 'error');
        return;
    }
    
    try {
        const response = await fetch('/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                imageUrl: currentImage.src
            })
        });
        
        if (response.ok) {
            showNotification('Email sent successfully!', 'success');
            document.querySelector('.email-form').classList.remove('show');
            emailInput.value = '';
        } else {
            throw new Error('Failed to send email');
        }
    } catch (error) {
        showNotification('Failed to send email', 'error');
        console.error('Email error:', error);
    }
});
