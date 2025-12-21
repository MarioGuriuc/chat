/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'conspiracy-dark': '#0a0a0a',
        'conspiracy-darker': '#050505',
        'conspiracy-green': '#00ff41',
        'conspiracy-amber': '#ff9900',
        'conspiracy-red': '#ff0033',
      },
      fontFamily: {
        'mono': ['Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}

