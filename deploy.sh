#!/bin/bash
set -e
echo "Starting Deployment to Cloudflare Pages..."

# Build first
echo "Building project..."
npm run build

# Deploy
echo "Deploying..."
# Try to deploy. If this fails due to auth, it will exit non-zero.
# We use npx to ensure we use the local version.
# --project-name is set to 'seyhan-proje-portali' or generated from package name
PROJECT_NAME="seyhan-proje-portali-99"

if npx wrangler pages project list > /dev/null 2>&1; then
    echo "Authenticated. Proceeding with deployment."
    npx wrangler pages deploy dist --project-name "$PROJECT_NAME" --commit-dirty=true
else
    echo "Not authenticated or project not found. Attempting deployment which triggers login..."
    # This might hang if it waits for input. We use --no-bundle to just upload dist? 
    # Actually 'pages deploy' is the command.
    # formatting output to be readable
    npx wrangler pages deploy dist --project-name "$PROJECT_NAME" --commit-dirty=true || true
    echo "If deployment failed, please run 'npx wrangler login' and retry."
fi
