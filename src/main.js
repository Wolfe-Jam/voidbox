document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const form = document.getElementById('promptForm');
    const promptInput = document.getElementById('prompt');
    const imageDisplay = document.getElementById('imageDisplay');
    const generatedImage = document.getElementById('generatedImage');
    const loadingState = document.getElementById('loadingState');
    const viewFullImageBtn = document.getElementById('viewFullImage');
    const downloadImageBtn = document.getElementById('downloadImage');
    const emailButton = document.getElementById('emailButton');
    const emailForm = document.getElementById('emailForm');
    const emailInput = document.getElementById('emailInput');
    const sendEmailButton = document.getElementById('sendEmailButton');

    // Make.com webhook URL - Image Generation Scenario
    const MAKE_WEBHOOK_URL = 'https://hook.us1.make.com/f3d6i90kedqpcuut3y1691cs3onnjofw';

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
        
        const prompt = promptInput.value.trim();
        if (!prompt) return;

        try {
            // Show loading state
            loadingState.classList.remove('hidden');
            imageDisplay.classList.add('hidden');
            
            // Send request to Make.com webhook
            const response = await fetch(MAKE_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            // Get the URL directly from response
            const imageUrl = await response.text();
            console.log('Make.com returned URL:', imageUrl);

            // Set image source and show it
            generatedImage.src = imageUrl;
            generatedImage.onload = () => {
                imageDisplay.classList.remove('hidden');
                loadingState.classList.add('hidden');
            };
            generatedImage.onerror = () => {
                throw new Error('Failed to load image from URL');
            };
            
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to generate image. Please try again.');
            loadingState.classList.add('hidden');
        }
    });
});
