# Voidbox Middleware Planning

## Target User Profile
- Primary: Designers and solopreneurs
- Focus: Specific image type generation
- Use Case: Professional design asset creation

## Planned Middleware Structure

### Phase 1 (Core App Focus)
- Basic authentication
- Simple rate limiting
- Error handling
- Compression

### Phase 2 (Freemium Implementation)
- Tier-based access control
- Usage tracking
- Asset management
- Enhanced security

### Phase 3 (Scale Preparation)
- Advanced caching
- Queue management
- Analytics
- Enterprise readiness

## Open Questions for Implementation

### Tier Structure
- [ ] Define tier levels (Free/Pro vs multiple tiers)
- [ ] Determine key tier differentiators
- [ ] Set usage limits per tier

### Authentication
- [ ] Choose initial auth method
- [ ] Social integration priority
- [ ] Session management approach

### Feature Access
- [ ] Free tier daily generation limit
- [ ] Model access per tier
- [ ] Asset management features

### Technical Considerations
- [ ] Caching strategy
- [ ] Queue management needs
- [ ] Scaling approach

## Confirmed Decisions

### Tier Structure
- Free and Premium tiers (Codeium model)
- Credit top-up system for additional usage
- Premium tier with enhanced features/limits

### Authentication
- Magic Link authentication via email (primary)
- Potential SMS authentication (future consideration)
- Passwordless approach for improved UX

### MVP Features
- TBD: Daily generation limits
- TBD: Initial AI model selection
- TBD: Asset management scope

## Performance Requirements

### Core Principles
- Minimal middleware stack - only what's absolutely necessary
- In-memory operations preferred over disk/network when possible
- Non-blocking architecture throughout
- Fast-fail approach for invalid requests

### Implementation Strategy
- Combine related middleware functions where possible
- Use lightweight token validation (no heavy crypto)
- Implement efficient caching at edge points
- Keep auth checks simple and fast

### Optimizations
- Single pass request processing
- Minimal JSON parsing/stringifying
- Avoid redundant validations
- No synchronous file operations

### Key Metrics
- Auth check: < 1ms
- Rate limiting: < 0.5ms
- Total middleware overhead: < 5ms
- No middleware disk I/O in hot path

## High-Performance Implementation

### JWT-Based Auth Layer
```javascript
// Single-pass auth + tier check
const fastAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    // Verify and decode in one pass
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach minimal user data to request
    req.user = {
      id: decoded.sub,
      tier: decoded.tier,
      credits: decoded.credits
    };
    
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
```

### Rate Limiting Strategy
```javascript
// In-memory rate limiting with Redis
const rateLimit = createRateLimiter({
  store: new RedisStore({
    // Optimized connection settings
    enableOfflineQueue: false,
    maxRetriesPerRequest: 1
  }),
  windowMs: 60 * 1000, // 1 minute
  max: (req) => req.user?.tier === 'premium' ? 100 : 20,
  standardHeaders: false, // Skip standard headers
  legacyHeaders: false  // Skip legacy headers
});
```

### Combined Middleware Chain
```javascript
// Route-specific middleware bundles
const generateImage = [
  fastAuth,
  rateLimit,
  validateImageParams // Single-pass validation
];

const viewHistory = [
  fastAuth,  // Lighter version possible
  validatePagination
];

// Minimal public routes
const public = [];
```

### Performance Optimizations
1. **Token Design**
   - Minimal payload (id, tier, credits only)
   - Short expiration (1 hour)
   - No unnecessary claims

2. **Memory Management**
   - Redis connection pooling
   - Minimal session data
   - No disk caching

3. **Request Processing**
   - Early returns
   - Combined validations
   - No waterfall promises

4. **Response Handling**
   - Streaming where possible
   - Minimal headers
   - Efficient error formats

## Future Considerations
- Enterprise features (earmarked but not immediate)
- Team collaboration features
- API access for integration
- Advanced asset management

Last Updated: December 30, 2023
