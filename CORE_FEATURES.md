# VoidBox Core Features Documentation
Version: 1.3.0-beta.1
Date: December 29, 2023 20:06 EST

## Core Functionality (PROTECTED)

These features are considered production-ready and MUST NOT be modified without explicit approval:

### 1. Image Generation
- Basic prompt generation
- Zero background generation (ZBG)
- Random prompt generation
- Make.com integration for processing

### 2. Core Features
- **View**: Opens image in new tab
- **Download**: Direct download with timestamp format `Void-Box-YYYY-MM-DD-HH-MM-SS.png`
- **Email**: Modal at bottom of image for sharing
- **Delete/Clear**: X button for removing current image

## Implementation Notes

All core features have been tested and verified working as of December 28, 2023. The download functionality specifically requires the fetch/blob approach due to handling external Make.com URLs.

## Version History

### 1.1.0 - Core Features Locked (2023-12-28)
- Stabilized all core features
- Fixed download functionality
- Standardized timestamp format
- Protected core feature implementations

### 1.0.0 - Initial Release
- Basic functionality implemented
- Core features established

## Development Guidelines

1. Core features must remain unchanged unless:
   - A critical bug is discovered
   - A security vulnerability is found
   - Explicit approval is given for modification

2. New features should be built around, not on top of, core functionality

3. Any proposed changes to core features must go through:
   - Documentation of current behavior
   - Explicit approval process
   - Thorough testing
   - Version update

## Technical Specifications

### Download Implementation
```javascript
// Protected implementation - Do not modify
downloadButton.addEventListener('click', async () => {
    const img = document.querySelector('#result img');
    if (!img) {
        showNotification('No image to download!', true);
        return;
    }

    try {
        const response = await fetch(img.src);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const now = new Date();
        const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `Void-Box-${timestamp}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download error:', error);
        showNotification('Failed to download image', true);
    }
});
```

---
Document maintained by Wolfe James LLC
