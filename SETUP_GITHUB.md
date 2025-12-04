# 🚀 Guía para Subir a GitHub

## Paso 1: Crear repositorio en GitHub

1. Ve a [github.com/new](https://github.com/new)
2. Nombre del repositorio: `prompt-library`
3. Descripción: "Biblioteca personal de prompts de IA"
4. Selecciona **Public** (para usar GitHub Pages gratis) o **Private**
5. **NO** marques "Initialize with README" (ya lo tenemos)
6. Haz clic en "Create repository"

## Paso 2: Inicializar Git y subir el código

Abre la terminal en la carpeta del proyecto y ejecuta:

```bash
# Inicializar repositorio Git
git init

# Añadir todos los archivos
git add .

# Crear primer commit
git commit -m "🎉 Initial commit: Prompt Library con estilo IA Ordinaria"

# Conectar con GitHub (reemplaza TU_USUARIO con tu nombre de usuario)
git remote add origin https://github.com/TU_USUARIO/prompt-library.git

# Cambiar a rama main
git branch -M main

# Subir el código
git push -u origin main
```

## Paso 3: Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings** (⚙️)
3. En el menú lateral, haz clic en **Pages**
4. En "Build and deployment":
   - Source: **GitHub Actions**
5. El workflow ya está configurado, se desplegará automáticamente

## Paso 4: Acceder a tu app

Después de unos minutos, tu app estará disponible en:

```
https://TU_USUARIO.github.io/prompt-library/
```

## 🔄 Sincronización de Datos

### Para guardar tus prompts en GitHub:

1. En la app, haz clic en **"Exportar JSON"**
2. Guarda el archivo `prompt-library-FECHA.json`
3. Crea una carpeta `data/` en tu repo
4. Sube el archivo JSON a esa carpeta
5. Haz commit y push

### Para recuperar tus prompts:

1. Descarga el archivo JSON de tu repo
2. En la app, haz clic en **"Importar JSON"**
3. Selecciona el archivo

## 📱 Acceso desde cualquier dispositivo

Una vez desplegado en GitHub Pages:

1. Abre la URL en cualquier navegador
2. Los datos se guardan en el localStorage del navegador
3. Para sincronizar, usa Export/Import con tu archivo JSON en el repo

---

¡Listo! Ya tienes tu biblioteca de prompts accesible desde cualquier dispositivo 🎉

