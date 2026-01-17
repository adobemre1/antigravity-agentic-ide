#!/bin/bash
# Run Lighthouse audit on the Antigravity component demo page
# Requires Chrome (or Chromium) and the lighthouse npm package installed globally:
#   npm install -g lighthouse
# Usage: ./run_lighthouse.sh

URL="http://localhost:8000/index.html"
OUTPUT="lighthouse-report.html"

# Run lighthouse and save the HTML report
lighthouse "$URL" --output=html --output-path="$OUTPUT" --quiet

echo "Lighthouse report generated at $OUTPUT"
