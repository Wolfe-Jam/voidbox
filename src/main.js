import { VoidboxCore } from './core.js';

document.addEventListener('DOMContentLoaded', () => {
    // Constants
    const DEFAULT_PROMPT = "black cat with green eyes laughing in a top hat. cartoon, bright colors, funny";
    const WEBHOOK_URLS = {
        'zero-background': 'https://hook.us1.make.com/f3d6i90kedqpcuut3y1691cs3onnjofw',
        'with-background': 'https://hook.us1.make.com/x4gwbl1cqz789cqe23a187s411plbwo2'
    };

    // Initialize core with both strategies
    const voidbox = new VoidboxCore({ webhookUrls: WEBHOOK_URLS });

    // Cache DOM elements
    const form = document.querySelector('form');
    const promptInput = document.querySelector('#prompt');
    const generatedImage = document.querySelector('#generatedImage');
    const imageDisplay = document.querySelector('#imageDisplay');
    const loadingState = document.querySelector('#loadingState');
    const viewFullImageBtn = document.getElementById('viewFullImage');
    const downloadImageBtn = document.getElementById('downloadImage');
    const emailButton = document.getElementById('emailButton');
    const emailForm = document.getElementById('emailForm');
    const emailInput = document.getElementById('emailInput');
    const sendEmailButton = document.getElementById('sendEmailButton');
    const imageTypeContainer = document.getElementById('imageTypeContainer');

    // Handle tab key and touch events for prompt input
    promptInput.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            if (!promptInput.value) {
                promptInput.value = DEFAULT_PROMPT;
            }
            // Move cursor to end and select the text
            promptInput.setSelectionRange(promptInput.value.length, promptInput.value.length);
            promptInput.focus();
        }
    });

    // For mobile: Double tap to fill and focus
    let lastTap = 0;
    promptInput.addEventListener('touchend', (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        if (tapLength < 300 && tapLength > 0) {
            e.preventDefault();
            if (!promptInput.value) {
                promptInput.value = DEFAULT_PROMPT;
            }
            promptInput.setSelectionRange(promptInput.value.length, promptInput.value.length);
            promptInput.focus();
        }
        lastTap = currentTime;
    });

    // Create strategy radio buttons if they don't exist
    const strategyRadioButtons = document.querySelectorAll('input[name="imageType"]');
    if (strategyRadioButtons.length === 0) {
        const options = [
            { value: 'zero-background', text: 'Zero Background (for t-shirts, hoodies, phone cases, flasks, logos)', default: true },
            { value: 'with-background', text: 'Add Background' }
        ];

        options.forEach(({ value, text, default: isDefault }) => {
            const radioButton = document.createElement('input');
            radioButton.type = 'radio';
            radioButton.id = value;
            radioButton.name = 'imageType';
            radioButton.value = value;
            radioButton.checked = isDefault;
            radioButton.className = 'sr-only peer';

            const label = document.createElement('label');
            label.htmlFor = value;
            label.className = 'inline-flex items-center justify-center w-full p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-primary peer-checked:text-primary hover:text-gray-600 hover:bg-gray-50';
            label.textContent = text;

            const container = document.createElement('div');
            container.className = 'flex items-center mb-2';
            container.appendChild(radioButton);
            container.appendChild(label);

            imageTypeContainer.appendChild(container);
        });
    }

    // View full image handler
    if (viewFullImageBtn) {
        viewFullImageBtn.addEventListener('click', () => {
            const imageUrl = generatedImage.src;
            if (imageUrl) {
                window.open(imageUrl, '_blank');
            }
        });
    }

    // Download image handler
    if (downloadImageBtn) {
        downloadImageBtn.addEventListener('click', async () => {
            const imageUrl = generatedImage.src;
            if (imageUrl) {
                try {
                    const response = await fetch(imageUrl);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'voidbox-design.png';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                } catch (error) {
                    console.error('Error downloading image:', error);
                    alert('Failed to download image. Please try again.');
                }
            }
        });
    }

    // Email button handler
    if (emailButton) {
        emailButton.addEventListener('click', () => {
            emailForm.classList.toggle('hidden');
        });
    }

    // Email input handler
    if (emailInput) {
        emailInput.addEventListener('input', () => {
            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
            sendEmailButton.disabled = !isValidEmail;
        });
    }

    // Form submit handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const prompt = promptInput.value.trim() || DEFAULT_PROMPT;
        const strategy = document.querySelector('input[name="imageType"]:checked').value;

        // Show loading state
        loadingState.classList.remove('hidden');
        imageDisplay.classList.add('hidden');

        try {
            // Generate image using selected strategy
            const imageUrl = await voidbox.generateImage(prompt, strategy);
            
            // Display the image
            generatedImage.src = imageUrl;
            generatedImage.onload = () => {
                imageDisplay.classList.remove('hidden');
                loadingState.classList.add('hidden');
            };

            // Enable download and share buttons
            downloadImageBtn.href = imageUrl;
            downloadImageBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            downloadImageBtn.classList.add('hover:bg-gray-100');
            
            viewFullImageBtn.href = imageUrl;
            viewFullImageBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            viewFullImageBtn.classList.add('hover:bg-gray-100');

        } catch (error) {
            console.error('Error:', error);
            loadingState.classList.add('hidden');
            alert(error.message || 'Failed to generate image. Please try again.');
        }
    });

    // Update loading message (called from core.js)
    window.updateLoadingMessage = (message) => {
        // Removed
    };
});
