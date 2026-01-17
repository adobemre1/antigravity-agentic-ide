# Deployment Guide

This project is configured for automated deployment to **Netlify** via GitHub Actions.

## Configuration

The deployment settings are defined in `netlify.toml`:

- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Redirects:** SPA catch-all redirect (`/*` -> `/index.html`)
- **Headers:** Security headers (CSP, X-Frame-Options) and Cache-Control.

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) handles the process:

1.  **Build & Test:** Runs on every push.
    - Lints code.
    - Runs unit/e2e tests.
    - Checks bundle size (< 1MB).
2.  **Preview Deploy:** Runs on Pull Requests.
    - Deploys a preview version to Netlify.
    - Helper script: `npm run deploy -- --alias preview-<pr_id>`
3.  **Production Deploy:** Runs on push to `main`.
    - Deploys to the production URL.

## Manual Deployment

You can deploy manually using the Netlify CLI (if authenticated):

```bash
npm run deploy
```

## Rollback

To rollback to a previous version, use the provided script:

```bash
./scripts/rollback.sh <COMMIT_HASH>
```
*Note: Requires `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` environment variables.*
