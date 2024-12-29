/**
 * CORE FUNCTIONALITY - DO NOT MODIFY
 * This module handles Make.com webhook integration
 * Make.com returns plain text URLs, not JSON
 * 
 * Version: 1.0.0
 * Last Modified: 2024-12-28
 * 
 * CRITICAL: This file is part of core functionality and should not be modified
 * without explicit approval and thorough testing.
 */

const MAKE_ENDPOINTS = {
    WITH_BACKGROUND: 'https://hook.us1.make.com/x4gwbl1cqz789cqe23a187s411plbwo2',
    ZERO_BACKGROUND: 'https://hook.us1.make.com/f3d6i90kedqpcuut3y1691cs3onnjofw'
};

Object.freeze(MAKE_ENDPOINTS);

/**
 * Generates image using Make.com webhook
 * @param {string} prompt - The image generation prompt
 * @param {boolean} withBackground - Whether to generate with background
 * @returns {Promise<string>} - The generated image URL
 * @throws {Error} - If generation fails
 */
async function generateWithMake(prompt, withBackground) {
    const endpoint = withBackground ? MAKE_ENDPOINTS.WITH_BACKGROUND : MAKE_ENDPOINTS.ZERO_BACKGROUND;
    
    const response = await fetch(endpoint, {
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
        throw new Error(`Generation failed: ${response.status}`);
    }

    // CRITICAL: Make.com returns plain text URL, not JSON
    const imageUrl = await response.text();
    
    if (!imageUrl || !imageUrl.startsWith('http')) {
        throw new Error('Invalid URL received from Make.com');
    }

    return imageUrl;
}

export { generateWithMake, MAKE_ENDPOINTS };
