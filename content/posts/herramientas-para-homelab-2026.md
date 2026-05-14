---
title: "Las 10 mejores herramientas para tu homelab en 2026 (todas gratis)"
description: "Una selección de las 10 herramientas imprescindibles para cualquier homelab en 2026. Gestión de contraseñas, monitorización, media y más."
date: 2026-05-28
draft: false
tags: ["homelab", "herramientas", "self-hosting", "Docker", "2026"]
---

# Las 10 mejores herramientas para tu homelab en 2026

Montar un homelab es emocionante, pero elegir las herramientas adecuadas puede ser abrumador. Después de probar decenas de opciones, estas son las que realmente merecen la pena — todas gratuitas y open source.

<!--more-->


---

## 1. Uptime Kuma — Monitorización bonita y simple

**Qué hace:** Monitoriza tus servidores, servicios y webs con alertas automáticas.

¿Por qué Uptime Kuma?
- Interfaz moderna y fácil de usar
- Notificaciones por Telegram, Discord, email, Slack...
- Monitoriza HTTP, TCP, DNS, ping, certificados SSL y más
- Dashboard en tiempo real
- Se instala en un solo comando de Docker

```bash
docker run -d --name uptime-kuma \
  -p 3001:3001 \
  -v uptime-kuma:/app/data \
  --restart always \
  louislam/uptime-kuma:1
```

**Puntuación:** ⭐⭐⭐⭐⭐ — Si solo puedes instalar UNA herramienta, que sea esta.

---

## 2. Vaultwarden — Tu gestor de contraseñas

**Qué hace:** Gestor de contraseñas compatible con Bitwarden, autocontenido.

**Puntuación:** ⭐⭐⭐⭐⭐ — Esencial para la seguridad.

*(Consulta nuestra guía completa de instalación en otro artículo de esta web.)*

---

## 3. Portainer — Gestión de Docker sin complicaciones

**Qué hace:** Interfaz web para gestionar contenedores, imágenes, redes y volúmenes Docker.

¿Por qué Portainer?
- Gestiona todos tus contenedores desde el navegador
- Crea stacks con Docker Compose visualmente
- Monitoriza recursos (CPU, RAM, disco)
- Gestión de usuarios y permisos
- Actualización de contenedores con un clic

```bash
docker run -d --name portainer \
  -p 9443:9443 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  --restart always \
  portainer/portainer-ce:latest
```

**Puntuación:** ⭐⭐⭐⭐ — Imprescindible cuando tienes más de 5 contenedores.

---

## 4. Jellyfin — Tu propio Spotify/Netflix

**Qué hace:** Servidor multimedia para música, películas y series.

- Reproduce en cualquier dispositivo (móvil, TV, navegador)
- Sin anuncios, sin límites
- Transcodificación automática
- Multi-usuario
- Scrapea metadatos y portadas automáticamente

```bash
docker run -d --name jellyfin \
  -p 8096:8096 \
  -v jellyfin_config:/config \
  -v jellyfin_cache:/cache \
  -v /ruta/a/tu/música:/music \
  --restart unless-stopped \
  jellyfin/jellyfin:latest
```

**Puntuación:** ⭐⭐⭐⭐⭐ — La mejor alternativa gratuita a Plex.

---

## 5. n8n — Automatización total

**Qué hace:** Conecta servicios y automatiza flujos de trabajo.

- 200+ integraciones disponibles
- Flujos visuales arrastrables
- Puedes añadir código JavaScript/Python cuando lo necesitas
- Self-hosted, tus datos no salen de tu servidor

**Puntuación:** ⭐⭐⭐⭐⭐ — El cerebro de tu homelab.

---

## 6. Grafana + Prometheus — Monitorización avanzada

**Qué hace:** Sistema de monitorización con dashboards personalizables.

- **Prometheus** recoge métricas de tu servidor
- **Grafana** las muestra en gráficos bonitos y personalizables
- Puedes monitorizar CPU, RAM, disco, red, temperatura...
- Alertas automáticas por Telegram/email

```bash
# Prometheus
docker run -d --name prometheus \
  -p 9090:9090 \
  -v ./prometheus.yml:/etc/prometheus/prometheus.yml \
  --restart unless-stopped \
  prom/prometheus

# Grafana
docker run -d --name grafana \
  -p 3000:3000 \
  --restart unless-stopped \
  grafana/grafana-oss
```

**Puntuación:** ⭐⭐⭐⭐ — Imprescindible si te gusta tenerlo todo bajo control.

---

## 7. Nextcloud — Tu propio Google Drive

**Qué hace:** Almacenamiento y sincronización de archivos en tu servidor.

- Sincroniza archivos entre dispositivos (como Dropbox/Google Drive)
- Comparte archivos con enlaces públicos o privados
- Edición colaborativa de documentos
- Calendario y contactos integrados
- Cliente de escritorio, móvil y web

```bash
docker run -d --name nextcloud \
  -p 8080:80 \
  -v nextcloud_data:/var/www/html \
  --restart unless-stopped \
  nextcloud:latest
```

**Puntuación:** ⭐⭐⭐⭐ — Para quien quiera control total sobre sus archivos.

---

## 8. Watchtower — Actualización automática de contenedores

**Qué hace:** Actualiza automáticamente tus contenedores Docker cuando hay nuevas versiones.

- Revisa automáticamente las imágenes en Docker Hub
- Descarga la nueva versión y reinicia el contenedor
- Se configura y te olvidas

```bash
docker run -d --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower \
  --cleanup --schedule "0 0 4 * * *"
```

**Puntuación:** ⭐⭐⭐⭐ — Instálalo y olvídate de actualizaciones.

---

## 9. Navidrome — Tu servidor de música personal

**Qué hace:** Servidor de música tipo Spotify, ligero y eficiente.

- Reproduce música desde el navegador o apps móviles
- Scrapea portadas, letras y metadatos
- Soporta transcoding (convierte FLAC a MP3 al vuelo)
- Ligero: funciona en un Raspberry Pi

```bash
docker run -d --name navidrome \
  -p 4533:4533 \
  -v /ruta/a/tu/música:/music \
  -v navidrome_data:/data \
  --restart unless-stopped \
  deluanloudon/navidrome:latest
```

**Puntuación:** ⭐⭐⭐⭐ — Más ligero que Jellyfin si solo escuchas música.

---

## 10. Duplicati — Backups cifrados en la nube

**Qué hace:** Backups automáticos, cifrados y a múltiples destinos.

- Backups cifrados con AES-256
- Soporta destinos: S3, Google Drive, Dropbox, FTP, WebDAV...
- Incremental y deduplicado
- Interfaz web para configurar y monitorizar

```bash
docker run -d --name duplicati \
  -p 8200:8200 \
  -v duplicati_data:/backups \
  -v /ruta/a/datos:/source \
  --restart unless-stopped \
  linuxserver/duplicati
```

**Puntuación:** ⭐⭐⭐⭐ — Los backups son lo ÚNICO que no puedes negociar.

---

## Resumen visual

| Herramienta | Para qué | Prioridad |
|---|---|---|
| Uptime Kuma | Monitorización | 🔴 Alta |
| Vaultwarden | Contraseñas | 🔴 Alta |
| Portainer | Gestión Docker | 🟡 Media-alta |
| Jellyfin | Pelis y música | 🟡 Media-alta |
| n8n | Automatización | 🟡 Media-alta |
| Grafana+Prometheus | Métricas | 🟡 Media |
| Nextcloud | Archivos | 🟡 Media |
| Watchtower | Auto-actualizar | 🟢 Baja (pero útil) |
| Navidrome | Música | 🟢 Baja |
| Duplicati | Backups cifrados | 🔴 Alta |

---

## Orden de instalación recomendado

1. **Uptime Kuma** → Vigila que todo funcione
2. **Vaultwarden** → Asegura tus contraseñas
3. **Duplicati** → Protege tus datos
4. **Watchtower** → Mantén todo actualizado
5. **Portainer** → Gestiona tu infraestructura
6. **n8n** → Automatiza tu vida
7. **Jellyfin o Navidrome** → Entretenimiento
8. **Grafana + Prometheus** → Métricas avanzadas
9. **Nextcloud** → Si necesitas sincronización de archivos

---

*¿Ya tienes alguno de estos en tu homelab? ¿Cuál echas de menos en la lista?*</tool_call>}