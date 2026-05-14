---
title: "C�mo montar un servidor de m�sica streaming en casa con Jellyfin"
description: "�Tienes una colecci�n de m�sica o quieres escuchar tu m�sica sin anuncios ni limitaciones? Jellyfin te da tu propio Spotify gratuito y autocontenido."
date: 2026-05-24
draft: false
tags: ["jellyfin", "m�sica", "streaming", "self-hosting", "homelab", "media"]
---

# Tu propio Spotify gratuito: Jellyfin Music

Spotify, Apple Music, YouTube Music... todos tienen algo en com�n: **pagas cada mes** y cuando dejas de pagar, pierdes el acceso. �Y si tuvieras tu propia plataforma de m�sica **una sola vez**?

Bienvenido a **Jellyfin**: tu servidor de medios personal, gratuito y autocontenido.

---

## �Qu� es Jellyfin?

Jellyfin es un servidor multimedia **open source** que organiza tu m�sica, pel�culas y series. Es el sustituto libre de Plex, y funciona en cualquier ordenador, incluso un Raspberry Pi.

### Caracter�sticas clave:
- ? **100% gratuito**, sin funciones de pago escondidas
- ? **Sin anuncios**, nunca
- ? **Tus datos son tuyos** � nada se sube a la nube
- ? **Apps oficiales** para m�vil, TV, navegador y tablet
- ? **Transcodificaci�n** � escucha tu m�sica desde cualquier conexi�n
- ? **M�ltiples usuarios** � cada persona con su perfil y sus listas

---

## Instalaci�n con Docker (la forma m�s f�cil)

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
      - /ruta/a/tu/m�sica:/music
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Madrid
```

```bash
docker-compose up -d
```

Ahora accede a `http://tu-servidor:8096` y sigue el asistente de configuraci�n.

---

## Configuraci�n inicial

### 1. A�ade tu biblioteca de m�sica

1. Ve a **Dashboard ? Libraries ? Add Library**
2. Selecciona **Music** como tipo
3. A�ade la carpeta donde tienes tu m�sica (`/music`)
4. Jellyfin escanear� y organizar� autom�ticamente por artista, �lbum y g�nero
5. Activa la descarga de **metadatos** (portadas, letras, biograf�as)

### 2. Optimiza para m�sica

En los ajustes de la biblioteca de m�sica:
- Activa **"Descargar metadatos autom�ticamente"**
- Activa **"Descarga de letras"**
- Configura la calidad de imagen para las portadas (alta recomendado)

### 3. Crea usuarios para tu familia

Jellyfin permite crear **usuarios ilimitados** gratis:
- Cada uno tiene su perfil, sus listas y su historial
- Puedes controlar qu� biblioteca puede ver cada usuario
- Los ni�os pueden tener su perfil con contenido filtrado

---

## C�mo escuchar tu m�sica

### En tu m�vil
- **Jellyfin para Android/iOS** (gratis, sin anuncios)
- **FinTunes** (cliente de terceros, m�s bonito)
- Compatible con **MPV, VLC** y otros reproductores

### En tu ordenador
- **Web** directamente en el navegador
- **Ampache** o **Subsonic compatible clients**

### En tu Smart TV
- **Jellyfin para Android TV / Fire TV / Apple TV**
- Compatible con **Chromecast** (env�a m�sica a tu altavoz)

### En tu coche
- Usa la app m�vil con Android Auto o CarPlay
- Tu m�sica, sin anuncios, sin l�mite de skips

---

## C�mo importar tu m�sica

Si tienes la m�sica en tu ordenador:

```bash
# Opci�n 1: Copia directa
cp -r /home/usuario/M�sica/ /ruta/a/jellyfin/music/

# Opci�n 2: Si usas un NAS, monta la carpeta compartida
mount -t cifs //nas/musica /ruta/a/jellyfin/music/ -o username=tuuser

# Opci�n 3: Si la tienes en Google Drive o similar
rclone copy gdrive:/Music /ruta/a/jellyfin/music/
```

### Formatos soportados
| Formato | �Soportado? |
|---------|-------------|
| MP3 | ? |
| FLAC | ? |
| AAC | ? |
| OGG | ? |
| WAV | ? |
| ALAC | ? |

**Jellyfin tambi�n transcodifica** si tu dispositivo no soporta el formato original.

---

## Truco: Escucha tu m�sica desde fuera de casa

Si quieres acceder a tu servidor desde cualquier parte del mundo (por ejemplo, desde el m�vil con datos):

1. **Opci�n f�cil**: usa Tailscale o ZeroTier (VPN mesh gratuita)
2. **Opci�n media**: configura un reverse proxy con Caddy/Nginx + dominio
3. **Opci�n avanzada**: Cloudflare Tunnel (gratis, sin abrir puertos)

Con Tailzone, desde fuera de casa simplemente abres la app de Jellyfin y conectas como si estuvieras en tu WiFi. **Funciona en 5 segundos.**

---

## Comparativa Jellyfin vs alternativas

| Caracter�stica | Jellyfin | Plex | Spotify |
|---|---|---|---|
| **Precio** | Gratis | Gratis (con limitaciones) | 10�/mes |
| **Sin anuncios** | ? | ? (versi�n gratis) | ? |
| **Sin l�mite de canciones** | ? | ? | Solo con suscripci�n |
| **Tus datos privados** | ? | Parcial | ? |
| **Funciona offline** | ? (descarga) | ? | Solo con premium |
| **Sin internet necesitado** | Solo para subir la biblioteca una vez | Solo para subir | Siempre |

---

## El coste real de tu propio Spotify

```
- Servidor (ya lo tienes o un Raspberry Pi): 0-50�
- Jellyfin: 0�
- Apps m�viles: 0�
- M�sica: ya la tienes o compras una vez
- Coste mensual: 0 �
```

**Una vez montado, no vuelves a pagar por m�sica en streaming nunca m�s.**

---

*�Tienes una colecci�n de m�sica que quieres migrar? �Necesitas ayuda con la configuraci�n de Jellyfin?* Cu�ntamelo y lo montamos juntos. ??