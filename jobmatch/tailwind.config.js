/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#EEEDFE',
          100: '#CECBF6',
          200: '#AFA9EC',
          400: '#7F77DD',
          600: '#534AB7',
          800: '#3C3489',
          900: '#26215C',
        },
        warm: {
          50:  '#FDF8F3',
          100: '#F5EDE0',
          200: '#E8D5BC',
          600: '#C4834A',
          900: '#2D1F0E',
        },
        card: {
          dark:    '#1C1730',
          medium:  '#252040',
          overlay: '#312A52',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
