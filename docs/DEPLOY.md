# Deployment Guide

This project is configured for automated deployment using GitHub Actions and Netlify.

## Prerequisites

- A [Netlify](https://www.netlify.com/) account.
- A GitHub repository with this code pushed.
- A Supabase project (for the database and auth).

## Setup Steps

### 1. Netlify Setup
1. Log in to Netlify.
2. Create a new site from Git (optional, as we use CLI deploy, but good for dashboard access).
3. Go to **User Settings** -> **Applications** -> **New Access Token**.
4. Generation a new Personal Access Token. Any name works (e.g., "GitHub CI").
5. Copy this token immediately.

### 2. GitHub Secrets
1. Go to your GitHub Repository.
2. Click **Settings** -> **Secrets and variables** -> **Actions**.
3. Add a **New Repository Secret**:
   - **Name**: `NETLIFY_AUTH_TOKEN`
   - **Value**: (The token you copied from Netlify)
4. Add your Environment Secrets (used by the app) as well, or configure them in the Netlify UI:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GOOGLE_MAPS_API_KEY`
   - `VITE_SK_OR_KEY`

### 3. Automatic Deployment
The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that triggers on every push to `main`.
- It runs linting, building, and testing.
- If all pass, it runs `netlify deploy --prod --dir=dist`.

## Manual Deployment
You can also deploy manually from your local machine:
```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login
netlify login

# Build
npm run build

# Deploy
netlify deploy --prod
```
