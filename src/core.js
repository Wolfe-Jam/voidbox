/**
 * @fileoverview Core functionality for Voidbox image generation
 * @version 1.0.0
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
class VoidboxCore {
    /**
     * @param {string} webhookUrl - The Make.com webhook URL
     * @throws {VoidboxError} If webhookUrl is invalid
     */
    constructor(webhookUrl) {
        if (!this.isValidUrl(webhookUrl)) {
            throw new VoidboxError('Invalid webhook URL', 'INVALID_CONFIG');
        }
        this.webhookUrl = webhookUrl;
    }

    /**
     * Generate an image from a prompt
     * @param {string} prompt - The image generation prompt
     * @returns {Promise<string>} The URL of the generated image
     * @throws {VoidboxError} If prompt is invalid or generation fails
     */
    async generateImage(prompt) {
        try {
            // Validate input
            this.validatePrompt(prompt);

            // Send request to webhook
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            // Handle non-200 responses
            if (!response.ok) {
                throw new VoidboxError(
                    `Server responded with ${response.status}`,
                    'API_ERROR'
                );
            }

            // Get and validate image URL
            const imageUrl = await response.text();
            if (!this.isValidUrl(imageUrl)) {
                throw new VoidboxError(
                    'Received invalid image URL from server',
                    'INVALID_RESPONSE'
                );
            }

            return imageUrl;

        } catch (error) {
            // Convert unknown errors to VoidboxError
            if (!(error instanceof VoidboxError)) {
                if (error.name === 'TypeError' || error.name === 'NetworkError') {
                    error = new VoidboxError(
                        'Failed to connect to image generation service',
                        'NETWORK_ERROR'
                    );
                } else {
                    error = new VoidboxError(
                        'An unexpected error occurred',
                        'UNKNOWN_ERROR'
                    );
                }
            }

            // Add timestamp and log error
            error.timestamp = new Date().toISOString();
            console.error('[VoidboxCore]', error);

            throw error;
        }
    }

    /**
     * Validate a prompt string
     * @param {string} prompt - The prompt to validate
     * @throws {VoidboxError} If prompt is invalid
     */
    validatePrompt(prompt) {
        // Check for empty or whitespace-only prompt
        if (!prompt || !prompt.trim()) {
            throw new VoidboxError(
                'Prompt cannot be empty',
                'INVALID_INPUT'
            );
        }

        // Check prompt length (arbitrary reasonable limits)
        if (prompt.length > 500) {
            throw new VoidboxError(
                'Prompt is too long (maximum 500 characters)',
                'INVALID_INPUT'
            );
        }

        // Check for potentially problematic characters
        if (/[<>{}]/.test(prompt)) {
            throw new VoidboxError(
                'Prompt contains invalid characters',
                'INVALID_INPUT'
            );
        }
    }

    /**
     * Validate a URL string
     * @param {string} url - The URL to validate
     * @returns {boolean} True if URL is valid
     */
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
}

// Export as ES module
export { VoidboxCore, VoidboxError };
