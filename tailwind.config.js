/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        morandi: {
          sage: '#B8C6C3',
          rose: '#D8B4A6',
          slate: '#2D3436',
          stone: '#434C5E',
          cream: '#E9E5E3'
        }
      }
    }
  },
  plugins: [],
}
