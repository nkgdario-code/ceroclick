// tools/fix-encoding.js — CP1252-aware encoding fix
const fs = require('fs');
const path = require('path');
const baseDir = path.resolve(__dirname, '..', 'content');

// CP1252 Unicode → byte mapping (chars > 0xFF with CP1252 equivalents)
const cp1252 = {};
function map(u, b) { cp1252[u] = b; }
map(0x20AC, 0x80); map(0x201A, 0x82); map(0x0192, 0x83); map(0x201E, 0x84);
map(0x2026, 0x85); map(0x2020, 0x86); map(0x2021, 0x87); map(0x02C6, 0x88);
map(0x2030, 0x89); map(0x0160, 0x8A); map(0x2039, 0x8B); map(0x0152, 0x8C);
map(0x017D, 0x8E); map(0x2018, 0x91); map(0x2019, 0x92); map(0x201C, 0x93);
map(0x201D, 0x94); map(0x2022, 0x95); map(0x2013, 0x96); map(0x2014, 0x97);
map(0x02DC, 0x98); map(0x2122, 0x99); map(0x0161, 0x9A); map(0x203A, 0x9B);
map(0x0153, 0x9C); map(0x017E, 0x9E); map(0x0178, 0x9F);

function fixEncoding(text) {
  // Strip BOM
  let t = text;
  if (t.length > 0 && t.charCodeAt(0) === 0xFEFF) t = t.slice(1);

  const bytes = [];
  for (const ch of t) {
    const cp = ch.codePointAt(0);
    if (cp <= 0x7F) {
      bytes.push(cp);
    } else if (cp >= 0xA0 && cp <= 0xFF) {
      bytes.push(cp);
    } else if (cp1252[cp]) {
      bytes.push(cp1252[cp]);
    } else if (cp >= 0x80 && cp <= 0x9F) {
      bytes.push(cp1252[cp] || 0x3F);
    } else {
      bytes.push(cp & 0xFF);
    }
  }
  return Buffer.from(bytes).toString('utf-8');
}

function processDir(dir) {
  let n = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      n += processDir(p);
    } else if (e.name.endsWith('.md')) {
      const orig = fs.readFileSync(p, 'utf-8');
      const fixed = fixEncoding(orig);
      if (orig !== fixed) {
        fs.writeFileSync(p, fixed, 'utf-8');
        console.log('  Fixed: ' + path.relative(baseDir, p));
        n++;
      }
    }
  }
  return n;
}

console.log('Fixing encoding...\n');
const f = processDir(baseDir);
console.log('\nFiles fixed: ' + f);

// Verify
const tf = path.join(baseDir, 'posts', 'comparativa-vps-baratos-2026.md');
const c = fs.readFileSync(tf, 'utf-8');
console.log('\nVerification:');
console.log('  Has €: ' + c.includes('\u20AC'));
console.log('  Has ó: ' + c.includes('\u00F3'));
console.log('  Has é: ' + c.includes('\u00E9'));
const p = c.match(/5[^\s\/]*\/mes/);
if (p) console.log('  Euro text: ' + p[0]);
else console.log('  Euro text: NOT FOUND');
