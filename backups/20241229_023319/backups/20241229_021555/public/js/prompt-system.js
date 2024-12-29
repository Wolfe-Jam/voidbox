// VoidBox Prompt System
// Structure: Subject | Description | Activity/Props | Style | Vibe | Color

// Fixed prompts will be loaded from JSON
let FIXED_PROMPTS = [];

// Load fixed prompts from JSON
async function loadFixedPrompts() {
    try {
        const response = await fetch('/data/fixed-prompts.json');
        const data = await response.json();
        
        // Flatten the categories into a single array of prompts
        FIXED_PROMPTS = data.prompts.flatMap(category => 
            category.list.map(prompt => [
                prompt.subject,
                prompt.description,
                prompt.activity,
                prompt.style,
                prompt.vibe,
                prompt.color
            ])
        );
        
        console.log(`Loaded ${FIXED_PROMPTS.length} fixed prompts`);
    } catch (error) {
        console.error('Error loading fixed prompts:', error);
        // Fallback to some default prompts if loading fails
        FIXED_PROMPTS = [
            ["business cat", "serious", "in suit giving presentation", "detailed vector", "corporate", "2 flat colors"],
            ["wizard owl", "wise", "casting spells with wand", "magical glow", "mystical", "8 flat colors"]
        ];
    }
}

// Load prompts when the script loads
loadFixedPrompts();

// Part 2: Component Pools (for mixing and matching)
const PROMPT_POOLS = {
    subjects: {
        animals: [
            "cat",
            "dog",
            "rabbit",
            "hamster",
            "penguin",
            "elephant",
            "giraffe",
            "owl"
        ],
        professions: [
            "business",
            "ninja",
            "wizard",
            "painter",
            "dj",
            "chef",
            "astronaut",
            "detective"
        ],
        // Combined automatically to create things like "business cat", "ninja rabbit"
    },

    descriptions: [
        "serious",
        "focused",
        "stealthy",
        "wise",
        "happy",
        "cool",
        "elegant",
        "mysterious"
    ],

    activities: [
        "in suit giving presentation",
        "typing on holographic keyboard",
        "with katana meditating",
        "casting spells with wand",
        "with tiny paintbrush and beret",
        "with headphones mixing music",
        "cooking with chef hat",
        "reading ancient scrolls"
    ],

    styles: [
        "detailed vector",
        "retro scifi",
        "japanese ink",
        "magical glow",
        "watercolor style",
        "neon line art",
        "pixel perfect",
        "hand drawn"
    ],

    vibes: [
        "corporate",
        "cyberpunk",
        "zen",
        "mystical",
        "artistic",
        "party",
        "vintage",
        "dreamy"
    ],

    colors: [
        "2 flat colors",
        "3 flat colors",
        "4 flat colors",
        "8 flat colors",
        "16 flat colors",
        "neon duotone",
        "pastel palette",
        "vintage tritone"
    ]
};

// Helper Functions

// Get a random fixed prompt
function getFixedPrompt() {
    const prompt = FIXED_PROMPTS[Math.floor(Math.random() * FIXED_PROMPTS.length)];
    return {
        subject: prompt[0],
        description: prompt[1],
        activity: prompt[2],
        style: prompt[3],
        vibe: prompt[4],
        color: prompt[5],
        toString: function() {
            return `${this.description} ${this.subject} ${this.activity}, ${this.style} ${this.vibe}, ${this.color}`;
        }
    };
}

// Generate a combined subject (e.g., "business cat", "ninja rabbit")
function generateSubject() {
    const profession = PROMPT_POOLS.subjects.professions[
        Math.floor(Math.random() * PROMPT_POOLS.subjects.professions.length)
    ];
    const animal = PROMPT_POOLS.subjects.animals[
        Math.floor(Math.random() * PROMPT_POOLS.subjects.animals.length)
    ];
    return `${profession} ${animal}`;
}

// Generate a mixed prompt from pools
function getMixedPrompt() {
    const getRandomFrom = (array) => array[Math.floor(Math.random() * array.length)];
    
    return {
        subject: generateSubject(),
        description: getRandomFrom(PROMPT_POOLS.descriptions),
        activity: getRandomFrom(PROMPT_POOLS.activities),
        style: getRandomFrom(PROMPT_POOLS.styles),
        vibe: getRandomFrom(PROMPT_POOLS.vibes),
        color: getRandomFrom(PROMPT_POOLS.colors),
        toString: function() {
            return `${this.description} ${this.subject} ${this.activity}, ${this.style} ${this.vibe}, ${this.color}`;
        }
    };
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FIXED_PROMPTS,
        PROMPT_POOLS,
        getFixedPrompt,
        getMixedPrompt
    };
}
