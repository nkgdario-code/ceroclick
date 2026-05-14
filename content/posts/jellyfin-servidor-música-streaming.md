---
title: "Cómo montar un servidor de música streaming en casa con Jellyfin"
description: "¿Tienes una colección de música o quieres escuchar tu música sin anuncios ni limitaciones? Jellyfin te da tu propio Spotify gratuito y autocontenido."
date: 2026-05-24
draft: false
tags: ["jellyfin", "música", "streaming", "self-hosting", "homelab", "media"]
---

# Tu propio Spotify gratuito: Jellyfin Music

Spotify, Apple Music, YouTube Music... todos tienen algo en común: **pagas cada mes** y cuando dejas de pagar, pierdes el acceso. ¿Y si tuvieras tu propia plataforma de música **una sola vez**?

Bienvenido a **Jellyfin**: tu servidor de medios personal, gratuito y autocontenido.

---

## ¿Qué es Jellyfin?

Jellyfin es un servidor multimedia **open source** que organiza tu música, películas y series. Es el sustituto libre de Plex, y funciona en cualquier ordenador, incluso un Raspberry Pi.

### Características clave:
- ✅ **100% gratuito**, sin funciones de pago escondidas
- ✅ **Sin anuncios**, nunca
- ✅ **Tus datos son tuyos** — nada se sube a la nube
- ✅ **Apps oficiales** para móvil, TV, navegador y tablet
- ✅ **Transcodificación** — escucha tu música desde cualquier conexión
- ✅ **Múltiples usuarios** — cada persona con su perfil y sus listas

---

## Instalación con Docker (la forma más fácil)

```yaml
# docker-compose.yml
version: '3'
services:
  jellyfin:
    image: jellyfin/jellyfin:latest
    container_name: jellyfin
    restart: unless-stopped
    ports:
      - 8096:8096
      - 7359:7359/udp  # Para descubrimiento en red local
    volumes:
      - ./config:/config
      - ./cache:/cache
      - /ruta/a/tu/música:/music
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Madrid
```

```bash
docker-compose up -d
```

Ahora accede a `http://tu-servidor:8096` y sigue el asistente de configuración.

---

## Configuración inicial

### 1. Añade tu biblioteca de música

1. Ve a **Dashboard → Libraries → Add Library**
2. Selecciona **Music** como tipo
3. Añade la carpeta donde tienes tu música (`/music`)
4. Jellyfin escaneará y organizará automáticamente por artista, álbum y género
5. Activa la descarga de **metadatos** (portadas, letras, biografías)

### 2. Optimiza para música

En los ajustes de la biblioteca de música:
- Activa **"Descargar metadatos automáticamente"**
- Activa **"Descarga de letras"**
- Configura la calidad de imagen para las portadas (alta recomendado)

### 3. Crea usuarios para tu familia

Jellyfin permite crear **usuarios ilimitados** gratis:
- Cada uno tiene su perfil, sus listas y su historial
- Puedes controlar qué biblioteca puede ver cada usuario
- Los niños pueden tener su perfil con contenido filtrado

---

## Cómo escuchar tu música

### En tu móvil
- **Jellyfin para Android/iOS** (gratis, sin anuncios)
- **FinTunes** (cliente de terceros, más bonito)
- Compatible con **MPV, VLC** y otros reproductores

### En tu ordenador
- **Web** directamente en el navegador
- **Ampache** o **Subsonic compatible clients**

### En tu Smart TV
- **Jellyfin para Android TV / Fire TV / Apple TV**
- Compatible con **Chromecast** (envía música a tu altavoz)

### En tu coche
- Usa la app móvil con Android Auto o CarPlay
- Tu música, sin anuncios, sin límite de skips

---

## Cómo importar tu música

Si tienes la música en tu ordenador:

```bash
# Opción 1: Copia directa
cp -r /home/usuario/Música/ /ruta/a/jellyfin/music/

# Opción 2: Si usas un NAS, monta la carpeta compartida
mount -t cifs //nas/musica /ruta/a/jellyfin/music/ -o username=tuuser

# Opción 3: Si la tienes en Google Drive o similar
rclone copy gdrive:/Music /ruta/a/jellyfin/music/
```

### Formatos soportados
| Formato | ¿Soportado? |
|---------|-------------|
| MP3 | ✅ |
| FLAC | ✅ |
| AAC | ✅ |
| OGG | ✅ |
| WAV | ✅ |
| ALAC | ✅ |

**Jellyfin también transcodifica** si tu dispositivo no soporta el formato original.

---

## Truco: Escucha tu música desde fuera de casa

Si quieres acceder a tu servidor desde cualquier parte del mundo (por ejemplo, desde el móvil con datos):

1. **Opción fácil**: usa Tailscale o ZeroTier (VPN mesh gratuita)
2. **Opción media**: configura un reverse proxy con Caddy/Nginx + dominio
3. **Opción avanzada**: Cloudflare Tunnel (gratis, sin abrir puertos)

Con Tailzone, desde fuera de casa simplemente abres la app de Jellyfin y conectas como si estuvieras en tu WiFi. **Funciona en 5 segundos.**

---

## Comparativa Jellyfin vs alternativas

| Característica | Jellyfin | Plex | Spotify |
|---|---|---|---|
| **Precio** | Gratis | Gratis (con limitaciones) | 10€/mes |
| **Sin anuncios** | ✅ | ❌ (versión gratis) | ❌ |
| **Sin límite de canciones** | ✅ | ✅ | Solo con suscripción |
| **Tus datos privados** | ✅ | Parcial | ❌ |
| **Funciona offline** | ✅ (descarga) | ✅ | Solo con premium |
| **Sin internet necesitado** | Solo para subir la biblioteca una vez | Solo para subir | Siempre |

---

## El coste real de tu propio Spotify

```
- Servidor (ya lo tienes o un Raspberry Pi): 0-50€
- Jellyfin: 0€
- Apps móviles: 0€
- Música: ya la tienes o compras una vez
- Coste mensual: 0 €
```

**Una vez montado, no vuelves a pagar por música en streaming nunca más.**

---

*¿Tienes una colección de música que quieres migrar? ¿Necesitas ayuda con la configuración de Jellyfin?* Cuéntamelo y lo montamos juntos. 🎵