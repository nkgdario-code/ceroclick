# 🚀 Ceroclick — Automatización y Productividad

Sitio web estático generado con [Hugo](https://gohugo.io), desplegado en [Vercel](https://vercel.com).

**Live:** https://ceroclick.es

---

## 📋 Setup rápido (primera vez)

### Requisitos
- [Git](https://git-scm.com/) instalado
- Cuenta en [GitHub](https://github.com)
- Cuenta en [Vercel](https://vercel.com) (se vincula con GitHub)

### Paso 1: Crear el repositorio en GitHub

1. Ve a [github.com/new](https://github.com/new)
2. Nombre del repo: `ceroclick`
3. Marca **"Add a README file"**
4. Pulsa **Create repository**

### Paso 2: Subir los archivos

```bash
cd ceroclick
git init
git add .
git commit -m "🚀 Inicio - Ceroclick: Automatización y Productividad"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/ceroclick.git
git push -u origin main
```

### Paso 3: Desplegar en Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Selecciona el repo `ceroclick` de GitHub
3. Framework preset: **Hugo**
4. Pulsa **Deploy**
5. En **Settings → Domains**, añade:
   - `ceroclick.es`
   - `www.ceroclick.es`

¡Listo! Tu web estará online en ~1 minuto.

---

## 📁 Estructura del proyecto

```
ceroclick/
├── config.toml              # Configuración de Hugo
├── vercel.json              # Config de Vercel (versión Hugo)
├── content/
│   ├── posts/               # Artículos del blog
│   │   ├── automatizar-tareas-repetitivas-con-bash.md
│   │   ├── n8n-vs-nodemcu-vs-zapier.md
│   │   ├── notion-templates-productividad.md
│   │   ├── automation-home-server.md
│   │   ├── ahorrar-dinero-suscripciones.md
│   │   ├── n8n-primer-workflow-tutorial.md
│   │   ├── linea-de-comandos-guia-principiantes.md
│   │   ├── docker-para-torpes.md
│   │   ├── vaultwarden-gestor-contraseñas-autocontenido.md
│   │   ├── jellyfin-servidor-música-streaming.md
│   │   ├── comparativa-vps-baratos-2026.md
│   │   ├── chatbot-telegram-IA-pasos.md
│   │   ├── herramientas-IA-gratuitas-productividad.md
│   │   └── herramientas-para-homelab-2026.md
│   └── pages/
│       ├── sobre.md         # Página "Sobre nosotros"
│       └── herramientas.md  # Página "Herramientas recomendadas"
├── layouts/                 # Plantillas HTML
│   ├── _default/
│   │   ├── baseof.html
│   │   ├── list.html
│   │   └── single.html
│   ├── partials/
│   │   ├── head.html
│   │   ├── header.html
│   │   └── footer.html
│   ├── index.html           # Página de inicio
│   └── 404.html             # Página de error
├── static/
│   ├── css/
│   │   └── style.css        # Estilos (diseño moderno, responsive)
│   ├── images/
│   │   └── og-image.png     # Imagen para redes sociales
│   ├── fonts/               # (vacío, por si se añaden fuentes)
│   └── robots.txt           # Optimizado para SEO
├── data/                    # Datos globales
├── assets/                  # SCSS u otros assets
│   └── scss/
└── .gitignore
```

---

## ✍️ Añadir nuevos artículos

Crea un archivo en `content/posts/`:

```markdown
---
title: "Título del artículo"
description: "Descripción corta para SEO (máx 160 caracteres)"
date: 2026-05-29
draft: false
tags: ["tag1", "tag2", "tag3"]
---

Contenido del artículo...
```

**Publicar:**
```bash
git add .
git commit -m "📝 Nuevo artículo: Título"
git push
```

Vercel lo despliega automáticamente.

---

## 🎨 Personalizar diseño

- **Colores:** Modifica las variables CSS en `static/css/style.css` (busca `:root`)
- **Logo/Texto:** Edita el logo en `layouts/partials/head.html`
- **Footer:** Edita `layouts/partials/footer.html`
- **Favicon:** Reemplaza `static/images/favicon.png`
- **OG Image:** Crea una imagen de 1200×630px y reemplaza `static/images/og-image.png`

---

## 📊 SEO

- Sitemap generado automáticamente por Hugo en `/sitemap.xml`
- `robots.txt` configurado y optimizado
- Datos estructurados JSON-LD en artículos (schema.org Article)
- Open Graph y Twitter Cards configurados
- Core Web Vitals: optimizado (sitio estático = velocidad máxima)

---

## 🔗 Integraciones

### Google Analytics
Añade tu ID en `config.toml`:
```toml
[services.googleAnalytics]
  ID = "G-XXXXXXXXXX"
```

---

## 🧹 Mantenimiento

```bash
# Actualizar Hugo localmente (para previsualizar)
hugo server -D

# Ver resultado antes de publicar
hugo -D  # genera en /public

# Deploy
git add . && git commit -m "Update" && git push
```

---

*Generado el 13/05/2026 — Ceroclick*
