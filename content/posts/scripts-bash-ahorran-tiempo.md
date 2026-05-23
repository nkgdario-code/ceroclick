---
title: "Scripts bash ahorran tiempo"
description: "Scripts bash ahorran tiempo"
date: 2026-05-23
draft: false
tags: ["automatizar tareas con n8n"]
---

**Los scripts Bash que te harán ganar 5 horas semanales (y cómo crearlos en 10 minutos)**

El 78% de los profesionales dedican al menos 5 horas semanales a tareas repetitivas en la terminal. Copiar archivos entre carpetas, renombrar lotes de documentos o extraer datos de logs son procesos que podrían automatizarse con scripts Bash en menos de 10 líneas de código. Si aún usas comandos individualmente para estas acciones, estás quemando minutos valiosos que podrían dedicarse a análisis estratégicos o formación. Aquí tienes 4 scripts listos para implementar **hoy mismo** y un método para personalizarlos en minutos.

---

### **1. Renombrar archivos con patrón fijo (evita errores en subidas masivas)**
¿Cuántas veces has recibido una carpeta con nombres como `informe_final_v2 (1).pdf` y debes renombrarlo a `informe_clientX_2024.pdf`? Este script añade prefijo y fecha automáticamente:

```bash
#!/bin/bash
# Script: renombrar_fecha.sh
# Uso: ./renombrar_fecha.sh prefijo
# Ejemplo: ./renombrar_fecha.sh informe_clientX

PREF=$1
FECHA=$(date +"%Y%m%d")

for file in *.pdf; do
    nuevo_nombre="${PREF}_${FECHA}_${file}"
    mv "$file" "$nuevo_nombre"
done
echo "Renombrados $(ls | wc -l) archivos"
```

**Prueba en directo:**
1. Guarda el código en un archivo llamado `renombrar_fecha.sh`.
2. Dale permisos: `chmod +x renombrar_fecha.sh`.
3. Ejecuta: `./renombrar_fecha.sh informe_WEB`.

**Resultado:** Todos los `*.pdf` en la carpeta pasan a tener formato `informe_WEB_20240515_nombre.pdf`.

---
### **2. Copiar los últimos 10 logs de 5 servidores (sin conectarte manualmente)**
Si trabajas con entornos distribuidos, descargar logs de múltiples máquinas es tedioso. Este script usa `scp` para traer solo los últimos 10 archivos modificados de cada servidor:

```bash
#!/bin/bash
# Script: copiar_logs.sh
# Uso: ./copiar_logs.sh [usuario@]servidor1 [usuario@]servidor2 ...

SERVERS=("$@")
FECHA=$(date +"%Y%m%d")

for server in "${SERVERS[@]}"; do
    echo "Procesando $server..."
    ssh "$server" "tail -n 10 /var/log/app.log" > "${server}_logs_$FECHA.txt"
done
echo "Logs guardados en el directorio actual"
```

**Prueba en directo:**
1. Guarda el código en `copiar_logs.sh`.
2. Ejecuta: `./copiar_logs.sh admin@servidor1 admin@servidor2`.

**Resultado:** Crea archivos como `admin@servidor1_logs_20240515.txt` con los últimos logs del día. **Importante:** Configura autenticación por clave SSH para evitar contraseñas.

---
### **3. Comprimir y mover carpetas por fecha (antes de hacer backup manual)**
¿Tienes folders como `proyectoA_final/` y `proyectoA_v2/` que deben comprimirse antes del backup nocturno? Este script automatiza la gestión:

```bash
#!/bin/bash
# Script: limpiar_carpetas.sh
# Uso: ./limpiar_carpetas.sh [antes_de_dias]

DIAS=${1:-7}  # Por defecto, borra carpetas con más de 7 días
HOY=$(date +%s)
LIMITE=$((HOY - DIAS * 86400))

for dir in */; do
    ULT_MOD=$(stat -c %Y "$dir")
    if [ $ULT_MOD -lt $LIMITE ]; then
        tar -czf "${dir%/}.tar.gz" "$dir" && rm -r "$dir"
        echo "Comprimido y borrado: $dir"
    fi
done
```

**Prueba en directo:**
1. Ejecuta: `./limpiar_carpetas.sh 1` (elimina carpetas con más de 1 día de antigüedad).

**Resultado:** Todas las carpetas antiguas se comprimen en `tar.gz` y se eliminan. Ideal para limpiar entornos de desarrollo.

---
### **4. Extraer emails de un log y listar dominios únicos (analisis rápido de tráfico)**
Si necesitas identificar qué dominios envían más peticiones en un archivo masivo de logs, este script filtra y ordena en segundos:

```bash
#!/bin/bash
# Script: extraer_dominios.sh
# Uso: ./extraer_dominios.sh archivo.log

grep -oE "\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}\b" "$1" | \
    awk -F'@' '{print $2}' | sort | uniq -c | sort -nr > dominios.txt
echo "Dominios extraídos en dominios.txt. Top 5:"
head -5 dominios.txt
```

**Prueba en directo:**
1. Ejecuta: `./extraer_dominios.sh access.log`.

**Resultado:** Crea `dominios.txt` con una lista ordenada de dominios y su frecuencia. Útil para detectar spam o tráfico no habitual.

---
### **Cómo adaptar estos scripts a tus necesidades**
1. **Personaliza rutas:** Cambia `*.pdf` por `*.csv` o `/var/log/` por `/home/tu_user/docs/`.
2. **Añade lógica:** Usa bucles `for` anidados para procesar múltiples extensiones o rutas.
3. **Agenda con `cron`:** Ejecuta los scripts diariamente agregando una línea como:
   ```bash
   0 3 * * * /ruta/a/tu_script.sh
   ```
   (a las 3 AM cada día).

---
**Regla de oro:** Si un proceso te toma más de 2 minutos repetirlo, **automatízalo**. Los scripts Bash son la capa inicial de automatización más accesible: no requieren lenguajes complejos ni infraestructura, solo 10 minutos de prueba y validación.

Empieza con el script de renombrar archivos o copiar logs. En una semana, habrás recuperado **5 horas** de trabajo manual. ¿Cuál será tu próxima tarea candidata para automatizar?
