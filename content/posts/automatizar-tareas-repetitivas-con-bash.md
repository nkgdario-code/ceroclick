---
title: "Cómo automatizar tareas repetitivas con Bash (guía para no programadores)"
description: "Aprende a automatizar las tareas más aburras de tu día a día con scripts de Bash, sin necesidad de ser programador. Desde renombrar archivos hasta hacer backups automáticos."
date: 2026-05-15
draft: false
tags: ["bash", "automatización", "productividad", "linux", "scripts", "terminal"]
---


¿Cada cuánto haces la misma tarea una y otra vez? Renombrar archivos, mover documentos, hacer copias de seguridad... Todo eso se puede hacer **una sola vez** y luego olvidarte para siempre.

<!--more-->


En esta guía te enseño desde cero cómo crear tus primeros scripts de automatización con Bash, el lenguaje que ya tienes instalado en tu ordenador (si usas Mac o Linux) o puedes instalar gratis en Windows.

---

## ¿Qué es Bash y por qué deberías usarlo?

Bash es un **intérprete de comandos**. Es como un asistente al que le escribes instrucciones y las ejecuta. Lo que hace especial a Bash frente a otros lenguajes de programación es que:

- Ya viene **preinstalado** en casi todos los sistemas
- No necesitas instalar nada raro
- Es perfecto para **tareas del sistema operativo** (archivos, carpetas, copias de seguridad)
- Un script de 5 líneas puede ahorrarte **horas cada semana**

## Tu primer script: renombrar 100 archivos en 1 segundo

Imagina que tienes una carpeta con 100 fotos llamadas `IMG_0001.jpg`, `IMG_0002.jpg`... y quieres renombrarlas todas a `foto-vacaciones-001.jpg`, etc.

```bash
#!/bin/bash
contador=1
for archivo in *.jpg; do
  mv "$archivo" "foto-vacaciones-$(printf '%03d' $contador).jpg"
  ((contador++))
done
echo "¡Listo! Renombrados $contador archivos."
```

**¿Cómo lo usas?**
1. Abre un archivo de texto y pega el código
2. Guárdalo como `renombrar.sh`
3. Abre la terminal y navega a la carpeta donde están tus fotos
4. Ejecuta: `bash renombrar.sh`

Eso es todo. En menos de 2 segundos tendrás los 100 archivos renombrados.

## Automatizar backups diarios

Otra tarea que nadie quiere hacer pero todos necesitan: **hacer copias de seguridad**. Con este script puedes programar un backup automático que se ejecute cada día:

```bash
#!/bin/bash
FECHA=$(date +%Y-%m-%d)
ORIGEN="/home/usuario/documentos"
DESTINO="/home/usuario/backups/documentos-$FECHA.tar.gz"

tar -czf "$DESTINO" "$ORIGEN"
echo "Backup creado: $DESTINO"
```

Para que se ejecute **automáticamente cada día a las 3 de la mañana**, añade esta línea en tu crontab:

```bash
crontab -e
# Añade esta línea:
0 3 * * * /home/usuario/scripts/backup.sh
```

A partir de ese momento, tu ordenador hará un backup cada noche sin que tengas que hacer nada.

## Automatizar la descarga de archivos de internet

Si cada día descargas el mismo tipo de archivo (un informe, un CSV, un podcast), puedes automatizarlo con `curl` o `wget`:

```bash
#!/bin/bash
FECHA=$(date +%Y-%m-%d)
curl -o "informe-$FECHA.pdf" "https://ejemplo.com/informe-diario.pdf"
echo "Informe descargado: informe-$FECHA.pdf"
```

## Consejos para empezar

1. **Empieza pequeño**: automatiza UNA tarea que odies hacer
2. **Prueba antes en una copia**: nunca ejecutes un script destructivo sin probar primero
3. **Añade `echo` a todo**: para ver qué está haciendo tu script
4. **Google es tu amigo**: si necesitas hacer algo, busca "bash how to [tu tarea]"

## ¿Qué automatizar primero?

- ✅ Renombrar archivos en masa
- ✅ Mover documentos de una carpeta a otra
- ✅ Hacer copias de seguridad
- ✅ Descargar archivos de internet
- ✅ Limpiar archivos temporales
- ✅ Enviar notificaciones cuando algo termina

La clave es: **si lo haces más de 3 veces, merece la pena automatizarlo.**

---

*¿Quieres que te prepare un script para una tarea específica? Déjamelo en los comentarios.*