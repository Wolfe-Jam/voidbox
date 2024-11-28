/**
 * @fileoverview Core functionality for Voidbox image generation
 * @version 1.0.1
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
 * Base class for image generation strategies
 */
class ImageGenerationStrategy {
    /**
     * @param {string} webhookUrl - The webhook URL for this strategy
     */
    constructor(webhookUrl) {
        if (!VoidboxCore.isValidUrl(webhookUrl)) {
            throw new VoidboxError('Invalid webhook URL', 'INVALID_CONFIG');
        }
        this.webhookUrl = webhookUrl;
    }

    /**
     * Generate an image
     * @param {string} prompt - The generation prompt
     * @param {Object} options - Additional options for this strategy
     * @returns {Promise<string>} The URL of the generated image
     * @throws {VoidboxError} If generation fails
     */
    async generate(prompt, options = {}) {
        throw new VoidboxError('Strategy must implement generate()', 'NOT_IMPLEMENTED');
    }

    /**
     * Validate strategy-specific options
     * @param {Object} options - The options to validate
     * @throws {VoidboxError} If options are invalid
     */
    validateOptions(options) {
        // Default implementation does nothing
    }
}

/**
 * Strategy for zero-background image generation (Thread 1)
 */
class ZeroBackgroundStrategy extends ImageGenerationStrategy {
    async generate(prompt, options = {}) {
        const response = await fetch(this.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, type: 'zero-background', ...options })
        });

        if (!response.ok) {
            throw new VoidboxError(
                `Server responded with ${response.status}`,
                'API_ERROR'
            );
        }

        const imageUrl = await response.text();
        if (!VoidboxCore.isValidUrl(imageUrl)) {
            throw new VoidboxError(
                'Received invalid image URL from server',
                'INVALID_RESPONSE'
            );
        }

        return imageUrl;
    }
}

/**
 * Strategy for regular image generation with background (Thread 2)
 */
class WithBackgroundStrategy extends ImageGenerationStrategy {
    async generate(prompt, options = {}) {
        const response = await fetch(this.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, type: 'with-background', ...options })
        });

        if (!response.ok) {
            throw new VoidboxError(
                `Server responded with ${response.status}`,
                'API_ERROR'
            );
        }

        const imageUrl = await response.text();
        if (!VoidboxCore.isValidUrl(imageUrl)) {
            throw new VoidboxError(
                'Received invalid image URL from server',
                'INVALID_RESPONSE'
            );
        }

        return imageUrl;
    }
}

/**
 * Core functionality for the Voidbox application
 */
class VoidboxCore {
    /**
     * @param {Object} config - Configuration object
     * @param {Object.<string, string>} config.webhookUrls - Map of strategy names to webhook URLs
     * @throws {VoidboxError} If configuration is invalid
     */
    constructor(config) {
        this.strategies = new Map();
        
        // Register default strategies
        if (config.webhookUrls?.['zero-background']) {
            this.registerStrategy(
                'zero-background',
                new ZeroBackgroundStrategy(config.webhookUrls['zero-background'])
            );
        }
        if (config.webhookUrls?.['with-background']) {
            this.registerStrategy(
                'with-background',
                new WithBackgroundStrategy(config.webhookUrls['with-background'])
            );
        }
    }

    /**
     * Register a new generation strategy
     * @param {string} name - Name of the strategy
     * @param {ImageGenerationStrategy} strategy - The strategy instance
     */
    registerStrategy(name, strategy) {
        if (!(strategy instanceof ImageGenerationStrategy)) {
            throw new VoidboxError(
                'Invalid strategy instance',
                'INVALID_CONFIG'
            );
        }
        this.strategies.set(name, strategy);
    }

    /**
     * Generate an image using the specified strategy
     * @param {string} prompt - The image generation prompt
     * @param {string} strategyName - Name of the strategy to use
     * @param {Object} options - Additional options for the strategy
     * @returns {Promise<string>} The URL of the generated image
     * @throws {VoidboxError} If prompt is invalid or generation fails
     */
    async generateImage(prompt, strategyName = 'zero-background', options = {}) {
        try {
            // Validate input
            this.validatePrompt(prompt);

            // Get strategy
            const strategy = this.strategies.get(strategyName);
            if (!strategy) {
                throw new VoidboxError(
                    `Unknown generation strategy: ${strategyName}`,
                    'INVALID_CONFIG'
                );
            }

            // Validate strategy options
            strategy.validateOptions(options);

            // Generate image
            return await strategy.generate(prompt, options);

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

        // Check prompt length
        if (prompt.length > 500) {
            throw new VoidboxError(
                'Prompt is too long (max 500 characters)',
                'INVALID_INPUT'
            );
        }

        // Check for invalid characters
        if (!/^[\w\s.,!?()-]+$/i.test(prompt)) {
            throw new VoidboxError(
                'Prompt contains invalid characters',
                'INVALID_INPUT'
            );
        }
    }

    /**
     * Check if a string is a valid URL
     * @param {string} url - The URL to validate
     * @returns {boolean} True if URL is valid
     */
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
}

// Export as ES module
export { VoidboxCore, VoidboxError, ImageGenerationStrategy, ZeroBackgroundStrategy, WithBackgroundStrategy };
