# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-16

### Added
- **PWA Support:** Offline capabilities, install prompts, and manifest generation using `vite-plugin-pwa`.
- **Internationalization (i18n):** Full support for Turkish (tr) and English (en) languages via `i18next`.
- **Admin Dashboard:** Secure, role-based access for managing projects (requires admin authentication).
- **Advanced Analytics:** Privacy-first tracking with Plausible integration and a custom analytics wrapper.
- **Error Monitoring:** Sentry integration for real-time error tracking and performance monitoring.
- **Advanced Search:** Interactive category filtering, fuzzy search, and math-based visualizations.
- **Security:** Strict CSP headers, X-Frame-Options, and secure routing.
- **Documentation:** Comprehensive guides for Setup, Architecture, Deployment, and Contributing.

### Changed
- **UI/UX:** Complete visual overhaul to a modern, glassmorphism-inspired design using Tailwind CSS and Framer Motion.
- **Navigation:** Smoother page transitions and responsive mobile menu.
- **Typography:** Updated to use Inter font family with optimized legibility.
- **Build System:** Migrated to strict type-checking and enhanced linting rules.

### Performance
- **Bundle Optimization:** Reduced bundle size to < 1.1MB via `manualChunks` splitting.
- **Compression:** Enabled Brotli and WebP support for assets.
- **CI/CD:** Enforced bundle size limits and automated deployments via GitHub Actions.

### Fixed
- **Accessibility:** Achieved WCAG 2.1 AA compliance (Contrast, ARIA, Keyboard Navigation).
- **SEO:** Improved meta tags, sitemap generation, and semantic HTML structure.
