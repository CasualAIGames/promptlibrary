# 🎨 Prompt Library

<p align="center">
  <strong>Tu biblioteca personal de prompts de IA con estilo IA Ordinaria</strong>
</p>

<p align="center">
  Organiza, gestiona y sincroniza todos tus prompts de imagen, video, código y chat en un solo lugar.
</p>

---

## ✨ Características

- **📁 Gestión de Proyectos**: Organiza tus prompts por proyectos (cortometrajes, campañas, etc.)
- **🖼️ Imágenes de Referencia**: Añade imágenes del resultado para identificar visualmente cada prompt
- **🏷️ Sistema de Tags**: Etiqueta y categoriza tus prompts
- **🔍 Búsqueda y Filtros**: Encuentra rápidamente lo que buscas
- **📤 Exportar/Importar JSON**: Sincroniza tus datos entre dispositivos
- **🌙 Diseño Dark Mode**: Estética inspirada en IA Ordinaria con verde lima ácido

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- npm o pnpm

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/prompt-library.git
cd prompt-library

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build para Producción

```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/`

## 📱 Sincronización entre Dispositivos

La aplicación guarda los datos en el `localStorage` del navegador. Para sincronizar entre dispositivos:

### Método 1: Exportar/Importar JSON

1. **Exportar**: Haz clic en "Exportar JSON" en el header
2. **Guardar**: Sube el archivo JSON a tu repositorio de GitHub (carpeta `data/`)
3. **Importar**: En otro dispositivo, descarga el JSON y usa "Importar JSON"

### Método 2: GitHub como Backend (Avanzado)

Puedes configurar un workflow de GitHub Actions para:
1. Crear un archivo `data/library.json` en tu repo
2. Usar la API de GitHub para leer/escribir el archivo
3. Sincronizar automáticamente

## 🎨 Design System

El proyecto usa un design system inspirado en "IA Ordinaria":

| Color | Hex | Uso |
|-------|-----|-----|
| Dark Background | `#02040a` | Fondo principal |
| Lime Accent | `#a3e635` | CTAs, highlights |
| Emerald Soft | `#10b981` | Gradientes secundarios |
| Text Primary | `#ffffff` | Títulos |
| Text Secondary | `#94a3b8` | Párrafos |

### Tipografía

- **Fuente Principal**: Inter / Manrope
- **Títulos**: Bold/ExtraBold
- **Palabras Clave**: Coloreadas en verde lima

## 📂 Estructura del Proyecto

```
prompt-library/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── HeroSection.tsx
│   │   ├── PromptCard.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── Modal.tsx
│   │   ├── PromptForm.tsx
│   │   ├── ProjectForm.tsx
│   │   └── ...
│   ├── hooks/
│   │   └── useStorage.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── package.json
└── README.md
```

## 🛠️ Tecnologías

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animaciones
- **Lucide React** - Iconos

## 📝 Licencia

MIT License - Usa este proyecto como quieras.

---

<p align="center">
  Hecho con 💚 para la comunidad de IA Ordinaria
</p>

