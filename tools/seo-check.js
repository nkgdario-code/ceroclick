// tools/seo-check.js
const https = require('https');
function get(u) {
  return new Promise((r, j) => {
    https.get(u, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => r(d)); }).on('error', j);
  });
}
async function main() {
  const h = await get('https://ceroclick.es/posts/docker-para-torpes/');
  console.log('BreadcrumbList:', h.includes('BreadcrumbList') ? 'OK' : 'NO');
  console.log('article:tag:', (h.match(/article:tag/g) || []).length + ' tags');
  console.log('published_time:', h.includes('article:published_time') ? 'OK' : 'NO');
  console.log('modified_time:', h.includes('article:modified_time') ? 'OK' : 'NO');
  console.log('keywords meta:', h.includes('name="keywords"') ? 'OK' : 'NO');
  console.log('JSON-LD keywords:', h.includes('"keywords"') ? 'OK' : 'NO');
  console.log('canonical:', h.includes('canonical') ? 'OK' : 'NO');
}
main();
