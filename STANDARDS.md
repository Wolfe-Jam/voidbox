# Voidbox Development Standards
> *"Where creativity meets consistency"* 🎨

## Core Technology Stack <span style="background: #22c55e; color: white; padding: 2px 8px; border-radius: 12px;">✅ CURRENT</span>
> *"Standards are not the enemy of creativity, they are its canvas"* 🖼️
- **Runtime**: Node.js ONLY
- **Server**: Express.js
- **Language**: JavaScript (ES6+) ONLY
- **Frontend**: Vanilla JavaScript, HTML5, CSS3 (Tailwind)
- **Testing**: Jest
- **Deployment**: Vercel
- **Version Control**: Git Desktop

## Mobile-First Development <span style="background: #22c55e; color: white; padding: 2px 8px; border-radius: 12px;">✅ CURRENT</span>
- Design for mobile screens first, scale up to desktop
- All features must work perfectly on mobile
- No horizontal scrolling
- Safe area insets for modern devices
- Minimum touch target size: 44px
- Font size minimum: 16px for inputs

## Language & Interface <span style="background: #22c55e; color: white; padding: 2px 8px; border-radius: 12px;">✅ CURRENT</span>
- English-only interface
- Left-to-right text direction
- Western date formats
- US English spelling conventions
- Google Search-like simplicity
- Single input field as focal point

## Node.js Standards <span style="background: #22c55e; color: white; padding: 2px 8px; border-radius: 12px;">✅ CURRENT</span>
### Required
- ES Modules (import/export) only
- Async/await for all asynchronous operations
- Try/catch blocks for error handling
- Environment variables for configuration
- Compression middleware
- CORS configuration

### Prohibited
- CommonJS (require)
- Callback patterns
- Synchronous operations
- Global variables
- Direct process.env access
- Mixed module systems

## Express.js Patterns
### Route Structure
```javascript
/api/v1/generate    // Image generation
/api/v1/auth        // Authentication
/api/v1/health      // Health checks
```

### Middleware Order
1. Security (helmet, cors)
2. Parsing (json, urlencoded)
3. Compression
4. Authentication
5. Routes
6. Error handling

## JavaScript Standards
### Type Safety without TypeScript
#### JSDoc Implementation
```javascript
/**
 * Generates an image based on the provided prompt
 * @param {Object} options - Generation options
 * @param {string} options.prompt - The image generation prompt
 * @param {boolean} [options.withBackground=false] - Whether to include background
 * @returns {Promise<string>} The generated image URL
 * @throws {GenerationError} If generation fails
 */
async function generateImage({ prompt, withBackground = false }) {
  if (!prompt?.trim()) {
    throw new ValidationError('Prompt cannot be empty');
  }
  // Implementation
}
```

#### Interface Patterns
```javascript
// Clear module exports
export const ImageGenerator = {
  generate: generateImage,
  validate: validatePrompt,
  getStatus: checkGenerationStatus
};

// Well-defined data structures
const GenerationStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETE: 'complete',
  FAILED: 'failed'
};
```

#### Defensive Programming
```javascript
// Input validation
function validatePrompt(prompt) {
  if (!prompt) throw new ValidationError('Prompt is required');
  if (typeof prompt !== 'string') throw new ValidationError('Prompt must be text');
  if (prompt.length > 500) throw new ValidationError('Prompt too long');
  return prompt.trim();
}

// Error handling
try {
  const imageUrl = await ImageGenerator.generate({ prompt });
} catch (error) {
  if (error instanceof ValidationError) {
    showUserError(error.message);
  } else {
    logError('Generation failed', error);
    showSystemError();
  }
}
```

### Required Practices
1. **JSDoc Documentation**
   - All functions must have JSDoc comments
   - Document parameters, return types, and exceptions
   - Use type definitions for complex objects
   - Leverage IDE integration

2. **Clear Interfaces**
   - Single responsibility principle
   - Explicit function parameters
   - Consistent return values
   - Module-based organization

3. **Defensive Code**
   - Validate all inputs
   - Handle all potential errors
   - No implicit type coercion
   - Immutable where possible

4. **Documentation**
   - Inline comments for complex logic
   - Module-level documentation
   - Example usage in comments
   - Update RELEASE_NOTES.md

### Prohibited Practices
- Implicit any types
- Undocumented functions
- Global state mutations
- Direct DOM manipulation without validation

## UI Element Naming Standards <span style="background: #22c55e; color: white; padding: 2px 8px; border-radius: 12px;">✅ CURRENT</span>

### Prompt Interface Elements

1. **Prompt Input**
   - The main text input box
   - Where users type their prompts
   - Single-line text input
   - Example: "cat | sleepy | pixel"

2. **Prompt Bar**
   - Help text system below Prompt Input
   - Shows format guide
   - Default format: "Subject | Description | Activity/Props | Style | Vibe | Color"
   - Visual aid for prompt structure

### Usage in Documentation
- Use "Prompt Input" when referring to the text input box
- Use "Prompt Bar" when referring to the help text system
- Never use generic terms like "prompt box" or "help text"

## Error Handling
### Custom Error Classes
```javascript
class GenerationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'GenerationError';
    this.status = 500;
  }
}
```

### Error Response Structure
```javascript
{
  status: 400,
  error: 'INVALID_PROMPT',
  message: 'Prompt must not be empty',
  requestId: 'gen_123abc'
}
```

### Error Logging Levels
- ERROR: System errors, API failures
- WARN: Rate limiting, validation failures
- INFO: Normal operations
- DEBUG: Development details

## Security Requirements
### Authentication
- JWT implementation
  - Short expiration (1 hour)
  - Secure cookie storage
  - CSRF protection
  - No localStorage

### API Protection
- Rate limiting: 60 requests/hour per IP
- Input validation
- CORS with whitelisted domains
- Max prompt length enforcement

### Environment Variables
Required:
```javascript
MAKE_WEBHOOK_URL_BG=
MAKE_WEBHOOK_URL_ZBG=
JWT_SECRET=
ADMIN_KEY=
NODE_ENV=
```

## UI/UX Standards
### Color Palette
- Primary: #29DCF3 (Electric Blue)
- Background Light: #f5f7fa
- Text colors defined in theme
- Mandatory light/dark mode support
- High contrast for accessibility

### Layout Rules
- Single column mobile layout
- Centered content
- Consistent padding (16px/1rem)
- Button groups with proper spacing
- No fixed header/footer on mobile

## Design System
### Typography
- App Title: "ZERO BACKGROUND IMAGE GENERATION"
  - All caps
  - Letter spacing: 0.2em
  - Font size: 0.9em
  - Line height: 1
  - Single line display
  - No wrapping

### Buttons
- Standard Height: 44px (touch-friendly)
- Standard Padding: 12px 24px
- Border Radius: 8px
- Hover Effect: Electric Blue (#29DCF3)

### Tooltips
- Background: Black (#000)
- Text: White (#fff)
- Padding: 5px 10px
- Border Radius: 4px
- Font Size: 14px
- Position: Below buttons
- Transition: 0.2s ease

### Button Labels
- ZBG: "Zero BackGround"
- BG: "BackGround"
- ?!?: "Lucky Image"
- X: "Clear"

## Mobile Standards
- Minimum touch target: 44px
- Minimum font size: 16px
- Single column layout
- No horizontal scrolling
- Touch-friendly spacing

## Prompt System
- Format: Subject | Description | Activity | Style | Method | Color | Vibe
- Example: "White Wolf | Blue eyes | staring | vintage | woodcut | flat color | magical"
- Pipe separator required
- All segments optional except Subject

### Method Options
- Default: woodcut
- Options: linocut, screenprint, vector
- Position: Left-aligned dropdown
- Dark mode compatible

## Animations
- Transitions: 0.2s ease
- Loading states: Smooth fade
- Button hover: Gentle scale
- Modal: Fade and slide
- Tooltips: Fade in/out

## Dark Mode
- Background: #202124
- Text: #ffffff
- Borders: #5f6368
- Buttons: #303134
- Hover: #3c4043

## Components

### Images
- Lazy loading enabled
- Alt text required
- Download option
- Clear action
- Email sharing

### Buttons
- Clear hover states
- Active state indication
- Loading state display
- Touch feedback
- Tooltip integration

### Forms
- 16px minimum font
- Clear validation
- Error states
- Loading indicators
- Mobile keyboard friendly

## Performance
- Lazy load images
- Optimize assets
- Minimize reflows
- Smooth animations
- Progressive loading

## Responsive Breakpoints
- Mobile: 320px - 480px
- Tablet: 481px - 768px
- Desktop: 769px+

## Success Metrics
- Load time < 2s
- FCP < 1.5s
- LCP < 2.5s
- TTI < 3.5s
- CLS < 0.1

## Email Integration Standards

### Webhook Configuration
- URL: `https://hook.us1.make.com/ge2xit3rtum5nvk1vfmbu89z5p9um54e`
- Method: POST
- Headers: Content-Type: application/json
- Response: HTTP 200 on success

### Request Format
```json
{
    "imageUrl": "string",
    "email": "string"
}
```

### Response Handling
1. HTTP Status: Check response.ok (200-299)
2. Error Cases: Handle network and server errors
3. User Feedback: Show clear success/error messages

### User Experience
1. Loading State: Show spinner during send
2. Success Message: "Message sent! Please check your email"
3. Error Message: Clear error with retry suggestion
4. Form Behavior: Clear and close on success
5. Message Duration: 5 seconds for visibility

### Error Recovery
1. Network Issues: Retry option available
2. Validation: Check email format before sending
3. Server Errors: Clear error messages
4. State Recovery: Restore UI state after error

## Version Control Standards <span style="background: #22c55e; color: white; padding: 2px 8px; border-radius: 12px;">✅ CURRENT</span>
> *"Commit early, commit often, but make it meaningful"* 📝

### Required Tools
- GitHub Desktop for all git operations
- No command line git usage
- Direct integration with Vercel deployment

### Workflow
1. **Version Control**
   - Use GitHub Desktop exclusively
   - Provides visibility and user management
   - Built-in authentication

2. **Deployment**
   - Auto-deploy from main branch to Vercel
   - No manual deployment needed
   - Instant production updates

3. **Responsibility Management**
   - Clear commit ownership
   - Built-in review process
   - Team visibility

### Prohibited
- Command line git
- Manual deployments
- Direct production changes

## Accessibility Standards (WCAG) <span style="background: #29DCF3; color: black; padding: 2px 8px; border-radius: 12px;">🔮 FUTURE</span>
### Required Implementation
```javascript
// Semantic HTML
<main role="main">
  <button 
    aria-label="Generate image"
    aria-busy="false"
    disabled={isGenerating}>
    Generate
  </button>
</main>

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !isGenerating) {
    generateImage();
  }
});

// Focus Management
function showModal() {
  const modal = document.getElementById('result-modal');
  modal.setAttribute('aria-hidden', 'false');
  modal.focus();
  trapFocus(modal);
}
```

### WCAG Compliance
1. **Perceivable**
   - Alt text for all images
   - Minimum contrast ratio: 4.5:1
   - Text resizable up to 200%
   - No information conveyed by color alone

2. **Operable**
   - Keyboard navigation
   - No keyboard traps
   - Sufficient time for responses
   - No flashing content

3. **Understandable**
   - Clear button labels
   - Consistent navigation
   - Error identification
   - Help and documentation

4. **Robust**
   - Valid HTML
   - ARIA attributes
   - Cross-browser support
   - Screen reader compatibility

## Documentation Tags
### Status Indicators
```css
/* Future Implementation Tag */
.future-tag {
  background: #29DCF3;
  color: black;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 14px;
}
```

| Tag | Meaning |
|-----|---------|
| <span style="background: #29DCF3; color: black; padding: 2px 8px; border-radius: 12px;">🔮 FUTURE</span> | Planned implementation for future scaling |
| <span style="background: #22c55e; color: white; padding: 2px 8px; border-radius: 12px;">✅ CURRENT</span> | Currently implemented |
| <span style="background: #f59e0b; color: black; padding: 2px 8px; border-radius: 12px;">🔄 IN PROGRESS</span> | Under development |

## User Feedback System <span style="background: #29DCF3; color: black; padding: 2px 8px; border-radius: 12px;">🔮 FUTURE</span>
### Loading States
```javascript
// Visual Feedback
const LoadingStates = {
  IDLE: 'idle',
  GENERATING: 'generating',
  UPLOADING: 'uploading',
  COMPLETE: 'complete',
  ERROR: 'error'
};
```

## Progress Indicators <span style="background: #29DCF3; color: black; padding: 2px 8px; border-radius: 12px;">🔮 FUTURE</span>
1. **Generation Progress**
   - Clear loading spinner
   - Progress percentage
   - Time estimate
   - Cancel option

2. **Status Messages**
   - Clear error messages
   - Success confirmations
   - Processing updates
   - Network status

3. **Visual Feedback**
   - Button state changes
   - Cursor feedback
   - Input validation
   - Focus indicators

## Performance Requirements <span style="background: #29DCF3; color: black; padding: 2px 8px; border-radius: 12px;">🔮 FUTURE</span>
- Lazy loading for images
- Minimal dependencies
- Efficient state management
- Loading times <2s
- Mobile-optimized assets

## Banned Technologies/Practices
### Languages/Runtimes
- Python ❌
- PHP ❌
- Ruby ❌
- Java ❌
- Any non-Node.js runtime ❌

### Frontend
- React ❌
- Vue ❌
- Angular ❌
- jQuery ❌
- Bootstrap ❌
- Material UI ❌

### Backend
- Django ❌
- Flask ❌
- Laravel ❌
- Rails ❌
- Any non-Express framework ❌

## Development Workflow
### Required Tools
- VS Code with ESLint
- Git Desktop
- npm (no yarn or pnpm)
- nodemon for development
- Jest for testing

### Version Control
- Semantic versioning
- Meaningful commit messages
- Feature branch workflow
- Pull request reviews
- No direct main commits

---
*"Made with ❄️ by White Wolfe Development"*
> *"Where every pixel has a purpose"* 🐺
Last Updated: 2024-12-30
Version: 1.0.0
