# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Fixed

- Migrated ESLint configuration from legacy `.eslintrc.cjs` to flat config format (`eslint.config.js`) for ESLint 9.x compatibility
- Removed duplicate ErrorBoundary implementation from `main.tsx`
- Moved build-time plugins to devDependencies in `package.json`

### Added

- JSON-LD structured data for improved SEO
- Security-related meta tags (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)
- Environment variable support for site URL in sitemap generator

### Changed

- Simplified `main.tsx` by reusing existing ErrorBoundary component
- Wrapped console.log statements with development environment check
- Updated lint scripts to work with ESLint flat config

## [2.0.0] - 2025-11-11

### Added

- 🚀 Performance: Migrated Tailwind from CDN to npm
- 📁 Refactored project structure with src/ directory
- ✨ Added loading states, skeleton screens, and error boundaries
- 🔍 SEO enhancements with dynamic meta tags and sitemap
- ♿ Accessibility improvements (WCAG 2.1 Level AA)
- 🔒 Secure Supabase authentication for admin panel
- 📖 Reading time calculator for blog posts
- ⬆️ Back to top button
- 🔗 Social share buttons
- 📚 Comprehensive documentation

### Changed

- Improved build performance with code splitting
- Enhanced UX with empty states
- Better error handling throughout app

### Security

- Replaced client-side password with Supabase Auth
- Implemented proper session management
- Added protected routes

## [1.0.0] - 2025-11-01

### Added

- Initial release
- Basic blog functionality
- Admin panel
- Dark mode
- Responsive design
