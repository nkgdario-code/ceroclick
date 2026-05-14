---
title: "C�mo crear un bot de IA en Telegram en 20 minutos (sin saber programar)"
description: "Aprende a crear un bot de Telegram con inteligencia artificial que responde preguntas, genera im�genes y m�s. Tutorial paso a paso sin c�digo."
date: 2026-05-26
draft: false
tags: ["bot", "telegram", "IA", "inteligencia artificial", "tutorial", "automatizaci�n", "API"]
---

# C�mo crear un bot de IA en Telegram en 20 minutos

�Te imaginas tener un asistente de IA **personal** que responde en Telegram cada vez que le preguntas? Pues puedes montarlo en 20 minutos. Gratis. Y sin saber programar.

---

## �Qu� vamos a construir?

Un bot de Telegram que:
-  Responde preguntas usando IA (ChatGPT)
-  Genera im�genes a partir de texto
-  Traduce mensajes
-  Resumen art�culos o textos largos
-  Puedes ampliar con cualquier funci�n que se te ocurra

---

## Paso 1: Crear el bot en Telegram

1. Abre Telegram y busca **@BotFather**
2. Escribe `/newbot`
3. Dale un nombre: `Mi Bot IA`
4. Dale un username: `mi_bot_ia_unique`
5. **Copia el TOKEN** que te da (algo como `123456789:ABCdefGHI...`) � lo necesitar�s

---

## Paso 2: Conseguir una API de OpenAI (gratis con l�mites)

1. Ve a [platform.openai.com](https://platform.openai.com)
2. Crea una cuenta (o inicia sesi�n)
3. Ve a **API Keys � Create new secret key**
4. **Copia la clave** � la necesitar�s

> � La capa gratuita incluye **$5 de cr�dito** para los primeros 3 meses. M�s que suficiente para probar.

---

## Paso 3: Usar n8n para conectar todo (sin c�digo)

Aqu� es donde la magia pasa. [n8n](https://n8n.io) es una herramienta de automatizaci�n **open source** que puedes instalar gratis en tu servidor (o usar su versi�n cloud).

### Instalar n8n (si lo self-hosteas):

```bash
docker run -d --name n8n \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  --restart always \
  n8nio/n8n
```

Accede a `http://tu-servidor:5678` y sigue el asistente.

### Crear el workflow:

1. **A�ade un nodo "Telegram Trigger"**
   - Selecciona tu bot token
   - Elige "On Message"

2. **A�ade un nodo "OpenAI"**
   - Conecta tu API key
   - Modelo: gpt-4o-mini (el m�s barato y r�pido)
   - Prompt: `"Responde a este mensaje de forma �til y concisa: {{ $json.message.text }}"`

3. **A�ade un nodo "Telegram Send Message"**
   - Conecta el output del nodo OpenAI
   - Chat ID: `{{ $json.chat.id }}`
   - Text: `{{ $json.choices[0].message.content }}`

4. **Activa el workflow** �

### Diagrama del flujo:

```
[Mensaje en Telegram] � [OpenAI GPT] � [Respuesta en Telegram]
```

**Eso es todo.** Ahora puedes hablar con tu bot desde Telegram.

---

## Paso 4: A�adir m�s funciones

### Generaci�n de im�genes

1. A�ade un **nodo IF** despu�s del trigger
2. Condici�n: si el mensaje empieza con `/imagen`
3. Si es true � nodo **OpenAI DALL-E** (genera la imagen)
4. Si es false � flujo normal de texto

### Traducci�n autom�tica

Cambia el prompt a: `"Traduce el siguiente mensaje al ingl�s: {{ $json.message.text }}"`

### Resumen de textos largos

Prompt: `"Resume brevemente el siguiente texto en 3 puntos clave: {{ $json.message.text }}"`

---

## Paso 5: Desplegar el bot 24/7

Tu bot necesita estar siempre encendido. Opciones:

| Opci�n | Coste | Dificultad |
|--------|-------|-----------|
| **Tu propio servidor** | 0� (si ya tienes uno) | Media |
| **Vercel/Render** | Gratis (con l�mites) | Baja |
| **Oracle Cloud Free** | Gratis | Media |
| **Railway** | Gratis (750h/mes) | Baja |

### Recomendaci�n:
Si ya tienes un servidor o VPS, despliega n8n ah� con Docker y olv�date. Si no, **Railway** te da 750 horas/mes gratis (m�s que suficiente para un bot personal).

---

## Coste total del proyecto

| Concepto | Coste |
|----------|-------|
| Bot de Telegram | 0� |
| API de OpenAI (capa gratuita) | 0� (3 meses) / ~5�/mes despu�s |
| n8n (self-hosted) | 0� |
| Servidor (si ya lo tienes) | 0� |
| **TOTAL** | **0� para empezar** |

---

## Seguridad y buenas pr�cticas

- **No actives el bot como p�blico** hasta que no quieras que cualquiera lo use
- **Limita los comandos** para evitar abusos
- **Usa variables de entorno** para las API keys (nunca las pongas en el c�digo)
- **Activa logs** para monitorizar el uso
- Si el bot es solo para ti, usa `/setjoingroups` con @BotFather para que nadie m�s lo a�ada a grupos

---

## �Qu� m�s puedes hacer?

| Idea | Dificultad |
|------|-----------|
| Bot que responde preguntas sobre tus documentos (RAG) | Media |
| Bot que genera memes sobre lo que le mandes | F�cil |
| Bot de recordatorios y alarmas | F�cil |
| Bot que controla dispositivos de tu smart home | Media |
| Bot que monitoriza precios de productos y te avisa | Media |

---

*�Quieres que te monte el workflow completo de n8n exportado para importar directamente? Tan solo tieneso ped�rmelo.* 