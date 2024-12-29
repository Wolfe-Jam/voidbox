/**
 * @fileoverview Core functionality for Voidbox image generation
 * @version 1.2.0
 */

/**
 * Custom error class for Voidbox-specific errors
 */
class VoidboxError extends Error {
    constructor(message, type = 'GENERAL_ERROR') {
        super(message);
        this.name = 'VoidboxError';
        this.type = type;
    }
}

/**
 * Core functionality for the Voidbox application
 */
export class VoidboxCore {
    constructor(config) {
        console.log('🔧 Initializing VoidboxCore');
        this.webhookUrls = config.webhookUrls;
        
        if (!this.webhookUrls['zero-background']) {
            throw new Error('Zero-background webhook URL is required');
        }

        // Initialize history storage
        this.history = {
            images: JSON.parse(localStorage.getItem('voidbox_history') || '[]'),
            prompts: JSON.parse(localStorage.getItem('voidbox_prompts') || '[]'),
            maxItems: 5
        };
    }

    async generateImage(prompt) {
        console.log('🎨 Generating image for prompt:', prompt);
        
        if (!prompt) {
            throw new VoidboxError('Prompt is required', 'INVALID_INPUT');
        }

        try {
            const response = await fetch(this.webhookUrls['zero-background'], {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                throw new VoidboxError(`HTTP error! status: ${response.status}`, 'API_ERROR');
            }

            // Expect direct URL response
            const imageUrl = await response.text();
            
            // Update history
            this.updateHistory(prompt, imageUrl);
            
            return imageUrl;
        } catch (error) {
            console.error('Error generating image:', error);
            throw new VoidboxError(error.message, 'GENERATION_ERROR');
        }
    }

    updateHistory(prompt, imageUrl) {
        // Update images history
        this.history.images.unshift(imageUrl);
        if (this.history.images.length > this.history.maxItems) {
            this.history.images.pop();
        }
        localStorage.setItem('voidbox_history', JSON.stringify(this.history.images));

        // Update prompts history
        if (!this.history.prompts.includes(prompt)) {
            this.history.prompts.unshift(prompt);
            if (this.history.prompts.length > this.history.maxItems) {
                this.history.prompts.pop();
            }
            localStorage.setItem('voidbox_prompts', JSON.stringify(this.history.prompts));
        }
    }

    getHistory() {
        return this.history;
    }
}

// Export as ES module
export { VoidboxError };
