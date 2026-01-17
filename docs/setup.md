# Development Setup

This guide will help you set up the project locally for development.

## Prerequisites

- **Node.js**: v18 or higher recommended.
- **npm**: v9 or higher.
- **Git**: For version control.
- **VS Code**: Recommended editor (with ESLint and Prettier extensions).

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/seyhanbelediyesi/proje-portali.git
    cd proje-portali
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    VITE_SENTRY_DSN=your_sentry_dsn
    ```

## Development

Start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

## Build

To build for production:
```bash
npm run build
```
This generates the `dist` folder.

## Testing

- **Unit/Integration:** `npm run test` (Playwright)
- **Visual Regression:** `npm run test:visual`
- **Accessibility:** `npm run test:accessibility`

## Linting

```bash
npm run lint
```
