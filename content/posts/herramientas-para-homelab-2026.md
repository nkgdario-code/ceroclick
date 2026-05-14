---
title: "Las 10 mejores herramientas para tu homelab en 2026 (todas gratis)"
description: "Una selecci�n de las 10 herramientas imprescindibles para cualquier homelab en 2026. Gesti�n de contrase�as, monitorizaci�n, media y m�s."
date: 2026-05-28
draft: false
tags: ["homelab", "herramientas", "self-hosting", "Docker", "2026"]
---

# Las 10 mejores herramientas para tu homelab en 2026

Montar un homelab es emocionante, pero elegir las herramientas adecuadas puede ser abrumador. Despu�s de probar decenas de opciones, estas son las que realmente merecen la pena � todas gratuitas y open source.

---

## 1. Uptime Kuma � Monitorizaci�n bonita y simple

**Qu� hace:** Monitoriza tus servidores, servicios y webs con alertas autom�ticas.

�Por qu� Uptime Kuma?
- Interfaz moderna y f�cil de usar
- Notificaciones por Telegram, Discord, email, Slack...
- Monitoriza HTTP, TCP, DNS, ping, certificados SSL y m�s
- Dashboard en tiempo real
- Se instala en un solo comando de Docker

```bash
docker run -d --name uptime-kuma \
  -p 3001:3001 \
  -v uptime-kuma:/app/data \
  --restart always \
  louislam/uptime-kuma:1
```

**Puntuaci�n:** ????? � Si solo puedes instalar UNA herramienta, que sea esta.

---

## 2. Vaultwarden � Tu gestor de contrase�as

**Qu� hace:** Gestor de contrase�as compatible con Bitwarden, autocontenido.

**Puntuaci�n:** ????? � Esencial para la seguridad.

*(Consulta nuestra gu�a completa de instalaci�n en otro art�culo de esta web.)*

---

## 3. Portainer � Gesti�n de Docker sin complicaciones

**Qu� hace:** Interfaz web para gestionar contenedores, im�genes, redes y vol�menes Docker.

�Por qu� Portainer?
- Gestiona todos tus contenedores desde el navegador
- Crea stacks con Docker Compose visualmente
- Monitoriza recursos (CPU, RAM, disco)
- Gesti�n de usuarios y permisos
- Actualizaci�n de contenedores con un clic

```bash
docker run -d --name portainer \
  -p 9443:9443 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  --restart always \
  portainer/portainer-ce:latest
```

**Puntuaci�n:** ???? � Imprescindible cuando tienes m�s de 5 contenedores.

---

## 4. Jellyfin � Tu propio Spotify/Netflix

**Qu� hace:** Servidor multimedia para m�sica, pel�culas y series.

- Reproduce en cualquier dispositivo (m�vil, TV, navegador)
- Sin anuncios, sin l�mites
- Transcodificaci�n autom�tica
- Multi-usuario
- Scrapea metadatos y portadas autom�ticamente

```bash
docker run -d --name jellyfin \
  -p 8096:8096 \
  -v jellyfin_config:/config \
  -v jellyfin_cache:/cache \
  -v /ruta/a/tu/m�sica:/music \
  --restart unless-stopped \
  jellyfin/jellyfin:latest
```

**Puntuaci�n:** ????? � La mejor alternativa gratuita a Plex.

---

## 5. n8n � Automatizaci�n total

**Qu� hace:** Conecta servicios y automatiza flujos de trabajo.

- 200+ integraciones disponibles
- Flujos visuales arrastrables
- Puedes a�adir c�digo JavaScript/Python cuando lo necesitas
- Self-hosted, tus datos no salen de tu servidor

**Puntuaci�n:** ????? � El cerebro de tu homelab.

---

## 6. Grafana + Prometheus � Monitorizaci�n avanzada

**Qu� hace:** Sistema de monitorizaci�n con dashboards personalizables.

- **Prometheus** recoge m�tricas de tu servidor
- **Grafana** las muestra en gr�ficos bonitos y personalizables
- Puedes monitorizar CPU, RAM, disco, red, temperatura...
- Alertas autom�ticas por Telegram/email

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

**Puntuaci�n:** ???? � Imprescindible si te gusta tenerlo todo bajo control.

---

## 7. Nextcloud � Tu propio Google Drive

**Qu� hace:** Almacenamiento y sincronizaci�n de archivos en tu servidor.

- Sincroniza archivos entre dispositivos (como Dropbox/Google Drive)
- Comparte archivos con enlaces p�blicos o privados
- Edici�n colaborativa de documentos
- Calendario y contactos integrados
- Cliente de escritorio, m�vil y web

```bash
docker run -d --name nextcloud \
  -p 8080:80 \
  -v nextcloud_data:/var/www/html \
  --restart unless-stopped \
  nextcloud:latest
```

**Puntuaci�n:** ???? � Para quien quiera control total sobre sus archivos.

---

## 8. Watchtower � Actualizaci�n autom�tica de contenedores

**Qu� hace:** Actualiza autom�ticamente tus contenedores Docker cuando hay nuevas versiones.

- Revisa autom�ticamente las im�genes en Docker Hub
- Descarga la nueva versi�n y reinicia el contenedor
- Se configura y te olvidas

```bash
docker run -d --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower \
  --cleanup --schedule "0 0 4 * * *"
```

**Puntuaci�n:** ???? � Inst�lalo y olv�date de actualizaciones.

---

## 9. Navidrome � Tu servidor de m�sica personal

**Qu� hace:** Servidor de m�sica tipo Spotify, ligero y eficiente.

- Reproduce m�sica desde el navegador o apps m�viles
- Scrapea portadas, letras y metadatos
- Soporta transcoding (convierte FLAC a MP3 al vuelo)
- Ligero: funciona en un Raspberry Pi

```bash
docker run -d --name navidrome \
  -p 4533:4533 \
  -v /ruta/a/tu/m�sica:/music \
  -v navidrome_data:/data \
  --restart unless-stopped \
  deluanloudon/navidrome:latest
```

**Puntuaci�n:** ???? � M�s ligero que Jellyfin si solo escuchas m�sica.

---

## 10. Duplicati � Backups cifrados en la nube

**Qu� hace:** Backups autom�ticos, cifrados y a m�ltiples destinos.

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

**Puntuaci�n:** ???? � Los backups son lo �NICO que no puedes negociar.

---

## Resumen visual

| Herramienta | Para qu� | Prioridad |
|---|---|---|
| Uptime Kuma | Monitorizaci�n | ?? Alta |
| Vaultwarden | Contrase�as | ?? Alta |
| Portainer | Gesti�n Docker | ?? Media-alta |
| Jellyfin | Pelis y m�sica | ?? Media-alta |
| n8n | Automatizaci�n | ?? Media-alta |
| Grafana+Prometheus | M�tricas | ?? Media |
| Nextcloud | Archivos | ?? Media |
| Watchtower | Auto-actualizar | ?? Baja (pero �til) |
| Navidrome | M�sica | ?? Baja |
| Duplicati | Backups cifrados | ?? Alta |

---

## Orden de instalaci�n recomendado

1. **Uptime Kuma** ? Vigila que todo funcione
2. **Vaultwarden** ? Asegura tus contrase�as
3. **Duplicati** ? Protege tus datos
4. **Watchtower** ? Mant�n todo actualizado
5. **Portainer** ? Gestiona tu infraestructura
6. **n8n** ? Automatiza tu vida
7. **Jellyfin o Navidrome** ? Entretenimiento
8. **Grafana + Prometheus** ? M�tricas avanzadas
9. **Nextcloud** ? Si necesitas sincronizaci�n de archivos

---

*�Ya tienes alguno de estos en tu homelab? �Cu�l echas de menos en la lista?*</tool_call>}