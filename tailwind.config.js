/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        brand: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          accent: '#f59e0b',
          accentHover: '#d97706',
          dark: '#0f172a',
        },
      },
    },
  },
  plugins: [],
};
