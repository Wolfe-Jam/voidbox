# Voidbox JavaScript Quick Reference

## 🎯 Type Safety Cheatsheet

### Function Documentation
```javascript
/**
 * @param {string} param1 - Description
 * @param {Object} options - Options object
 * @param {boolean} [options.optional] - Optional param
 * @returns {Promise<string>}
 * @throws {ValidationError}
 */
```

### Common Types
```javascript
/** @type {string[]} */ const names = [];
/** @type {Object.<string, number>} */ const scores = {};
/** @type {(a: number, b: number) => number} */ const add = (a, b) => a + b;
```

### Custom Types
```javascript
/**
 * @typedef {Object} ImageOptions
 * @property {string} prompt - Generation prompt
 * @property {boolean} [withBackground] - Include background
 */
```

## 🛡️ Defensive Programming

### Input Validation
```javascript
// String validation
if (typeof value !== 'string' || !value.trim()) throw new Error();

// Number validation
if (!Number.isFinite(value)) throw new Error();

// Object validation
if (!value || typeof value !== 'object') throw new Error();
```

### Error Handling
```javascript
try {
  await someOperation();
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation error
  } else {
    // Log and show generic error
  }
}
```

## 🏗️ Code Structure

### Module Exports
```javascript
// Single responsibility exports
export const ImageService = {
  generate,
  validate,
  getStatus
};

// Named exports for utilities
export { formatDate, validateInput };
```

### Constants
```javascript
const CONFIG = Object.freeze({
  MAX_LENGTH: 500,
  DEFAULT_MODE: 'dark'
});
```

## ⚡ Performance Tips

### Async Operations
```javascript
// DO: Use async/await
const result = await operation();

// DON'T: Chain promises
operation().then(result => {});
```

### DOM Operations
```javascript
// DO: Batch DOM updates
const fragment = document.createDocumentFragment();
items.forEach(item => fragment.appendChild(item));
container.appendChild(fragment);

// DON'T: Update DOM in loops
items.forEach(item => container.appendChild(item));
```

## 🚫 Common Mistakes

### Avoid
```javascript
// ❌ Global variables
window.config = {};

// ❌ Direct DOM manipulation without checks
element.innerHTML = userInput;

// ❌ Implicit type coercion
if (value == null)

// ❌ Undocumented functions
const process = () => {};
```

### Prefer
```javascript
// ✅ Scoped configuration
const config = {};

// ✅ Safe DOM updates
element.textContent = sanitizeInput(userInput);

// ✅ Strict equality
if (value === null || value === undefined)

// ✅ Documented functions
/** @param {string} value */
const process = (value) => {};
```

## 🔍 Code Review Checklist
- [ ] JSDoc comments complete
- [ ] Input validation present
- [ ] Error handling implemented
- [ ] No global state mutations
- [ ] Clear function signatures
- [ ] Proper type checking
- [ ] Performance considerations
- [ ] Security measures

---
*For detailed guidelines, see STANDARDS.md*
