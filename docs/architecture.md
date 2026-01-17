# Architecture & Tech Stack

## Overview

The Project Portal is a single-page application (SPA) built for performance, accessibility, and ease of use. It serves as a showcase for municipal projects.

## Core Stack

- **Framework:** [React 18](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Routing:** [React Router v6](https://reactrouter.com/)
- **Internationalization:** [i18next](https://www.i18next.com/)

## Key Libraries

- **Animations:** `framer-motion` for page transitions and UI effects.
- **Data Fetching:** `urql` (GraphQL) / `supabase-js` for database interactions.
- **Math Visualization:** `mathjs` & `three.js` for 3D/graphical elements.
- **PWA:** `vite-plugin-pwa` for offline capabilities and installability.

## Directory Structure

```
src/
├── components/   # Reusable UI components (buttons, cards, layout)
├── pages/        # Route components (HomePage, ProjectDetail)
├── hooks/        # Custom React hooks
├── store/        # Zustand stores (global state)
├── types/        # TypeScript interfaces and types
├── utils/        # Helper functions
├── data/         # Static JSON data (mock projects, taxonomy)
└── e2e/          # Playwright end-to-end tests
```

## Performance Optimizations

- **Code Splitting:** Manual chunks configured in `vite.config.ts`.
- **Assets:** WebP conversion and Brotli compression enabled.
- **Lazy Loading:** Route-based code splitting using `React.lazy`.
- **Bundle Analysis:** `rollup-plugin-visualizer` available for monitoring.
