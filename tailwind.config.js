/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0E1A',
        surface: '#111827',
        surfaceHover: '#161D2F',
        primary: '#E8553E',
        primaryHover: '#FF6B47',
        textPrimary: '#FFFFFF',
        textSecondary: '#A0ADB8',
      },
      fontFamily: {
        heading: ['Barlow Condensed', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
