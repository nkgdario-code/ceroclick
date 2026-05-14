// tools/fix-encoding.js
const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

const baseDir = path.resolve(__dirname, '..', 'content');

function fixEncoding(content) {
  // Strip BOM (U+FEFF) if present
  let text = content;
  if (text.charCodeAt(0) === 0xFEFF) {
    text = text.slice(1);
  }

  // Convert: corrupted UTF-8 → CP1252 bytes → real UTF-8
  const buf = iconv.encode(text, 'win1252');
  return iconv.decode(buf, 'utf-8');
}

function processDir(dir) {
  let fixed = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      fixed += processDir(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const original = fs.readFileSync(fullPath, 'utf-8');
      const corrected = fixEncoding(original);
      if (original !== corrected) {
        fs.writeFileSync(fullPath, corrected, 'utf-8');
        console.log('✅ ' + path.relative(baseDir, fullPath));
        fixed++;
      }
    }
  }
  return fixed;
}

console.log('🔍 Fixing encoding in .md files...\n');
const n = processDir(baseDir);
console.log('\n📝 Fixed: ' + n + ' files');

// Verify key characters
const sample = fs.readFileSync(path.join(baseDir, 'posts', 'comparativa-vps-baratos-2026.md'), 'utf-8');
console.log('\nVerification:');
console.log('  Has "selección":', sample.includes('selección'));
console.log('  Has "€":', sample.includes('€'));
console.log('  Has "Aquí":', sample.includes('Aquí'));
console.log('  First line:', sample.split('\n')[0]);
