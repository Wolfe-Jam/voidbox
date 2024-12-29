// VoidBox Approved Prompts
// Each prompt has been tested and verified to produce good results

const APPROVED_PROMPTS = [
    // Format: [description, subject, activity, style, vibe, colors]
    // This allows us to reconstruct the prompt string consistently
    
    // Workplace Humor
    ["tiny", "Penguin", "giving a presentation", "pixel", "serious", "8 flat colors"],
    ["sleepy", "Cat", "with laptop coding", "cartoon", "trippy", "duotone"],
    ["grumpy", "Dragon", "making coffee", "ghibli", "peace", "pastel palette"],
    
    // Outdoor Adventures
    ["brave", "Lion", "skateboarding", "vector", "adventure", "6 flat colors"],
    ["clumsy", "Unicorn", "taking selfies", "watercolor", "fun", "rainbow palette"],
    ["fancy", "Parrot", "with hiking gear", "comic", "outdoors", "5 flat colors"],
    
    // Creative Arts
    ["wise", "Owl", "painting", "anime", "magical", "7 flat colors"],
    ["royal", "Phoenix", "playing piano", "retro", "nostalgic", "tritone"],
    ["silly", "Panda", "with headphones", "kawaii", "party", "bright palette"],
    
    // Tech & Gaming
    ["happy", "Hamster", "gaming", "pixel", "cyberpunk", "16 flat colors"],
    ["tiny", "Fox", "with VR headset", "vector", "sci-fi", "neon duotone"],
    ["grumpy", "Cat", "coding", "retro", "space", "4 flat colors"]
];

// Helper function to get a random approved prompt
function getApprovedPrompt() {
    const prompt = APPROVED_PROMPTS[Math.floor(Math.random() * APPROVED_PROMPTS.length)];
    return {
        description: prompt[0],
        subject: prompt[1],
        activity: prompt[2],
        style: prompt[3],
        vibe: prompt[4],
        colors: prompt[5],
        // Returns the full prompt string in our standard format
        toString: function() {
            return `${this.description} ${this.subject} ${this.activity}, ${this.style} ${this.vibe}, ${this.colors}`;
        }
    };
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APPROVED_PROMPTS, getApprovedPrompt };
}
