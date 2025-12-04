# 🔄 Configurar Sincronización Automática con GitHub

La sincronización automática te permite:
- ✅ **Auto-guardar** tus cambios en GitHub (cada 2 segundos después de modificar algo)
- ✅ **Cargar automáticamente** al abrir la app desde cualquier dispositivo
- ✅ **Nunca perder datos** - todo se guarda en tu repositorio de GitHub

---

## 📋 Paso 1: Crear un Personal Access Token

1. **Ve a GitHub Settings:**
   👉 https://github.com/settings/tokens

2. **Haz clic en "Generate new token (classic)"**

3. **Configura el token:**
   - **Note**: `Prompt Library Sync`
   - **Expiration**: Elige la duración (recomendado: 90 días o "No expiration")
   - **Scopes**: Marca **`repo`** (acceso completo a repositorios)
     - Esto permite leer y escribir en tu repositorio

4. **Haz clic en "Generate token"**

5. **Copia el token** (empieza con `ghp_...`)
   - ⚠️ **IMPORTANTE**: Guárdalo en un lugar seguro, no podrás verlo de nuevo

---

## 📋 Paso 2: Configurar en la App

1. **Abre tu Prompt Library:**
   👉 https://casualaigames.github.io/promptlibrary/

2. **Haz clic en "Sincronizar"** (botón verde en el header)

3. **Pega tu token** en el campo

4. **Haz clic en "Verificar"**

5. **¡Listo!** Ya está configurado

---

## ✨ ¿Cómo funciona?

### Auto-guardado
- Cada vez que creas, editas o eliminas un prompt/proyecto
- Espera 2 segundos después del último cambio
- Guarda automáticamente en `data/library.json` de tu repo
- **Silencioso** - no verás notificaciones (solo en consola)

### Carga automática
- Al abrir la app desde cualquier dispositivo
- Si hay token configurado, intenta cargar desde GitHub
- Solo carga si hay más datos en GitHub que en local
- Muestra notificación si carga datos nuevos

### Guardado manual
- Puedes hacer clic en **"Guardar en GitHub ahora"** para forzar guardado
- O **"Cargar desde GitHub"** para traer los últimos datos

---

## 🔒 Seguridad

- El token se guarda **solo en tu navegador** (localStorage)
- **No se comparte** con nadie
- Solo tiene acceso a **tu repositorio** `CasualAIGames/promptlibrary`
- Puedes revocar el token en cualquier momento desde GitHub Settings

---

## 🐛 Solución de Problemas

### "Token inválido"
- Verifica que el token tenga el permiso **`repo`**
- Asegúrate de haber copiado el token completo (empieza con `ghp_`)

### "Error al guardar"
- Verifica que el repositorio existe y tienes permisos
- El archivo se creará automáticamente en `data/library.json`

### "No se cargan los datos"
- Verifica que hayas guardado al menos una vez
- Revisa la consola del navegador (F12) para ver errores

---

## 📁 Estructura del Archivo

Los datos se guardan en:
```
promptlibrary/
└── data/
    └── library.json
```

Formato del JSON:
```json
{
  "prompts": [...],
  "projects": [...],
  "version": "1.0.0",
  "exportedAt": "2025-01-XX..."
}
```

---

¡Disfruta de la sincronización automática! 🚀

