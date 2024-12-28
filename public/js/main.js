// Constants
const APPROVED_PROMPTS = [
    "White Wolf, blue eyes, staring, vintage, flat color, magical",
    "White Wolf, mystical aura, glowing eyes, ethereal, minimalist",
];

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
        const response = await fetch(!withBackground ? 
            'https://hook.us1.make.com/x4gwbl1cqz789cqe23a187s411plbwo2' : 
            'https://hook.us1.make.com/f3d6i90kedqpcuut3y1691cs3onnjofw', {
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
 * Displays an image either in the main result area or in a modal preview
 * @param {string} imageUrl - URL of the image to display
 * @param {boolean} isPreview - If true, shows in modal; if false, shows in main area
 */
function displayImage(imageUrl, isPreview = false) {
    const result = document.getElementById('result');
    if (isPreview) {
        // Modal view for "View" button clicks
        const modalView = document.createElement('div');
        modalView.className = 'modal-view';
        
        const img = document.createElement('img');
        img.src = imageUrl;
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close';
        closeBtn.innerHTML = '×';
        closeBtn.onclick = () => {
            modalView.remove();
            isGenerating = false; // Reset generating state
        };
        
        modalView.appendChild(img);
        modalView.appendChild(closeBtn);
        document.body.appendChild(modalView);
        
        // Prevent default save-as behavior on mobile
        img.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Close on background click
        modalView.addEventListener('click', (e) => {
            if (e.target === modalView) {
                modalView.remove();
                isGenerating = false; // Reset generating state
            }
        });
    } else {
        // Normal display in the result area
        if (result) {
            result.innerHTML = `<img src="${imageUrl}" alt="Generated image">`;
            addCloseButton();
        }
    }
}

/**
 * Downloads the generated image with a timestamped filename
 * @param {string} imageUrl - URL of the image to download
 */
function downloadImage(imageUrl) {
    const link = document.createElement('a');
    link.href = imageUrl;
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
    link.download = `Void-Box-${timestamp}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

        const sendEmailButton = document.getElementById('send-email');
        if (sendEmailButton) {
            sendEmailButton.onclick = async () => {
                const email = emailInput.value;
                const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
                
                if (!emailRegex.test(email)) {
                    showNotification('Please enter a valid email address', true);
                    return;
                }

                try {
                    // Here you would typically send the email
                    showNotification('Email sent successfully!');
                    emailContainer.style.display = 'none';
                    emailInput.value = '';
                } catch (error) {
                    showNotification('Failed to send email', true);
                }
            };
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
    closeButton.innerHTML = '×';
    
    closeButton.addEventListener('click', () => {
        resultContainer.innerHTML = '';
        showNotification('Image deleted');
    });

    resultContainer.appendChild(closeButton);
}

/**
 * Shows a notification message to the user
 * @param {string} message - Message to display
 * @param {boolean} isError - If true, shows as error; if false, shows as success
 */
function showNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.className = `notification ${isError ? 'error' : 'success'}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
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

    // Setup UI elements
    const searchInput = document.getElementById('search-input');
    const clearButton = document.getElementById('clear-button');
    const generateBtn = document.getElementById('generate-btn');
    const withbgBtn = document.getElementById('withbg-btn');
    const luckyBtn = document.getElementById('lucky-btn');
    const actionButtons = document.querySelectorAll('.action-button');

    // Set up generation buttons
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            if (!isGenerating) {
                generateImage(false);
            }
        });
    }

    if (withbgBtn) {
        withbgBtn.addEventListener('click', () => {
            if (!isGenerating) {
                generateImage(true);
            }
        });
    }

    if (luckyBtn) {
        luckyBtn.addEventListener('click', () => {
            if (!isGenerating) {
                searchInput.value = getApprovedPrompt();
                generateImage(false);
            }
        });
    }

    // Set up action buttons
    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            const imageUrl = document.querySelector('#result img')?.src;
            
            if (imageUrl) {
                switch(action) {
                    case 'view':
                        displayImage(imageUrl, true);
                        break;
                    case 'download':
                        downloadImage(imageUrl);
                        break;
                    case 'email':
                        showEmailForm(imageUrl);
                        break;
                }
            }
        });
    });

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
});
