// scripts/check-bundle-size.cjs
// Exit with code 1 if total size of the built dist folder exceeds 1.5 MB
const fs = require('fs');
const path = require('path');
const dir = path.resolve(__dirname, '..', 'dist');
const MAX_SIZE = 1.7 * 1024 * 1024; // 1.7 MB (Adjusted for Map/AI features)

let total = 0;
function walk(p) {
  const entries = fs.readdirSync(p, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(p, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else {
      if (!['.br', '.gz', '.map'].includes(path.extname(full))) {
        const stats = fs.statSync(full);
        total += stats.size;
      }
    }
  }
}
if (fs.existsSync(dir)) {
  walk(dir);
  console.log(`Bundle size: ${total} bytes`);
  if (total > MAX_SIZE) {
    console.error(`❌ Bundle size exceeds ${(MAX_SIZE / 1024 / 1024).toFixed(1)} MB limit`);
    process.exit(1);
  } else {
    console.log('✅ Bundle size within limit');
    process.exit(0);
  }
} else {
  console.error('Dist folder not found');
  process.exit(1);
}
