import { jest } from '@jest/globals';
import { VoidboxCore, VoidboxError, ImageGenerationStrategy } from './core.js';

// Mock strategy for testing
class MockStrategy extends ImageGenerationStrategy {
    async generate(prompt, options = {}) {
        if (options.fail) {
            throw new VoidboxError('Mock failure', 'MOCK_ERROR');
        }
        return 'https://example.com/image.jpg';
    }

    validateOptions(options) {
        if (options.invalid) {
            throw new VoidboxError('Invalid mock options', 'INVALID_INPUT');
        }
    }
}

describe('VoidboxCore', () => {
    const validWebhookUrl = 'https://hook.us1.make.com/test';
    let voidbox;

    beforeEach(() => {
        voidbox = new VoidboxCore({
            webhookUrls: {
                'zero-background': validWebhookUrl,
                'mock': validWebhookUrl
            }
        });
        voidbox.registerStrategy('mock', new MockStrategy(validWebhookUrl));
    });

    describe('constructor', () => {
        it('should create instance with valid webhook URLs', () => {
            expect(voidbox).toBeInstanceOf(VoidboxCore);
            expect(voidbox.strategies.size).toBe(2);
        });

        it('should throw on invalid webhook URL', () => {
            expect(() => new VoidboxCore({
                webhookUrls: { 'zero-background': 'invalid-url' }
            })).toThrow(VoidboxError);
        });
    });

    describe('registerStrategy', () => {
        it('should register valid strategy', () => {
            const strategy = new MockStrategy(validWebhookUrl);
            voidbox.registerStrategy('test', strategy);
            expect(voidbox.strategies.get('test')).toBe(strategy);
        });

        it('should throw on invalid strategy', () => {
            expect(() => voidbox.registerStrategy('test', {}))
                .toThrow(VoidboxError);
        });
    });

    describe('validatePrompt', () => {
        it('should accept valid prompt', () => {
            expect(() => voidbox.validatePrompt('Test prompt'))
                .not.toThrow();
        });

        it('should reject empty prompt', () => {
            expect(() => voidbox.validatePrompt('')).toThrow(VoidboxError);
            expect(() => voidbox.validatePrompt('   ')).toThrow(VoidboxError);
        });

        it('should reject too long prompt', () => {
            const longPrompt = 'a'.repeat(501);
            expect(() => voidbox.validatePrompt(longPrompt))
                .toThrow(VoidboxError);
        });

        it('should reject invalid characters', () => {
            expect(() => voidbox.validatePrompt('test<script>'))
                .toThrow(VoidboxError);
        });
    });

    describe('generateImage', () => {
        it('should generate image URL from valid prompt', async () => {
            const url = await voidbox.generateImage('test', 'mock');
            expect(url).toBe('https://example.com/image.jpg');
        });

        it('should use default strategy when none specified', async () => {
            global.fetch = jest.fn(() => 
                Promise.resolve({
                    ok: true,
                    text: () => Promise.resolve('https://example.com/image.jpg')
                })
            );

            const url = await voidbox.generateImage('test');
            expect(url).toBe('https://example.com/image.jpg');
        });

        it('should handle strategy errors', async () => {
            await expect(voidbox.generateImage('test', 'mock', { fail: true }))
                .rejects.toThrow(VoidboxError);
        });

        it('should validate strategy options', async () => {
            await expect(voidbox.generateImage('test', 'mock', { invalid: true }))
                .rejects.toThrow(VoidboxError);
        });

        it('should throw on unknown strategy', async () => {
            await expect(voidbox.generateImage('test', 'unknown'))
                .rejects.toThrow(VoidboxError);
        });
    });

    describe('isValidUrl', () => {
        it('should validate correct URLs', () => {
            expect(VoidboxCore.isValidUrl('https://example.com')).toBe(true);
            expect(VoidboxCore.isValidUrl('http://test.com/path')).toBe(true);
        });

        it('should reject invalid URLs', () => {
            expect(VoidboxCore.isValidUrl('not-a-url')).toBe(false);
            expect(VoidboxCore.isValidUrl('')).toBe(false);
        });
    });
});

describe('ImageGenerationStrategy', () => {
    it('should require generate() implementation', async () => {
        const strategy = new ImageGenerationStrategy('https://example.com');
        await expect(strategy.generate('test'))
            .rejects.toThrow(VoidboxError);
    });

    it('should allow empty options validation', () => {
        const strategy = new ImageGenerationStrategy('https://example.com');
        expect(() => strategy.validateOptions({})).not.toThrow();
    });
});
