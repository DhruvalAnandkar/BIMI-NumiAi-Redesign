/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable dark mode via class strategy
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        pink: {
          400: '#ec4899',
          500: '#db2777',
          600: '#be185d',
        },
        purple: {
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        indigo: {
          400: '#818cf8',
          600: '#4f46e5',
          700: '#4338ca',
        },
      },
      boxShadow: {
        pinkGlow: '0 0 15px 3px rgba(219, 112, 147, 0.7)',
        purpleGlow: '0 0 20px 4px rgba(139, 92, 246, 0.8)',
      },
    },
  },
  plugins: [],
}