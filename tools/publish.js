// tools/publish.js
// Publica un nuevo artículo: crea archivo, hace commit, push y deploy a Vercel
// Uso: node tools/publish.js "Título" "Descripción SEO" "tag1,tag2,tag3"
//
// También puedes usarlo para actualizar contenido modificado y redesplegar:
//   node tools/publish.js --deploy

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const REPO_DIR = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(REPO_DIR, 'content', 'posts');

// --- Deploy-only mode ---
if (args[0] === '--deploy') {
  console.log('🚀 Redesplegando...\n');
  const vercelToken = process.env.VERCEL_TOKEN;
  if (!vercelToken) {
    console.log('❌ VERCEL_TOKEN no definido. Ejecuta: set VERCEL_TOKEN=tu_token');
    process.exit(1);
  }
  run('git push', REPO_DIR);
  const out = run(`npx vercel --prod --token ${vercelToken} --yes`, REPO_DIR);
  console.log(out);
  process.exit(0);
}

const title = args[0];
const desc = args[1] || 'Artículo de Ceroclick sobre automatización y productividad';
const tagsInput = args[2] || 'automatización';

if (!title) {
  console.log('❌ Uso: node tools/publish.js "Título" "Descripción" "tag1,tag2"');
  console.log('   O:  node tools/publish.js --deploy  (solo redesplegar)');
  console.log('\n📝 Ejemplo:');
  console.log('  node tools/publish.js "Cómo usar n8n con Telegram" "Guía paso a paso" "n8n,telegram,IA"');
  process.exit(1);
}

function run(cmd, cwd = REPO_DIR) {
  try {
    return execSync(cmd, { cwd, encoding: 'utf-8', stdio: 'pipe' });
  } catch (e) {
    return e.stdout + '\n' + e.stderr;
  }
}

// --- 1. Generar slug ---
const slug = title
  .toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const filePath = path.join(CONTENT_DIR, `${slug}.md`);

if (fs.existsSync(filePath)) {
  console.log(`⚠️ El archivo ya existe. Se actualizará la fecha.`);
}

// --- 2. Crear/escribir el archivo ---
const today = new Date().toISOString().slice(0, 10);
const tags = tagsInput.split(',').filter(Boolean).map(t => `"${t.trim()}"`).join(', ');

const frontMatter = `---
title: "${title}"
description: "${desc}"
date: ${today}
draft: false
tags: [${tags || '"automatización"'}]
---

# ${title}

_Artículo generado el ${today} — rellena aquí el contenido._

`

fs.writeFileSync(filePath, frontMatter, 'utf-8');
console.log(`✅ Artículo creado: content/posts/${slug}.md`);
console.log(`   URL: https://ceroclick.es/posts/${slug}/\n`);

// --- 3. Commit y push ---
console.log('📦 Commitando y pusheando...');
run('git add content/posts/' + slug + '.md', REPO_DIR);
run(`git commit -m "📝 Nuevo artículo: ${title}"`, REPO_DIR);
const pushOut = run('git push', REPO_DIR);
console.log(pushOut);

// --- 4. Deploy a Vercel ---
console.log('🚀 Desplegando en Vercel...\n');
const vercelToken = process.env.VERCEL_TOKEN;
if (!vercelToken) {
  console.log('❌ VERCEL_TOKEN no definido. Usa: $env:VERCEL_TOKEN="tu_token"');
  process.exit(1);
}
const deployOut = run(`npx vercel --prod --token ${vercelToken} --yes`, REPO_DIR);
console.log(deployOut);

console.log('\n✅ Publicado: https://ceroclick.es/posts/' + slug + '/');
