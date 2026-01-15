#!/usr/bin/env bash
set -e

APP_DIR="/Users/emrecnyngmail.com/Desktop/araştır"
# Find the latest backup directory
BACKUP_DIR=$(ls -dt /Users/emrecnyngmail.com/Desktop/araştır_backup_* | head -1)

if [ -z "$BACKUP_DIR" ]; then
    echo "Error: No backup directory found!"
    exit 1
fi

echo "Resuming Bootstrap from $BACKUP_DIR..."
cd "$APP_DIR"

# 1. Install Correct Dependencies
echo "Installing corrected dependencies..."
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest \
  eslint@latest prettier@latest @typescript-eslint/parser@latest @typescript-eslint/eslint-plugin@latest \
  vite-plugin-compression@latest @vitejs/plugin-react@latest

# Corrected package names: minisearch instead of mini-search
npm install zustand@latest urql@latest minisearch@latest mathjs@latest three@latest @types/three@latest \
  i18next@latest react-i18next@latest playwright@latest axe-core@latest

# 2. Initialize Tailwind
# npx tailwindcss init -p

# 3. Restore Custom Scaffold Files from Backup
echo "Restoring custom scaffold and data..."

restore_file() {
    if [ -f "$BACKUP_DIR/$1" ]; then
        cp "$BACKUP_DIR/$1" "$2"
        echo "Restored $1"
    fi
}

restore_file "tsconfig.json" "."
restore_file "vite.config.ts" "."
restore_file "tailwind.config.cjs" "."
restore_file "package.json" "."
restore_file ".eslintrc.cjs" "."
restore_file ".prettierrc" "."

# Restore Src content
mkdir -p src/components src/lib src/data src/workers public e2e

if [ -d "$BACKUP_DIR/src" ]; then
    cp -R "$BACKUP_DIR/src/"* "src/"
fi

if [ -d "$BACKUP_DIR/public" ]; then
    cp -R "$BACKUP_DIR/public/"* "public/" 2>/dev/null || true
fi

# Restore Data Files
mkdir -p src/data/originals
find "$BACKUP_DIR" -maxdepth 1 -name "Proje_*.txt" -exec cp {} src/data/originals/ \; 2>/dev/null || true
find "$BACKUP_DIR" -maxdepth 1 -name "*_Listesi.txt" -exec cp {} src/data/originals/ \; 2>/dev/null || true
find "$BACKUP_DIR" -maxdepth 1 -name "*.json" -exec cp {} src/data/originals/ \; 2>/dev/null || true

# Update vite.config.ts to use vite-plugin-compression if we restored the old one which had 'compress'
# (The previous vite.config.ts imported 'vite-plugin-compress' and used 'compress()')
# We need to fix that file to use 'vite-plugin-compression'.
# Actually, I'll write a small sed replacement or just overwrite if I had the content.
# Better: I will overwrite vite.config.ts with the correct content NOW in this script.

echo "Fixing vite.config.ts..."
cat > vite.config.ts <<EOF
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [react(), compression({ verbose: false })],
  build: {
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          zustand: ['zustand'],
          urql: ['urql'],
          three: ['three'],
          mathjs: ['mathjs']
        }
      }
    }
  },
  css: {
    postcss: {
      plugins: []
    }
  }
});
EOF

echo "Bootstrap Correction Complete. Project ready in $APP_DIR."
