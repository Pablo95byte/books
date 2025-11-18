/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Palette Libreria Francese Vintage
        primary: {
          50: '#faf8f3',
          100: '#f5f1e8',
          200: '#ebe4d1',
          300: '#d4c4a8',
          400: '#c9a962',
          500: '#daa520', // Oro antico
          600: '#b8860b',
          700: '#8b5a2b', // Marrone legno chiaro
          800: '#6d4423',
          900: '#5d4037', // Marrone scuro
          950: '#3e2723', // Quasi nero-marrone
        },
        // Colori supplementari
        vintage: {
          cream: '#f5f1e8',
          paper: '#f4ecd8',
          gold: '#daa520',
          goldDark: '#b8860b',
          wood: '#8b5a2b',
          woodDark: '#6d4423',
          brown: '#5d4037',
          brownDark: '#3e2723',
          green: '#4e6741',
          greenLight: '#5d7a4e',
          bordeaux: '#7c3238',
          bordeauxDark: '#6b2737',
        },
        gray: {
          50: '#faf8f3',
          100: '#f5f1e8',
          200: '#ebe4d1',
          300: '#d4c4a8',
          400: '#c9a962',
          500: '#8b5a2b',
          600: '#6d4423',
          700: '#5d4037',
          800: '#3e2723',
          900: '#2d2416',
          950: '#1a1410',
        }
      },
      fontFamily: {
        sans: ['"Crimson Text"', 'Georgia', 'serif'],
        serif: ['"Crimson Text"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(62, 39, 35, 0.08)',
        'soft-lg': '0 4px 16px rgba(62, 39, 35, 0.12)',
        'soft-xl': '0 8px 32px rgba(62, 39, 35, 0.16)',
        'vintage': '0 4px 12px rgba(62, 39, 35, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
        'vintage-hover': '0 8px 24px rgba(62, 39, 35, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
        'inset-soft': 'inset 2px 2px 4px rgba(62, 39, 35, 0.1)',
      },
    },
  },
  plugins: [],
}
