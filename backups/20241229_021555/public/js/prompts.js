// VoidBox Prompt Configuration
// Keep prompts short and punchy!

const PROMPT_CONFIG = {
    // Main characters (keep short, 1-2 words max)
    subjects: {
        pets: [
            'Cat',
            'Dog',
            'Hamster',
            'Bunny',
            'Parrot',
            'Goldfish',
            'Budgie',
            'Ferret'
        ],
        zoo_animals: [
            'Lion',
            'Tiger',
            'Panda',
            'Penguin',
            'Giraffe',
            'Monkey',
            'Koala',
            'Zebra'
        ],
        mythical: [
            'Dragon',
            'Unicorn',
            'Phoenix',
            'Griffin',
            'Pegasus',
            'Mermaid'
        ]
    },

    // Short descriptions (1 word)
    descriptions: [
        'tiny',
        'sleepy',
        'grumpy',
        'happy',
        'fancy',
        'silly',
        'wise',
        'royal',
        'brave',
        'clumsy'
    ],

    // Quick activities (2-4 words)
    activities: [
        'making coffee',
        'doing yoga',
        'reading news',
        'taking selfies',
        'playing piano',
        'painting',
        'cooking',
        'skateboarding',
        'gaming',
        'dancing',
        'in a suit',
        'with laptop',
        'drinking tea',
        'wearing glasses',
        'with headphones'
    ],

    // Art styles (1-2 words)
    styles: [
        'pixel',
        'anime',
        'kawaii',
        'retro',
        'cartoon',
        'watercolor',
        'pencil',
        'vector',
        'ghibli',
        'comic'
    ],

    // Vibes (mood/theme/setting - no colors!)
    vibes: [
        'fun',
        'party',
        'wild',
        'serious',
        'adventure',
        'outdoors',
        'magical',
        'dark',
        'mysterious',
        'nostalgic',
        'bright',
        'daring',
        'scary',
        'space',
        'cosmic',
        'peace',
        'hippy',
        'kids book',
        'trippy',
        'cyberpunk',
        'steampunk',
        'fantasy',
        'sci-fi',
        'dreamy'
    ],

    // Colors (palette types and counts)
    colors: [
        '3 flat colors',
        '4 flat colors',
        '5 flat colors',
        '6 flat colors',
        '7 flat colors',
        '8 flat colors',
        '12 flat colors',
        '16 flat colors',
        '64 flat colors',
        '256 flat colors',
        'duotone',
        'tritone',
        'halftone',
        'pastel palette',
        'bright palette',
        'rainbow palette'
    ]
};

// Helper function to get all subjects in a flat array
PROMPT_CONFIG.getAllSubjects = function() {
    return [
        ...this.subjects.pets,
        ...this.subjects.zoo_animals,
        ...this.subjects.mythical
    ];
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PROMPT_CONFIG;
}
