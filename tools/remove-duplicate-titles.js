// tools/remove-duplicate-titles.js
// Removes "# Title" from markdown content (it's already shown by the template)
const fs = require('fs');
const path = require('path');
const dir = path.resolve(__dirname, '..', 'content', 'posts');

let count = 0;
for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith('.md') || f === '_index.md') continue;
  const fp = path.join(dir, f);
  let c = fs.readFileSync(fp, 'utf-8');
  const lines = c.split(/\r?\n/);

  let inFrontMatter = true;
  let dashCount = 0;
  let removeIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (t === '---') {
      dashCount++;
      if (dashCount === 2) { inFrontMatter = false; continue; }
    }
    if (!inFrontMatter && t.startsWith('# ') && removeIdx === -1) {
      removeIdx = i;
      break;
    }
  }

  if (removeIdx !== -1) {
    lines.splice(removeIdx, 1);
    c = lines.join('\r\n');
    fs.writeFileSync(fp, c, 'utf-8');
    console.log('  Fixed: ' + f);
    count++;
  }
}

console.log('\nDone: ' + count + ' files');
