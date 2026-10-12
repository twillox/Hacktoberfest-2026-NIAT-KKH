/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crimson: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        surface: {
          50: '#ffffff',
          100: '#fdfbf9',
          200: '#faf7f4',
          300: '#f4efe9',
          400: '#eae3db',
          500: '#ded4c8',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -1px rgba(0, 0, 0, 0.04), 0 1px 3px -1px rgba(0, 0, 0, 0.02)',
        'soft': '0 4px 20px -2px rgba(185, 28, 28, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'soft-md': '0 10px 25px -3px rgba(185, 28, 28, 0.07), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 24px 0 rgba(140, 40, 40, 0.04)',
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      }
    },
  },
  plugins: [],
}
