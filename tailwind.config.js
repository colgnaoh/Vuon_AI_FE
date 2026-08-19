/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          bg: '#F8FAFC',
          surface: '#FFFFFF',
          elevated: '#F1F5F9',
          border: '#E2E8F0',
          emerald: '#059669',
          teal: '#0D9488',
          amber: '#D97706',
          violet: '#7C3AED',
          cyan: '#0284C7',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'eco-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'eco-md': '0 4px 15px -3px rgba(5, 150, 105, 0.08), 0 2px 6px -2px rgba(0, 0, 0, 0.04)',
        'eco-lg': '0 12px 30px -5px rgba(5, 150, 105, 0.12), 0 6px 12px -4px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
