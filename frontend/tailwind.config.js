/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0b132b',
        mist: '#1c2541',
        accent: '#3a506b',
        neon: '#5bc0be',
        sand: '#c5c6c7'
      }
    },
  },
  plugins: [],
};
