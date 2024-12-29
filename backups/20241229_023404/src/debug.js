// Simple console log to verify script is loading
console.log('Debug.js loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    
    // Get elements
    const promptInput = document.getElementById('prompt');
    const generateBtn = document.getElementById('generate-btn');
    
    console.log('Elements found:', { 
        promptInput: !!promptInput, 
        generateBtn: !!generateBtn 
    });

    // Set initial prompt
    if (promptInput) {
        promptInput.value = "White wolf, blue eyes, in winter, vintage art, 5 flat colors, magical";
    }

    // Generate function
    function generateImage() {
        console.log('Generate clicked');
        const prompt = promptInput.value.trim();
        if (!prompt) return;

        // Visual feedback
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';

        // Make the API call
        fetch('https://hook.us1.make.com/f3d6i90kedqpcuut3y1691cs3onnjofw', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        })
        .then(response => response.text())
        .then(imageUrl => {
            console.log('Image URL received:', imageUrl);
            const resultSection = document.getElementById('result-section');
            if (resultSection) {
                resultSection.innerHTML = `<img src="${imageUrl}" alt="Generated image">`;
                resultSection.classList.remove('hidden');
            }
        })
        .catch(error => {
            console.error('Generation error:', error);
            alert(error.message);
        })
        .finally(() => {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate';
        });
    }

    // Add event listeners
    if (promptInput) {
        console.log('Adding keydown listener');
        promptInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                console.log('Enter pressed');
                e.preventDefault();
                generateImage();
            }
        });
    }

    if (generateBtn) {
        console.log('Adding click listener');
        generateBtn.addEventListener('click', generateImage);
    }
});
