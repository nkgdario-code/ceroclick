---
title: "Automatiza informes semanales con Python y ChatGPT: tutorial paso a paso"
description: "Aprende a generar informes automáticos cada semana combinando scripts de Python con la API de ChatGPT. Olvídate de copiar y pegar datos manualmente."
date: 2026-05-14
draft: false
tags: ["python", "automatización", "ChatGPT", "IA", "informes", "productividad"]
---


Los informes semanales son ese tipo de tarea que nadie quiere hacer. Recopilar datos, darles formato, escribir el texto, repetir. Cada semana. Es el candidato perfecto para automatizarlo.

<!--more-->


En este tutorial te enseño a crear un sistema que:

1. Recoge datos de tus fuentes (bases de datos, hojas de cálculo, APIs)
2. Los analiza y resume
3. Escribe un informe en lenguaje natural con ChatGPT
4. Lo envía por email o lo guarda donde quieras

Todo con **Python y menos de 100 líneas de código**.

---

## Lo que necesitas

- **Python 3.8+** instalado en tu máquina
- **Una API key de OpenAI** ([consíguela aquí](https://platform.openai.com/api-keys))
- **Un correo SMTP** (Gmail, Outlook o cualquier proveedor)

Instala las dependencias:

```bash
pip install openai pandas python-dotenv
```

---

## Paso 1: Estructura del proyecto

Crea una carpeta para el proyecto:

```
informes-automaticos/
├── .env              # Tus claves API (¡no compartirlas!)
├── informe.py        # El script principal
├── plantilla.md      # Plantilla del informe
└── datos/            # Donde guardamos los datos históricos
```

El `.env` tendrá esto:

```env
OPENAI_API_KEY=sk-tu-api-key-aqui
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-de-aplicacion
DESTINO_EMAIL=jefe@empresa.com
```

---

## Paso 2: Recoger los datos

Vamos a simular datos de ventas para el ejemplo. En tu caso, esto puede ser una consulta SQL, un archivo CSV o una API.

```python
import pandas as pd
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

load_dotenv()

def obtener_datos_semana():
    """Simula datos de ventas de la última semana.
    Reemplaza esto con tu fuente real de datos."""
    
    # Esto podría ser: pd.read_sql("SELECT ...", conexion)
    # O: pd.read_csv("datos/ventas.csv")
    
    data = {
        "fecha": [datetime.now() - timedelta(days=i) for i in range(7)],
        "ventas": [1200, 1450, 980, 2100, 1650, 1900, 1350],
        "pedidos": [15, 18, 12, 25, 20, 22, 17],
        "clientes_nuevos": [3, 5, 2, 7, 4, 6, 3]
    }
    return pd.DataFrame(data)
```

Este script devuelve un DataFrame con la última semana. **Sustituye la parte de los datos** por tu conexión real (base de datos, Google Sheets, etc.).

---

## Paso 3: Calcular métricas clave

Antes de pedirle a ChatGPT que escriba, calculamos lo importante:

```python
def calcular_metricas(df):
    """Extrae métricas relevantes de los datos."""
    total_ventas = df["ventas"].sum()
    media_ventas = df["ventas"].mean()
    total_pedidos = df["pedidos"].sum()
    total_clientes = df["clientes_nuevos"].sum()
    
    # Comparación con semana anterior (simulada)
    semana_anterior = 9500  # Este valor vendría de un histórico real
    variacion = ((total_ventas - semana_anterior) / semana_anterior) * 100
    
    # Mejor y peor día
    mejor_dia = df.loc[df["ventas"].idxmax()]
    peor_dia = df.loc[df["ventas"].idxmin()]
    
    return {
        "total_ventas": total_ventas,
        "media_ventas": round(media_ventas, 2),
        "total_pedidos": total_pedidos,
        "total_clientes": total_clientes,
        "variacion": round(variacion, 1),
        "mejor_dia": mejor_dia["fecha"].strftime("%A"),
        "mejor_dia_ventas": mejor_dia["ventas"],
        "peor_dia": peor_dia["fecha"].strftime("%A"),
        "peor_dia_ventas": peor_dia["ventas"],
    }
```

---

## Paso 4: Generar el informe con ChatGPT

Aquí viene la magia. Usamos la API de OpenAI para convertir las métricas en un texto natural:

```python
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generar_informe(metricas):
    """Usa ChatGPT para redactar el informe a partir de las métricas."""
    
    prompt = f"""
Eres un analista de negocio. Redacta un informe semanal profesional en español
a partir de estas métricas de la última semana:

- Ventas totales: {metricas['total_ventas']}€
- Media diaria: {metricas['media_ventas']}€
- Variación respecto a la semana anterior: {metricas['variacion']}%
- Pedidos totales: {metricas['total_pedidos']}
- Clientes nuevos: {metricas['total_clientes']}
- Mejor día: {metricas['mejor_dia']} ({metricas['mejor_dia_ventas']}€)
- Peor día: {metricas['peor_dia']} ({metricas['peor_dia_ventas']}€)

Estructura:
1. Resumen ejecutivo (2-3 líneas)
2. Análisis de rendimiento (destaca tendencias)
3. Recomendaciones para la próxima semana

No uses markdown ni negritas. Lenguaje directo y profesional.
"""
    
    respuesta = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=500
    )
    
    return respuesta.choices[0].message.content
```

> **Nota sobre costes:** Con `gpt-4o-mini`, cada informe cuesta menos de 1 céntimo de euro. Para 52 informes al año, hablamos de unos 50 céntimos.

---

## Paso 5: Enviar por email el informe

Ninguna automatización está completa si no llega sola a tu bandeja de entrada:

```python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def enviar_email(informe, metricas):
    """Envía el informe por email."""
    
    msg = MIMEMultipart()
    msg["Subject"] = f"📊 Informe Semanal - Semana {datetime.now().isocalendar()[1]}"
    msg["From"] = os.getenv("SMTP_USER")
    msg["To"] = os.getenv("DESTINO_EMAIL")
    
    cuerpo = f"""
<html><body>
<h2>Informe Semanal de Ventas</h2>
<p><strong>Período:</strong> Últimos 7 días</p>

<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
<tr><td>Ventas totales</td><td><strong>{metricas['total_ventas']}€</strong></td></tr>
<tr><td>Media diaria</td><td>{metricas['media_ventas']}€</td></tr>
<tr><td>Variación semanal</td><td>{metricas['variacion']}%</td></tr>
<tr><td>Pedidos</td><td>{metricas['total_pedidos']}</td></tr>
<tr><td>Clientes nuevos</td><td>{metricas['total_clientes']}</td></tr>
</table>

<h3>Resumen</h3>
<p>{informe}</p>
</body></html>
"""
    
    msg.attach(MIMEText(cuerpo, "html"))
    
    with smtplib.SMTP(os.getenv("SMTP_SERVER"), int(os.getenv("SMTP_PORT"))) as server:
        server.starttls()
        server.login(os.getenv("SMTP_USER"), os.getenv("SMTP_PASS"))
        server.send_message(msg)
    
    print("✅ Informe enviado correctamente")
```

---

## Paso 6: Juntarlo todo

El script principal queda limpio y modular:

```python
def main():
    print("📥 Obteniendo datos...")
    datos = obtener_datos_semana()
    
    print("📊 Calculando métricas...")
    metricas = calcular_metricas(datos)
    
    print("🤖 Generando informe con IA...")
    informe = generar_informe(metricas)
    
    print("📤 Enviando por email...")
    enviar_email(informe, metricas)
    
    print("✅ ¡Informe semanal completado!")

if __name__ == "__main__":
    main()
```

---

## Paso 7: Automatizar la ejecución

Para que el informe se envíe solo cada semana, programa el script:

**En Linux/Mac (crontab):**
```bash
crontab -e
# Se ejecuta cada lunes a las 8:00
0 8 * * 1 cd /ruta/informes-automaticos && python informe.py
```

**En Windows (Tareas programadas):**
1. Abre "Programador de tareas"
2. Crea una tarea básica
3. Disparador: semanal, lunes a las 8:00
4. Acción: iniciar programa → `python.exe`
5. Argumentos: `C:\ruta\informes-automaticos\informe.py`

---

## Ideas para extenderlo

| Mejora | Cómo hacerlo |
|--------|-------------|
| Más fuentes de datos | Conecta Google Sheets, Airtable, o una API REST |
| Gráficos | Añade `matplotlib` para generar gráficos y adjuntarlos |
| Dashboard web | Genera un HTML con los datos y súbelo a Netlify o GitHub Pages |
| Varios destinatarios | Envía el informe a CC con diferentes roles |
| Guardar histórico | Almacena los datos semanales en SQLite para análisis a largo plazo |
| Slack/Telegram | Sustituye el email por un mensaje a tu canal de equipo |

---

## Resumen

En menos de 100 líneas de Python has creado:

- ✅ Un sistema que recopila datos automáticamente
- ✅ Un generador de informes con lenguaje natural usando ChatGPT
- ✅ Un envío automático por email
- ✅ Una tarea programada que se ejecuta sola cada semana

**Lo que antes te llevaba 1 hora cada lunes ahora son 0 segundos.** Y el informe es más consistente porque no olvidas incluir nada.

---

*¿Tienes algún proceso semanal que te gustaría automatizar? Cuéntamelo y te ayudo a diseñar el script.*