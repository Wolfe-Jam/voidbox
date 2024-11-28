import { jest } from '@jest/globals';
import { VoidboxCore, VoidboxError, ImageGenerationStrategy, ZeroBackgroundStrategy, WithBackgroundStrategy } from './core.js';

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
    const validWebhookUrl2 = 'https://hook.us1.make.com/test2';
    let voidbox;

    beforeEach(() => {
        voidbox = new VoidboxCore({
            webhookUrls: {
                'zero-background': validWebhookUrl,
                'with-background': validWebhookUrl2,
                'mock': validWebhookUrl
            }
        });
        voidbox.registerStrategy('mock', new MockStrategy(validWebhookUrl));
    });

    describe('constructor', () => {
        it('should create instance with valid webhook URLs', () => {
            expect(voidbox).toBeInstanceOf(VoidboxCore);
            expect(voidbox.strategies.size).toBe(3);
            expect(voidbox.strategies.has('zero-background')).toBe(true);
            expect(voidbox.strategies.has('with-background')).toBe(true);
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
        beforeEach(() => {
            global.fetch = jest.fn(() => 
                Promise.resolve({
                    ok: true,
                    text: () => Promise.resolve('https://example.com/image.jpg')
                })
            );
        });

        it('should generate image URL from valid prompt with ZBG', async () => {
            const url = await voidbox.generateImage('test', 'zero-background');
            expect(url).toBe('https://example.com/image.jpg');
            expect(global.fetch).toHaveBeenCalledWith(
                validWebhookUrl,
                expect.objectContaining({
                    body: expect.stringContaining('zero-background')
                })
            );
        });

        it('should generate image URL from valid prompt with background', async () => {
            const url = await voidbox.generateImage('test', 'with-background');
            expect(url).toBe('https://example.com/image.jpg');
            expect(global.fetch).toHaveBeenCalledWith(
                validWebhookUrl2,
                expect.objectContaining({
                    body: expect.stringContaining('with-background')
                })
            );
        });

        it('should use zero-background as default strategy', async () => {
            const url = await voidbox.generateImage('test');
            expect(url).toBe('https://example.com/image.jpg');
            expect(global.fetch).toHaveBeenCalledWith(
                validWebhookUrl,
                expect.objectContaining({
                    body: expect.stringContaining('zero-background')
                })
            );
        });

        it('should use default strategy when none specified', async () => {
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
