/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bms: {
          red: '#F84464',
          dark: '#1F2533',
          darker: '#1A1C23',
          lightBg: '#F5F5F7',
          grayText: '#666666',
          headerBg: '#333545',
          navBg: '#222539'
        }
      }
    },
  },
  plugins: [],
}
