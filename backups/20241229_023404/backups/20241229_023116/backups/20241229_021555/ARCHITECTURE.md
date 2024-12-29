# Voidbox Architecture

## Core Philosophy
Voidbox is built with a commitment to beautiful, maintainable, and scalable code. Our architecture reflects this through clear separation of concerns, thoughtful branching strategies, and well-defined criteria for feature implementation.

## Code Structure

### Core (src/core.js)
The heart of Voidbox, handling pure business logic:
- Image generation strategies
- Webhook handling
- API interactions
- Error management
- No UI/UX concerns

### Main (src/main.js)
The interface layer, managing user interactions:
- UI event handling
- DOM manipulation
- Basic feature implementation
- Integration with core functionality

## Feature Classification

### Main Features
Simple, single-responsibility features that live directly in main:
- View Full Image: Simple URL opening
- Download: Basic browser download API
- Other basic UI interactions

**Criteria for Main Features:**
- Single responsibility
- No external dependencies
- Simple error handling
- No complex state management

### Branch-Worthy Features
Complex features that require dedicated branches:
- Email Sharing: External services, form handling
- Delete Button: State management, transitions
- Future complex features

**Criteria for Branch Creation:**
1. External service dependencies
2. Complex state management
3. Multiple interaction states
4. Security implications
5. Significant error handling
6. Multiple file changes
7. Testing requirements
8. Configuration needs

## Branching Strategy

```
main (production)
├── develop
│   ├── feature/ui-components
│   ├── feature/delete-button
│   └── feature/email-sharing
└── core
    ├── feature/zero-bg-optimization
    ├── feature/webhook-retry
    └── feature/error-handling
```

### Branch Rules
- `main`: Production code
- `core`: API and generation logic
- `develop`: UI/UX features
- `feature/*`: Specific feature implementations

### Version Control
- Core changes: X.Y.Z-core
- UI changes: X.Y.Z-ui
- Full releases: X.Y.Z

## Development Workflow

1. **Feature Assessment**
   - Evaluate against branching criteria
   - Determine appropriate implementation path

2. **Implementation**
   - Simple features → Direct to main
   - Complex features → Feature branch

3. **Review Process**
   - Code review
   - Testing
   - Documentation
   - Performance impact

4. **Integration**
   - Feature branches → develop
   - develop → main
   - core → main

## Best Practices

1. **Code Organization**
   - Clear separation of concerns
   - Minimal dependencies
   - Self-documenting code
   - Consistent styling

2. **Documentation**
   - Clear comments
   - Updated README
   - Maintained ARCHITECTURE.md
   - Inline documentation

3. **Testing**
   - Core functionality tests
   - UI integration tests
   - Performance benchmarks

4. **Performance**
   - Minimal dependencies
   - Efficient DOM operations
   - Optimized image handling
   - Clean async operations

## Future Considerations

- Scalability paths
- Plugin architecture
- Theme system
- Extended API capabilities
