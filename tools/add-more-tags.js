// tools/add-more-tags.js
// Adds <!--more--> tags to posts for better summaries
const fs = require('fs');
const path = require('path');
const dir = path.resolve(__dirname, '..', 'content', 'posts');

let count = 0;
for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith('.md')) continue;
  const fp = path.join(dir, f);
  let c = fs.readFileSync(fp, 'utf-8');
  if (c.includes('<!--more-->')) continue;

  // Normalize line endings temporarily
  const lines = c.split(/\r?\n/);
  
  // Find front matter end (2nd ---)
  let fmEnd = -1;
  let dashCount = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      dashCount++;
      if (dashCount === 2) { fmEnd = i; break; }
    }
  }
  if (fmEnd === -1) continue;
  
  // Content starts after front matter + 1 blank line
  let contentStart = fmEnd + 1;
  while (contentStart < lines.length && lines[contentStart].trim() === '') contentStart++;
  
  // First H1 should be at contentStart
  const h1 = contentStart;
  
  // Skip blank lines after H1
  let afterH1 = h1 + 1;
  while (afterH1 < lines.length && lines[afterH1].trim() === '') afterH1++;
  
  // Find end of first content paragraph (next blank line after first paragraph)
  let pEnd = afterH1;
  while (pEnd < lines.length && lines[pEnd].trim() !== '') pEnd++;
  
  if (pEnd >= lines.length) continue;
  
  // Insert <!--more--> after first paragraph
  lines.splice(pEnd, 0, '', '<!--more-->', '');
  
  // Write back
  c = lines.join('\r\n');
  fs.writeFileSync(fp, c, 'utf-8');
  console.log('  Added: ' + f);
  count++;
}

console.log('\nDone: ' + count + ' files');
