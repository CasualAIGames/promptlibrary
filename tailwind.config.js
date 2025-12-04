/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fondo Principal - Deep Navy/Black
        'dark-bg': '#02040a',
        'dark-card': 'rgba(15, 23, 42, 0.6)',
        'dark-border': 'rgba(51, 65, 85, 0.5)',
        
        // Acento Principal - Lima Ácido / Electric Lime
        'lime-accent': '#a3e635',
        'lime-hover': '#bef264',
        'lime-glow': 'rgba(163, 230, 53, 0.3)',
        
        // Verde Esmeralda secundario
        'emerald-soft': '#10b981',
        'emerald-glow': 'rgba(16, 185, 129, 0.2)',
        
        // Texto
        'text-primary': '#ffffff',
        'text-secondary': '#94a3b8',
        'text-muted': '#64748b',
      },
      fontFamily: {
        'sans': ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glow-gradient': 'radial-gradient(ellipse at top left, rgba(163, 230, 53, 0.15) 0%, rgba(16, 185, 129, 0.05) 30%, transparent 60%)',
      },
      boxShadow: {
        'lime': '0 0 20px rgba(163, 230, 53, 0.3)',
        'lime-sm': '0 0 10px rgba(163, 230, 53, 0.2)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(163, 230, 53, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(163, 230, 53, 0.5)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

