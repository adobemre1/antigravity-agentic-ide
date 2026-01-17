// scripts/check-bundle-size.js
// Exit with code 1 if total size of the built dist folder exceeds 1 MB (1048576 bytes)
const fs = require('fs');
const path = require('path');
const dir = path.resolve(__dirname, '..', 'dist');
let total = 0;
function walk(p) {
  const entries = fs.readdirSync(p, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(p, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else {
      const stats = fs.statSync(full);
      total += stats.size;
    }
  }
}
if (fs.existsSync(dir)) {
  walk(dir);
  console.log(`Bundle size: ${total} bytes`);
  if (total > 1048576) {
    console.error('❌ Bundle size exceeds 1 MB limit');
    process.exit(1);
  } else {
    console.log('✅ Bundle size within limit');
    process.exit(0);
  }
} else {
  console.error('Dist folder not found');
  process.exit(1);
}
