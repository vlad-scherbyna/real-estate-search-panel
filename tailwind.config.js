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
      boxShadow: {
        light: '0px 1px 1px 0px rgba(0, 0, 0, 0.02), 0px 1px 3px 0px rgba(0, 0, 0, 0.04)',
        'light-blue': '0px 0px 0px 1.5px rgba(47, 114, 226, 0.25), 0px 1px 1px 0px rgba(0, 0, 0, 0.02), 0px 1px 3px 0px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}