// tools/fix-encoding.js — String-replacement based fix
const fs = require('fs');
const path = require('path');
const baseDir = path.resolve(__dirname, '..', 'content');

// Direct character replacements: [corrupted_chars, correct_char]
const table = [
  ['\u00C3\u00A1', '\u00E1'], ['\u00C3\u00A9', '\u00E9'],
  ['\u00C3\u00AD', '\u00ED'], ['\u00C3\u00B3', '\u00F3'],
  ['\u00C3\u00BA', '\u00FA'], ['\u00C3\u00B1', '\u00F1'],
  ['\u00C3\u00BC', '\u00FC'], ['\u00C3\u0081', '\u00C1'],
  ['\u00C3\u0089', '\u00C9'], ['\u00C3\u008D', '\u00CD'],
  ['\u00C3\u0093', '\u00D3'], ['\u00C3\u009A', '\u00DA'],
  ['\u00C3\u0091', '\u00D1'], ['\u00C3\u009C', '\u00DC'],
  ['\u00C2\u00BF', '\u00BF'], ['\u00C2\u00A1', '\u00A1'],
  ['\u00C2\u00B7', '\u00B7'],
];

const symTable = [
  ['\u00E2\u201A\u00AC', '\u20AC'], ['\u00E2\u20AC\u2122', '\u2019'],
  ['\u00E2\u20AC\u0153', '\u201C'], ['\u00E2\u20AC', '\u201C'],
];

function fixEncoding(text) {
  let t = text;
  if (t.length > 0 && t.charCodeAt(0) === 0xFEFF) t = t.slice(1);
  for (const [from, to] of symTable) {
    while (t.includes(from)) t = t.replace(from, to);
  }
  for (const [from, to] of table) {
    while (t.includes(from)) t = t.replace(from, to);
  }
  return t;
}

function processDir(dir) {
  let n = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) n += processDir(p);
    else if (e.name.endsWith('.md')) {
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

console.log('Fixing encoding (string replacement)...\n');
const f = processDir(baseDir);
console.log('\nFiles fixed: ' + f);

// Verify docker title
const dc = fs.readFileSync(path.join(baseDir, 'posts', 'docker-para-torpes.md'), 'utf-8');
const title = dc.split('\n')[1];
console.log('\nTitle: ' + title);
console.log('Has FFFD: ' + (title.includes('\uFFFD') ? 'FAIL' : 'OK'));
console.log('Has qu\u00E9: ' + (dc.includes('qu\u00E9') ? 'OK' : 'FAIL'));

// Verify euro
const vps = fs.readFileSync(path.join(baseDir, 'posts', 'comparativa-vps-baratos-2026.md'), 'utf-8');
console.log('Has 5\u20AC: ' + (vps.includes('5\u20AC') ? 'OK' : 'FAIL'));
console.log('Has selecci\u00F3n: ' + (vps.includes('selecci\u00F3n') ? 'OK' : 'FAIL'));
