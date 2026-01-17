#!/bin/bash
# Rollback Netlify deployment to previous version
# Requires NETLIFY_AUTH_TOKEN env var and netlify-cli installed
set -e
if [ -z "$NETLIFY_AUTH_TOKEN" ]; then
  echo "NETLIFY_AUTH_TOKEN is not set"
  exit 1
fi
# Get the latest production deploy ID
LATEST_ID=$(netlify api listSiteDeploys --data '{"site_id":"$NETLIFY_SITE_ID"}' | jq -r '.[] | select(.state=="ready") | .id' | head -n 1)
if [ -z "$LATEST_ID" ]; then
  echo "No ready deploy found"
  exit 1
fi
# Trigger rollback to previous deploy (Netlify does not have direct rollback, we redeploy previous commit)
# Here we assume you have a previous commit tag stored in $PREV_COMMIT
if [ -z "$PREV_COMMIT" ]; then
  echo "PREV_COMMIT not set"
  exit 1
fi
# Checkout previous commit and deploy
git checkout $PREV_COMMIT
npm ci
npm run build
netlify deploy --prod --dir=dist
# Return to original branch
git checkout -
