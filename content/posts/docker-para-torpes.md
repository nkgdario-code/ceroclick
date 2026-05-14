---
title: "Docker para torpes: qué es, para qué sirve y cómo instalarlo"
description: "Docker te permite instalar cualquier programa en un 'contenedor' aislado, sin ensuciar tu sistema. Aprende qué es, para qué sirve y cómo dar tus primeros pasos."
date: 2026-05-22
draft: false
tags: ["docker", "contenedores", "virtualización", "self-hosting", "tutorial", "principiante"]
---


Si has oído hablar de Docker pero no sabes exactamente qué es ni para qué sirve, este artículo es para ti. Lo voy a explicar **sin tecnicismos innecesarios**.

<!--more-->


---

## La analogía del contenedor de mercancía

Imagina que quieres enviar una tarta a un amigo. Tienes dos opciones:

1. **Sin contenedor**: envías los ingredientes sueltos. Se mezclan, se rompen, se pierden por el camino.
2. **Con contenedor**: metes la tarta en una caja hermética con todo lo necesario. Llega intacta.

**Docker hace exactamente esto con el software.** Empaqueta una aplicación con todo lo que necesita (librerías, configuración, sistema operativo mínimo) en un **contenedor** que funciona igual en cualquier ordenador.

---

## ¿Por qué Docker es tan popular?

### Antes de Docker
Instalar un programa era un suplicio:
- "Necesitas Python 3.8"
- "Pero yo tengo la 3.9"
- "Pues no funciona"
- "Instala esta librería"
- "¿Cuál versión?"
- "La de hace 3 años"
- 🤦

### Con Docker
```bash
docker run -d -p 8080:80 nginx
```
**Una línea.** Acabas de levantar un servidor web nginx en tu máquina. Sin instalar nada. Sin conflictos. Sin ensuciar tu sistema.

---

## Conceptos clave (solo 4, prometido)

| Concepto | Explicación sencilla |
|----------|---------------------|
| **Imagen** | La "receta" o plantilla. Un archivo que dice cómo construir el contenedor. |
| **Contenedor** | La "tarta" hecha con esa receta. Una instancia en ejecución de una imagen. |
| **Dockerfile** | El archivo de texto donde escribes la receta. |
| **Docker Hub** | Un repositorio donde la gente comparte imágenes ya hechas (como una App Store para Docker). |

---

## Instalación rápida

### En Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
# Añade tu usuario al grupo docker para no usar sudo siempre
sudo usermod -aG docker $USER
```

### En Windows/Mac
Descarga **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** desde la web oficial. Se instala como cualquier programa.

---

## Tus primeros comandos

```bash
# Buscar una imagen en Docker Hub
docker search nginx

# Descargar una imagen
docker pull nginx

# Ver las imágenes que tienes
docker images

# Ejecutar un contenedor
docker run -d --name mi-web -p 8080:80 nginx

# Ver contenedores en ejecución
docker ps

# Parar un contenedor
docker stop mi-web

# Eliminar un contenedor
docker rm mi-web
```

---

## Ejemplo práctico: levantar una web completa

Crea un archivo `docker-compose.yml`:

```yaml
version: '3'
services:
  web:
    image: nginx
    ports:
      - "8080:80"
    volumes:
      - ./mi-web:/usr/share/nginx/html
```

Y una carpeta `mi-web` con un archivo `index.html`:

```html
<!DOCTYPE html>
<html>
<head><title>Mi Docker</title></head>
<body><h1>¡Hola desde Docker! 🐳</h1></body>
</html>
```

Ahora ejecuta:

```bash
docker-compose up -d
```

Abre `http://localhost:8080` en tu navegador. **Ya tienes una web servida con Docker.**

---

## ¿Qué más puedes hacer?

Con Docker puedes instalar **prácticamente cualquier servicio**:

- 📝 **Nextcloud** — tu propio Google Drive
- 📧 **Mailu** — tu propio servidor de email
- 📊 **Grafana** — monitorización avanzada
- 🎵 **Jellyfin** — tu propio Netflix personal
- 💬 **Rocket.Chat** — tu propio Slack
- 🔐 **Vaultwarden** — tu propio gestor de contraseñas (Bitwarden)

Todo con un simple `docker-compose up -d`.

---

## Docker en tu homelab

Si tienes un servidor en casa, Docker cambia las reglas del juego:
- Puedes probar **cualquier software** sin arriesgar tu sistema
- Si algo se rompe, lo borras y vuelves a empezar en segundos
- Puedes tener **50 servicios** funcionando sin que se pisen entre ellos

**Es la base de cualquier homelab moderno.**

---

*¿Quieres que te monte una guía de Docker Compose para tu homelab con los servicios más útiles?* Solo tienes que pedirla.