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
          200: '#FAFBFC',
          300: '#E1E1E1',
          400: '#C0C0C0',
          500: '#8C93A1',
          550: '#EBEDF0',  // bg-gray-700/15, do not use opacity with hashed line
          600: '#677289',
          650: '#D7DAE0',  // bg-gray-700/35, do not use opacity with hashed line
          700: '#9DA4B2',
        },
        dark: '#1A1A1A',
        blue: '#2F72E2',
        yellow: '#F59D0E',
        red: '#EF494F',
      },
      boxShadow: {
        light: '0px 1px 1px 0px rgba(0, 0, 0, 0.02), 0px 1px 3px 0px rgba(0, 0, 0, 0.04)',
        'light-blue': '0px 0px 0px 1.5px rgba(47, 114, 226, 0.25), 0px 1px 1px 0px rgba(0, 0, 0, 0.02), 0px 1px 3px 0px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}