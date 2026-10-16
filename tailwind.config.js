/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          950: '#070b14',
          900: '#0b1324',
          800: '#111e38',
          700: '#1b2d52',
        },
        sf: {
          player: '#38bdf8', // Player Blue
          ally: '#22c55e',   // Ally Green
          enemy: '#ef4444',  // Enemy Red
          neutral: '#eab308' // Neutral Yellow
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
