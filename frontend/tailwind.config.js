/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          950: '#070f14',
          900: '#0d171e',
          850: '#111f29',
          800: '#162835',
          700: '#1e384b',
          600: '#2b506b',
        },
        sidebar: {
          bg: '#0c151c',
          active: '#0b3a4a',
          hover: '#14232f',
          border: '#1a2e3d',
        },
        aqua: {
          50: '#ecfbff',
          100: '#cdf4fe',
          200: '#9ae8fc',
          300: '#5ad8f6',
          400: '#22c5ee',
          500: '#00B7EB',
          600: '#0093bf',
          700: '#007599',
          800: '#045d7a',
          900: '#0a4c64',
        },
        maritime: {
          blue: '#0284c7',
          deep: '#0369a1',
          teal: '#0d9488',
        },
        risk: {
          low: '#10b981',
          moderate: '#3b82f6',
          high: '#f97316',
          critical: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        dropdown: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
