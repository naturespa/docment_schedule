/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1a2340',
          dark: '#111827',
          light: '#243050',
        },
        gold: '#c9a227',
        cream: '#f4f1eb',
      },
      fontFamily: {
        sans: ['Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
