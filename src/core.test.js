import { jest } from '@jest/globals';
import { VoidboxCore, VoidboxError } from './core.js';

describe('VoidboxCore', () => {
    const validWebhookUrl = 'https://hook.us1.make.com/test';
    let voidbox;

    beforeEach(() => {
        voidbox = new VoidboxCore(validWebhookUrl);
        // Mock fetch globally
        global.fetch = jest.fn();
    });

    describe('constructor', () => {
        test('should create instance with valid webhook URL', () => {
            expect(voidbox.webhookUrl).toBe(validWebhookUrl);
        });

        test('should throw on invalid webhook URL', () => {
            expect(() => new VoidboxCore('invalid-url')).toThrow(VoidboxError);
        });
    });

    describe('validatePrompt', () => {
        test('should accept valid prompt', () => {
            expect(() => voidbox.validatePrompt('valid prompt')).not.toThrow();
        });

        test('should reject empty prompt', () => {
            expect(() => voidbox.validatePrompt('')).toThrow(VoidboxError);
            expect(() => voidbox.validatePrompt('   ')).toThrow(VoidboxError);
        });

        test('should reject too long prompt', () => {
            const longPrompt = 'a'.repeat(501);
            expect(() => voidbox.validatePrompt(longPrompt)).toThrow(VoidboxError);
        });

        test('should reject invalid characters', () => {
            expect(() => voidbox.validatePrompt('prompt<with>tags')).toThrow(VoidboxError);
            expect(() => voidbox.validatePrompt('prompt{with}braces')).toThrow(VoidboxError);
        });
    });

    describe('generateImage', () => {
        const validPrompt = 'test prompt';
        const validImageUrl = 'https://example.com/image.jpg';

        beforeEach(() => {
            // Reset mock
            global.fetch.mockReset();
        });

        test('should generate image URL from valid prompt', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                text: () => Promise.resolve(validImageUrl)
            });

            const result = await voidbox.generateImage(validPrompt);
            expect(result).toBe(validImageUrl);
            expect(global.fetch).toHaveBeenCalledWith(
                validWebhookUrl,
                expect.objectContaining({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: validPrompt })
                })
            );
        });

        test('should handle API error', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 500
            });

            await expect(voidbox.generateImage(validPrompt))
                .rejects
                .toThrow(VoidboxError);
        });

        test('should handle network error', async () => {
            global.fetch.mockRejectedValueOnce(new Error('Network error'));

            await expect(voidbox.generateImage(validPrompt))
                .rejects
                .toThrow(VoidboxError);
        });

        test('should handle invalid response URL', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                text: () => Promise.resolve('not-a-url')
            });

            await expect(voidbox.generateImage(validPrompt))
                .rejects
                .toThrow(VoidboxError);
        });
    });

    describe('isValidUrl', () => {
        test('should validate correct URLs', () => {
            expect(voidbox.isValidUrl('https://example.com')).toBe(true);
            expect(voidbox.isValidUrl('http://localhost:3000')).toBe(true);
        });

        test('should reject invalid URLs', () => {
            expect(voidbox.isValidUrl('not-a-url')).toBe(false);
            expect(voidbox.isValidUrl('')).toBe(false);
        });
    });
});
