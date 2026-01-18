/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'accent-1': '#333',
        'rose-gold': '#E27D60',
        'rose-gold-dark': '#C38D9E',
        'cream': '#FDFBF7',
        'navy': '#1B2631'
      },
      fontFamily: {
        sans: ['SDK SC Web', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heavy: ['SDK SC Web', 'sans-serif'],
        serif: ['Playfair Display', 'Merriweather', 'serif']
      }
    }
  },
  variants: {},
  plugins: []
}
