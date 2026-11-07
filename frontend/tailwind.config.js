/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6C4CE8',
          dark: '#5032C4',
          light: '#8B72ED',
        },
        secondary: '#FF8066',
        darkNavy: '#15152B',
        brandBg: '#F8F8FC',
        textPrimary: '#202033',
        textSecondary: '#77778A',
        brandBorder: '#E9E8F0',
        brandSuccess: '#16A36A',
        brandError: '#E5484D',
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
