/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          dark: '#111827',    // Primary Background
          surface: '#1F2937', // Secondary Background
          card: '#293548',    // Card Background
        },
        teal: {
          DEFAULT: '#00ADB5', // Electric Teal
          hover: '#00949B',   // Teal Hover
          light: '#38BDF8',
          dark: '#00656A',
        },
        primary: {
          DEFAULT: '#00ADB5',
          dark: '#00949B',
          light: '#38BDF8',
        },
        secondary: '#00ADB5',
        darkNavy: '#111827',
        brandBg: '#111827',
        brandSurface: '#1F2937',
        brandCard: '#293548',
        textPrimary: '#F8FAFC',
        textSecondary: '#CBD5E1',
        textMuted: '#94A3B8',
        brandBorder: '#374151',
        brandInput: '#1F2937',
        brandSuccess: '#22C55E',
        brandError: '#F87171',
        brandWarning: '#FBBF24',
        brandPurple: '#A78BFA',
        brandBlue: '#38BDF8',
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
