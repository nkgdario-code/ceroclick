// tools/new-post.js
// Crea un nuevo artículo, hace commit y push a GitHub
// Uso: node tools/new-post.js "Título del artículo" "Descripción SEO" "tag1,tag2,tag3"

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const title = args[0];
const desc = args[1] || '';
const tagsInput = args[2] || '';

if (!title) {
  console.log('❌ Uso: node tools/new-post.js "Título" "Descripción SEO" "tag1,tag2"');
  console.log('\nEjemplo:');
  console.log('  node tools/new-post.js "Cómo usar n8n con Telegram" "Guía paso a paso" "n8n,telegram,automatización"');
  process.exit(1);
}

// Generar slug
const slug = title
  .toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const date = new Date().toISOString().slice(0, 10);
const tags = tagsInput.split(',').filter(Boolean).map(t => `"${t.trim()}"`).join(', ');

const frontMatter = `---
title: "${title}"
description: "${desc || 'Artículo de Ceroclick sobre automatización y productividad'}"
date: ${date}
draft: false
tags: [${tags || '"automatización"'}]
---

# ${title}

<!-- Escribe aquí el contenido del artículo -->

`

const contentDir = path.resolve(__dirname, '..', 'content', 'posts');
const filePath = path.join(contentDir, `${slug}.md`);

if (fs.existsSync(filePath)) {
  console.log(`❌ El archivo ya existe: ${slug}.md`);
  process.exit(1);
}

fs.writeFileSync(filePath, frontMatter, 'utf-8');

console.log(`✅ Artículo creado: ${filePath}`);
console.log(`   URL: https://ceroclick.es/posts/${slug}/`);
console.log('');
console.log('📝 Ahora edita el archivo y añade el contenido.');
console.log('');
console.log('Para publicar:');
console.log('  cd ceroclick');
console.log('  git add content/posts/' + slug + '.md');
console.log('  git commit -m "📝 Nuevo artículo: ' + title + '"');
console.log('  git push');
console.log('  npx vercel --prod' +'  (o espera al deploy automático)');
