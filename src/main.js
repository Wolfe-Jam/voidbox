import { VoidboxCore } from './core.js';

document.addEventListener('DOMContentLoaded', () => {
    // Constants
    const MAKE_WEBHOOK_URL = 'https://hook.us1.make.com/f3d6i90kedqpcuut3y1691cs3onnjofw';

    // Initialize core
    const voidbox = new VoidboxCore(MAKE_WEBHOOK_URL);

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

    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            // Show loading state
            loadingState.classList.remove('hidden');
            imageDisplay.classList.add('hidden');
            
            // Generate image using core
            const imageUrl = await voidbox.generateImage(promptInput.value);
            
            // Display image
            generatedImage.src = imageUrl;
            generatedImage.onload = () => {
                imageDisplay.classList.remove('hidden');
                loadingState.classList.add('hidden');
            };
            
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Failed to generate image. Please try again.');
            loadingState.classList.add('hidden');
        }
    });
});
