---
title: "Cómo montar un gestor de contraseñas autocontenido (Vaultwarden)"
description: "Aprende a instalar Vaultwarden, un clon gratuito y autocontenido de Bitwarden, para gestionar todas tus contraseñas de forma segura sin depender de nadie."
date: 2026-05-23
draft: false
tags: ["seguridad", "contraseñas", "vaultwarden", "self-hosting", "docker", "privacidad"]
---

# Cómo montar tu propio gestor de contraseñas autocontenido

Cada vez tenemos más cuentas online. Netflix, correo, redes sociales, banco, trabajo... y cada una con una contraseña distinta. La mayoría de la gente **reutiliza contraseñas** o las apunta en un Excel. Ambas opciones son un desastre de seguridad.

Hay una alternativa mejor: **tu propio gestor de contraseñas, en tu servidor, sin depender de nadie**.

---

## ¿Qué es Vaultwarden?

[Vaultwarden](https://github.com/dani-garcia/vaultwarden) es una implementación **ligera y autocontenida** de Bitwarden, el gestor de contraseñas open source más popular.

¿Por qué Vaultwarden y no Bitwarden directamente?
- **Consume 10 veces menos recursos** (funciona en un Raspberry Pi)
- **No necesitas pagar** (Bitwarden cloud cuesta ~10€/año)
- **Tus datos están en tu servidor**, no en la nube de nadie
- **Compatible con todos los navegadores y móvil** (usa extensiones oficiales de Bitwarden)

---

## Instalación con Docker (5 minutos)

### Paso 1: Crear las carpetas de datos

```bash
mkdir -p /opt/vaultwarden/data
```

### Paso 2: Ejecutar el contenedor

```bash
docker run -d \
  --name vaultwarden \
  -p 8081:80 \
  -v /opt/vaultwarden/data:/data \
  -e ADMIN_TOKEN="una-contraseña-segura-aleatoria" \
  -e ROCKET_TLS='{}' \
  --restart always \
  vaultwarden/server:latest
```

### Paso 3: Configurar HTTPS con reverse proxy

Si tienes un dominio (como tu homelab), puedes usar Nginx Proxy Manager o Caddy:

```yaml
# docker-compose.yml
version: '3'
services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    restart: always
    volumes:
      - ./data:/data
    environment:
      - ADMIN_TOKEN=tu-token-seguro-aqui
      - WEBSOCKET_ENABLED=true
      - SIGNUPS_ALLOWED=true  # Desactivar después del primer registro
    ports:
      - 8081:80
```

---

## Post-instalación (importante)

1. **Accede al panel admin** en `http://tu-servidor:8081/admin`
2. Entra con el token que definiste en `ADMIN_TOKEN`
3. **Desactiva el registro público** (Settings → General → Allow new signups → OFF)
4. Crea tu cuenta de usuario

---

## Configurar en tu navegador y móvil

### Escritorio (Chrome/Firefox)
1. Instala la **extensión de Bitwarden** desde la tienda de extensiones
2. En el login, selecciona "Self-hosted environment"
3. Servidor: `https://tu-dominio.com`
4. Login con tu email y contraseña maestra

### Móvil (Android/iOS)
1. Instala la **app oficial de Bitwarden**
2. En configuración, cambia el servidor a `https://tu-dominio.com`
3. Login normal

---

## Organización inteligente de contraseñas

Un gestor de contraseñas es tan bueno como la organización que le des. Aquí va mi sistema:

### Carpetas recomendadas
```
📁 Banca
   ├── Cuenta principal
   ├── Tarjeta de crédito
   └── Inversiones

📁 Trabajo
   ├── Email corporativo
   ├── Herramientas internas
   └── VPN del trabajo

📁 Personal
   ├── Redes sociales
   ├── Streaming
   └── Tienda online

📁 Servidores
   ├── SSH - homelab
   ├── Admin - router
   └── API keys
```

### Campos personalizados (útil para servidores)
Para cada servicio, añade:
- **URL del panel de administración**
- **IP del servidor**
- **Puerto SSH**
- **Notas** (comandos útiles, instrucciones de recuperación)

---

## Características avanzadas

| Característica | Para qué sirve |
|---|---|
| **Autenticación en 2 pasos (2FA)** | Protege el acceso aunque alguien robe tu contraseña maestra |
| **Autofill** | Rellena contraseñas automáticamente en webs y apps |
| **Generador de contraseñas** | Crea contraseñas aleatorias de 32+ caracteres |
| **Send (envío seguro)** | Comparte contraseñas o notas de forma cifrada temporal |
| **Favoritos** | Marca los servicios que más usas para acceso rápido |
| **Auditoría de contraseñas** | Detecta contraseñas débiles, reutilizadas o comprometidas |

---

## Seguridad: lo que NUNCA debes hacer

- ❌ Nunca uses la misma contraseña en dos sitios
- ❌ Nunca guardes contraseñas en el navegador (Chrome/Safari)
- ❌ Nunca compartas la contraseña maestra
- ❌ Nunca apuntes contraseñas en papel o notas del móvil sin cifrar
- ✅ Usa una **contraseña maestra larga** (4+ palabras aleatorias)
- ✅ Activa **2FA** en todos los servicios importantes
- ✅ Haz **backup** de la carpeta de datos de Vaultwarden

---

## Backup automático de Vaultwarden

Añade esta tarea programada para no perder nunca tus contraseñas:

```bash
#!/bin/bash
FECHA=$(date +%Y-%m-%d)
BACKUP_DIR="/mnt/backups/vaultwarden"

docker cp vaultwarden:/data/ "$BACKUP_DIR/data-$FECHA"
tar -czf "$BACKUP_DIR/vaultwarden-$FECHA.tar.gz" -C "$BACKUP_DIR" "data-$FECHA"
rm -rf "$BACKUP_DIR/data-$FECHA"

# Mantener solo los últimos 30 backups
find "$BACKUP_DIR" -name "vaultwarden-*.tar.gz" -mtime +30 -delete
echo "Backup de Vaultwarden creado: vaultwarden-$FECHA.tar.gz"
```

Programa con cron: `0 1 * * * /ruta/al/script/backup-vaultwarden.sh`

---

*¿Quieres que te prepare un flujo completo de Vaultwarden + Authelia para proteger todos tus servicios self-hosted con Single Sign-On?* 🔐