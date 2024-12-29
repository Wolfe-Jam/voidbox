
## [v1.1.2] - 2024-12-29

### Changes
- Added automated backup, changelog, and version validation features

# Changelog

All notable changes to the Voidbox project will be documented in this file.

## [0.1.0-beta.1] - 2024-01-17

### Added
- Initial Beta release
- Zero Background Generation (ZBG) core functionality
- Make.com webhook integration for image processing
- Mobile-first responsive design
- Modern, minimalist UI with Tailwind CSS
- Interactive ZBG info dropdown
- Image download functionality
- Email sharing capability
- Loading state with 3D cube animation
- Version indicator in UI

### Technical
- Express.js server setup
- Static file serving
- Error handling
- Mobile-optimized animations
- Responsive design implementation

## [0.1.1-beta.1] - 2024-01-17

### Recovery & Fixes
- Recovered project from backup after data management incident
- Fixed static file serving paths
- Corrected asset loading in index.html
- Established comprehensive version control procedures
- Added detailed recovery documentation

### Added
- VERSION_CONTROL.md with detailed procedures
- Enhanced backup procedures
- Improved development workflow documentation

### Technical
- Configured nodemon for development
- Added npm scripts for server management
- Improved static file organization

## [0.1.2-beta.1] - 2024-01-17

### Fixed
- Static file serving in production (icon.svg, main.js, favicon.ico)
- Added proper mobile web app meta tags
- Specified Tailwind version for production
- Improved Make.com webhook response handling

## [1.0.0] - 2024-01-17

### Production Release 🚀
- First production deployment to Vercel
- Stable image generation via Make.com webhook
- Mobile-responsive design with Tailwind CSS
- Progressive Web App (PWA) support
- Production-ready static file serving

### Features
- Zero-background image generation
- Minimalist, modern UI
- Mobile-first design
- Real-time image preview
- Serverless deployment

## [1.0.1] - 2024-01-17

### Added
- Core.js module for robust image generation
- Comprehensive unit tests with Jest
- Input validation and error handling
- Clean API separation between core and UI

### Technical
- Implemented VoidboxCore class
- Added custom VoidboxError handling
- Jest testing configuration
- ES Module support

## [1.1.0] - 2023-12-28
### Added
- Core Features Documentation (CORE_FEATURES.md)
- Standardized timestamp format for downloads

### Fixed
- Download functionality now properly handles external URLs
- Email modal positioning at bottom of image
- Delete button positioning

### Protected
- Core functionality locked and documented:
  - Image Generation (basic, ZBG, random)
  - View functionality
  - Download functionality
  - Email sharing
  - Delete/Clear feature
