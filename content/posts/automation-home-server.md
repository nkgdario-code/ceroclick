---
title: "Automatiza tu homelab: 10 tareas que puedes dejar que tu servidor haga solo"
description: "Si tienes un servidor en casa (o est�s pensando en montar uno), estas 10 automatizaciones te van a cambiar la vida. Backups, limpieza, monitorizaci�n y m�s."
date: 2026-05-18
draft: false
tags: ["homelab", "servidor", "automatizaci�n", "self-hosting", "scripts", "Docker"]
---

# Automatiza tu homelab: 10 tareas que tu servidor puede hacer solo

Tener un homelab mola. Mantenerlo actualizado, hacer backups, limpiar logs, monitorizar que todo funciona... ya no mola tanto. Menos cuando puedes **automatizar el 80% de esas tareas** y olvidarte.

Aqu� van 10 automatizaciones que tengo funcionando en mi servidor y que puedes copiar directamente.

---

## 1. Backups autom�ticos con BorgBackup

Borg es la herramienta de backup m�s eficiente que existe. Comprime y **deduplica** los datos, as� solo ocupa una fracci�n del espacio original.

### Script:
```bash
#!/bin/bash
# Backup autom�tico de contenedores y datos importantes
borg create --stats --compression lz4 \
  /mnt/backups::$(date +%Y-%m-%d_%H-%M) \
  /home/usuario/datos \
  /var/lib/docker/volumes

# Limpiar backups de m�s de 30 d�as
borg prune /mnt/backups --keep-daily=7 --keep-weekly=4 --keep-monthly=6
```

### Programaci�n con cron:
```
0 2 * * * /home/usuario/scripts/backup.sh
```

Tu servidor har� un backup **cada noche a las 2 de la madrugada** y borrar� los que tengan m�s de 30 d�as. Sin que toques nada.

---

## 2. Actualizaci�n autom�tica de contenedores Docker

�Tienes Docker en tu servidor? [Watchtower](https://containrrr.dev/watchtower/) se encarga de actualizar autom�ticamente todos tus contenedores cuando salen nuevas versiones.

```bash
docker run -d \
  --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower \
  --cleanup \
  --schedule "0 0 4 * * *"
```

**Una vez al d�a a las 4 de la ma�ana**, Watchtower revisa si hay actualizaciones de tus im�genes Docker, las descarga y reinicia los contenedores. As� siempre tienes todo actualizado sin esfuerzo.

---

## 3. Monitorizaci�n con alertas por Telegram

Montar un sistema de monitorizaci�n no tiene que ser complicado. Con un script simple puedes vigilar que tus servicios est�n online y recibir una alerta si algo falla.

```bash
#!/bin/bash
SERVICIOS=("https://miniflux.tudominio.com" "https://nextcloud.tudominio.com" "https://grafana.tudominio.com")
BOT_TOKEN="tu_token_de_telegram"
CHAT_ID="tu_chat_id"

for servicio in "${SERVICIOS[@]}"; do
  STATUS=$(curl -o /dev/null -s -w "%{http_code}" "$servicio")
  if [ "$STATUS" != "200" ]; then
    curl -s "https://api.telegram.org/bot$BOT_TOKEN/sendMessage" \
      -d "chat_id=$CHAT_ID&text=?? $servicio est� CA�DO (HTTP $STATUS)" > /dev/null
  fi
done
```

Programa esto cada 5 minutos en cron y sabr�s al instante si algo se cae.

---

## 4. Limpieza autom�tica de logs y archivos temporales

Con el tiempo, los logs y archivos temporales llenan tu disco. Esto lo limpia todo de golpe:

```bash
#!/bin/bash
# Limpiar logs de m�s de 30 d�as
find /var/log -name "*.log" -mtime +30 -delete
# Limpiar cach�s de apt
apt-get clean
# Limpiar archivos temporales
find /tmp -type f -atime +7 -delete
# Limpiar Docker (im�genes, contenedores parados, vol�menes sin usar)
docker system prune -af --volumes
```

Programa esto **cada semana** y tu servidor se mantendr� ligero.

---

## 5. Renombrar series y pel�culas autom�ticamente con Sonarr/Radarr

Si usas Plex o Jellyfin, [Sonarr](https://sonarr.tv/) y [Radarr](https://radarr.video/) son imprescindibles:

- **Sonarr**: busca y descarga autom�ticamente tus series favoritas
- **Radarr**: lo mismo para pel�culas
- Ambos renombran y organizan los archivos autom�ticamente
- Se integran con Plex/Jellyfin, qBittorrent y Transmission

Una vez configurados, **nunca m�s tienes que buscar un episodio manualmente**.

---

## 6. Auto-actualizar el servidor Linux

```bash
#!/bin/bash
# Actualizaci�n autom�tica de paquetes (sin reiniciar)
apt-get update && apt-get upgrade -y
# Limpiar paquetes obsoletos
apt-get autoremove -y
apt-get autoclean
```

```
# Programar para los domingos a las 5 de la ma�ana
0 5 * * 0 /home/usuario/scripts/update.sh
```

> ?? **Cuidado:** para servidores de producci�n, es mejor que los reinicios sean **manuales**. Para un homelab, esto funciona perfectamente.

---

## 7. Copia de seguridad de tu base de datos (si usas PostgreSQL, MySQL, etc.)

```bash
#!/bin/bash
FECHA=$(date +%Y-%m-%d)

# PostgreSQL
pg_dump -U usuario nombre_db | gzip > /mnt/backups/db-$FEZA.sql.gz

# MySQL (alternativa)
# mysqldump -u usuario -pcontrase�a nombre_db | gzip > /mnt/backups/db-$FECHA.sql.gz

echo "Backup de base de datos creado: db-$FECHA.sql.gz"
```

Programa esto **cada d�a** despu�s de tu backup principal.

---

## 8. Sincronizaci�n con la nube

Si quieres tener una copia en la nube adem�s de tu almacenamiento local:

```bash
#!/bin/bash
# Sincronizar con Google Drive usando rclone
rclone sync /mnt/backups gdrive:/backups --progress

# Sincronizar con otros proveedores
# rclone sync /mnt/backups s3:mi-bucket/backups
# rclone sync /mnt/backups dropbox:/backups
```

Instala [rclone](https://rclone.org/), configura tu cuenta una vez, y despu�s solo programa el sync.

---

## 9. Generar un informe semanal de tu servidor

�Quieres saber c�mo est� tu servidor sin tener que conectarte? Este script genera un informe y te lo env�a:

```bash
#!/bin/bash
INFORME="Informe del servidor - $(date +%Y-%m-%d)

?? Disco: $(df -h / | tail -1 | awk '{print $5}') usado
?? RAM: $(free -h | grep Mem | awk '{print $3"/"$2}')
?? Carga: $(uptime | awk -F'load average:' '{print $2}')
??? Temperatura CPU: $(sensors 2>/dev/null | grep 'Core 0' | awk '{print $3}' || echo 'N/A')
?? Actualizaciones pendientes: $(apt list --upgradable 2>/dev/null | grep -c upgradable)
"

echo "$INFORME" | mail -s "Informe semanal del servidor" tu@email.com
```

---

## 10. Apagado autom�tico por inactividad

Si tu servidor no se usa por la noche, �por qu� tenerlo encendido?

```bash
# Apagar a las 3 de la ma�ana si nadie est� conectado por SSH
0 3 * * * who | grep -q "." || /sbin/shutdown -h now
```

O si quieres algo m�s inteligente, usa [Wake-on-LAN](https://www.howtogeek.com/221873/how-to-wake-on-lan/) para encenderlo remotamente cuando lo necesites.

---

## Resumen

| Automatizaci�n | Herramienta | Frecuencia |
|---|---|---|
| Backups | BorgBackup + cron | Diario |
| Actualizar Docker | Watchtower | Diario |
| Monitorizar servicios | Script + Telegram | Cada 5 min |
| Limpiar logs | Script + cron | Semanal |
| Series/pel�culas | Sonarr + Radarr | Continuo |
| Actualizar sistema | apt + cron | Semanal |
| Backup de BBDD | pg_dump/mysqldump | Diario |
| Sincronizar nube | rclone | Diario |
| Informe semanal | Script + email | Semanal |
| Ahorro energ�a | Cron + shutdown | Diario |

**Configura estas 10 cosas y tu homelab se mantendr� solo.** Solo tendr�s que preocuparte de disfrutarlo. ??

---

*�Tienes un homelab? �Qu� automatizaciones ya tienes montadas? Cu�ntamelo en los comentarios.*