/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'accent-1': '#333'
      },
      fontFamily: {
        sans: ['SDK SC Web', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heavy: ['SDK SC Web', 'sans-serif']
      }
    }
  },
  variants: {},
  plugins: []
}
