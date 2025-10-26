/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-plus-jakarta-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        gray: {
          100: '#efeff5',
        },
        purple: {
          200: '#e7e0f7',
          700: '#7223ec'
        },
        dark: '#0e0e0e',
      },
    },
  },
  plugins: [],
}