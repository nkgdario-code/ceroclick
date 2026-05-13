---
title: "De Zero a automatizado: cÃ³mo montar tu primer workflow en n8n en 30 minutos"
description: "Tutorial paso a paso para crear tu primera automatizaciÃ³n en n8n sin conocimientos de programaciÃ³n. Conectaremos Telegram, Google Sheets y una API en 30 minutos."
date: 2026-05-20
draft: false
tags: ["n8n", "tutorial", "automatizaciÃ³n", "workflow", "DIY", "self-hosted"]
---

# De Zero a automatizado: tu primer workflow en n8n en 30 minutos

n8n puede parecer intimidante al principio, pero una vez haces tu primer flujo, te enganchas. En este tutorial vamos a crear un **bot de Telegram** que guarda lo que le mandes en una **hoja de Google Sheets**. Sin cÃ³digo. En 30 minutos.

---

## Antes de empezar

Necesitas:
- **n8n** instalado (puedes usar Docker: `docker run -d --name n8n -p 5678:5678 n8nio/n8n`)
- Un **bot de Telegram** (crearlo es gratis, te explico abajo)
- Una **cuenta de Google** con acceso a Google Sheets API

### Crear un bot de Telegram (2 minutos)

1. Abre Telegram y busca `@BotFather`
2. Escribe `/newbot`
3. Dale un nombre (ej: "ceroclick Bot")
4. Dale un username (ej: `ceroclick_autobot`)
5. **Copia el token** que te da. Lo vas a necesitar.

---

## Paso 1: Configurar las credenciales en n8n

En n8n, ve a **Settings â†’ Credentials** y aÃ±ade:

### Telegram API
- **Bot Token**: el token que copiaste del BotFather
- Guarda

### Google Sheets OAuth2
- Ve a [Google Cloud Console](https://console.cloud.google.com/)
- Crea un nuevo proyecto
- Habilita la API de Google Sheets
- Crea credenciales OAuth2 (tipo "Web Application")
- En redirect URI pon: `https://tudominio.com/rest/oauth2-credential/callback`
- Copia el **Client ID** y **Client Secret**
- En n8n, selecciona "Google Sheets OAuth2" y pega esos datos

---

## Paso 2: Crear el workflow

### Nodo 1 â€” Telegram Trigger
1. Arrastra un nodo **Telegram Trigger** al canvas
2. Selecciona tu credencial de Telegram
3. Deja "Updates" como estÃ¡

### Nodo 2 â€” Set (formatear datos)
1. Arrastra un nodo **Set** y conÃ©ctalo al anterior
2. Configura:
   - `chat_id` â†’ `{{ $json.message.chat.id }}`
   - `texto` â†’ `{{ $json.message.text }}`
   - `fecha` â†’ `{{ $now.toISO() }}`

### Nodo 3 â€” Google Sheets
1. Arrastra un nodo **Google Sheets** y conÃ©ctalo
2. Selecciona tu credencial de Google
3. OperaciÃ³n: **Append** (aÃ±adir fila)
4. Document ID: el ID de tu hoja de cÃ¡lculo (estÃ¡ en la URL)
5. Sheet Name: `Datos`
6. Columnas: `chat_id`, `texto`, `fecha`

### Conecta todo y activa

```
[Telegram Trigger] â†’ [Set] â†’ [Google Sheets]
```

Pulsa **"Active"** en la esquina superior derecha. Â¡Ya estÃ¡!

---

## Paso 3: Probar

1. Abre Telegram y manda un mensaje a tu bot
2. Ve a tu hoja de Google Sheets
3. DeberÃ­a aparecer una nueva fila con tu mensaje âœ…

---

## Ideas para extenderlo

| Mejora | CÃ³mo |
|--------|------|
| Responder automÃ¡ticamente | AÃ±ade otro nodo Telegram despuÃ©s del Set con un mensaje de confirmaciÃ³n |
| Filtrar comandos | AÃ±ade un nodo **IF** que solo guarde si el mensaje empieza con `/guardar` |
| Enviar alertas | Si alguien manda "ALERTA", envÃ­a un email con **Send Email** node |
| Guardar imÃ¡genes | Usa el trigger de `photo` y guarda la URL en un campo |
| Responder con IA | Conecta un nodo **OpenAI** para que tu bot responda preguntas inteligentes |

---

## Resumen

En 30 minutos has creado:
- âœ… Un bot de Telegram funcional
- âœ… Un sistema de almacenamiento en Google Sheets
- âœ… Un workflow automatizado que guarda todo lo que le mandes

Esto es solo el principio. Con n8n puedes conectar **cientos de servicios** y crear automatizaciones que te ahorran horas cada dÃ­a.

---

*Â¿Quieres que montemos algo mÃ¡s complejo? Un bot que responda automÃ¡ticamente con informaciÃ³n de tu homelab, por ejemplo.*