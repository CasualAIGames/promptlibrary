import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Base path para GitHub Pages
// En GitHub Actions usa el nombre del repositorio, en local usa '/'
const getBase = () => {
  if (process.env.GITHUB_ACTIONS) {
    // Extraer el nombre del repo de GITHUB_REPOSITORY (formato: owner/repo)
    const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'promptlibrary'
    return `/${repo}/`
  }
  return '/'
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: getBase(),
})

