---
title: "C�mo montar un gestor de contrase�as autocontenido (Vaultwarden)"
description: "Aprende a instalar Vaultwarden, un clon gratuito y autocontenido de Bitwarden, para gestionar todas tus contrase�as de forma segura sin depender de nadie."
date: 2026-05-23
draft: false
tags: ["seguridad", "contrase�as", "vaultwarden", "self-hosting", "docker", "privacidad"]
---

# C�mo montar tu propio gestor de contrase�as autocontenido

Cada vez tenemos m�s cuentas online. Netflix, correo, redes sociales, banco, trabajo... y cada una con una contrase�a distinta. La mayor�a de la gente **reutiliza contrase�as** o las apunta en un Excel. Ambas opciones son un desastre de seguridad.

Hay una alternativa mejor: **tu propio gestor de contrase�as, en tu servidor, sin depender de nadie**.

---

## �Qu� es Vaultwarden?

[Vaultwarden](https://github.com/dani-garcia/vaultwarden) es una implementaci�n **ligera y autocontenida** de Bitwarden, el gestor de contrase�as open source m�s popular.

�Por qu� Vaultwarden y no Bitwarden directamente?
- **Consume 10 veces menos recursos** (funciona en un Raspberry Pi)
- **No necesitas pagar** (Bitwarden cloud cuesta ~10�/a�o)
- **Tus datos est�n en tu servidor**, no en la nube de nadie
- **Compatible con todos los navegadores y m�vil** (usa extensiones oficiales de Bitwarden)

---

## Instalaci�n con Docker (5 minutos)

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
  -e ADMIN_TOKEN="una-contrase�a-segura-aleatoria" \
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
      - SIGNUPS_ALLOWED=true  # Desactivar despu�s del primer registro
    ports:
      - 8081:80
```

---

## Post-instalaci�n (importante)

1. **Accede al panel admin** en `http://tu-servidor:8081/admin`
2. Entra con el token que definiste en `ADMIN_TOKEN`
3. **Desactiva el registro p�blico** (Settings ? General ? Allow new signups ? OFF)
4. Crea tu cuenta de usuario

---

## Configurar en tu navegador y m�vil

### Escritorio (Chrome/Firefox)
1. Instala la **extensi�n de Bitwarden** desde la tienda de extensiones
2. En el login, selecciona "Self-hosted environment"
3. Servidor: `https://tu-dominio.com`
4. Login con tu email y contrase�a maestra

### M�vil (Android/iOS)
1. Instala la **app oficial de Bitwarden**
2. En configuraci�n, cambia el servidor a `https://tu-dominio.com`
3. Login normal

---

## Organizaci�n inteligente de contrase�as

Un gestor de contrase�as es tan bueno como la organizaci�n que le des. Aqu� va mi sistema:

### Carpetas recomendadas
```
?? Banca
   ??? Cuenta principal
   ??? Tarjeta de cr�dito
   ??? Inversiones

?? Trabajo
   ??? Email corporativo
   ??? Herramientas internas
   ??? VPN del trabajo

?? Personal
   ??? Redes sociales
   ??? Streaming
   ??? Tienda online

?? Servidores
   ??? SSH - homelab
   ??? Admin - router
   ??? API keys
```

### Campos personalizados (�til para servidores)
Para cada servicio, a�ade:
- **URL del panel de administraci�n**
- **IP del servidor**
- **Puerto SSH**
- **Notas** (comandos �tiles, instrucciones de recuperaci�n)

---

## Caracter�sticas avanzadas

| Caracter�stica | Para qu� sirve |
|---|---|
| **Autenticaci�n en 2 pasos (2FA)** | Protege el acceso aunque alguien robe tu contrase�a maestra |
| **Autofill** | Rellena contrase�as autom�ticamente en webs y apps |
| **Generador de contrase�as** | Crea contrase�as aleatorias de 32+ caracteres |
| **Send (env�o seguro)** | Comparte contrase�as o notas de forma cifrada temporal |
| **Favoritos** | Marca los servicios que m�s usas para acceso r�pido |
| **Auditor�a de contrase�as** | Detecta contrase�as d�biles, reutilizadas o comprometidas |

---

## Seguridad: lo que NUNCA debes hacer

- ? Nunca uses la misma contrase�a en dos sitios
- ? Nunca guardes contrase�as en el navegador (Chrome/Safari)
- ? Nunca compartas la contrase�a maestra
- ? Nunca apuntes contrase�as en papel o notas del m�vil sin cifrar
- ? Usa una **contrase�a maestra larga** (4+ palabras aleatorias)
- ? Activa **2FA** en todos los servicios importantes
- ? Haz **backup** de la carpeta de datos de Vaultwarden

---

## Backup autom�tico de Vaultwarden

A�ade esta tarea programada para no perder nunca tus contrase�as:

```bash
#!/bin/bash
FECHA=$(date +%Y-%m-%d)
BACKUP_DIR="/mnt/backups/vaultwarden"

docker cp vaultwarden:/data/ "$BACKUP_DIR/data-$FECHA"
tar -czf "$BACKUP_DIR/vaultwarden-$FECHA.tar.gz" -C "$BACKUP_DIR" "data-$FECHA"
rm -rf "$BACKUP_DIR/data-$FECHA"

# Mantener solo los �ltimos 30 backups
find "$BACKUP_DIR" -name "vaultwarden-*.tar.gz" -mtime +30 -delete
echo "Backup de Vaultwarden creado: vaultwarden-$FECHA.tar.gz"
```

Programa con cron: `0 1 * * * /ruta/al/script/backup-vaultwarden.sh`

---

*�Quieres que te prepare un flujo completo de Vaultwarden + Authelia para proteger todos tus servicios self-hosted con Single Sign-On?* ??