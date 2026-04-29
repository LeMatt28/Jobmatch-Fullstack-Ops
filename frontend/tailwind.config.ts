import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Palette pastel
        primary: {
          DEFAULT: '#6B9AE8',
          50: '#F0F5FD',
          100: '#DAE7FA',
          200: '#B5CFF5',
          300: '#90B7F0',
          400: '#6B9AE8',
          500: '#4A7FDC',
          600: '#3366C5',
          700: '#254FA0',
          800: '#1A3A7A',
          900: '#102558',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#E8A1C8',
          100: '#FBE8F3',
          200: '#F4C8E2',
          300: '#EEB5D5',
          400: '#E8A1C8',
          500: '#D97AB0',
          foreground: '#2D3748',
        },
        accent: {
          DEFAULT: '#B8A4E8',
          100: '#F0EDF9',
          200: '#D9D1F3',
          300: '#C8BBED',
          400: '#B8A4E8',
          500: '#9B84DC',
          foreground: '#2D3748',
        },
        success: {
          DEFAULT: '#A8E6CF',
          foreground: '#1A5C3A',
        },
        warning: {
          DEFAULT: '#FFD4A3',
          foreground: '#7A4A00',
        },
        background: '#FAFBFF',
        surface: '#FFFFFF',
        border: '#E2E8F0',
        // Texte
        'text-primary': '#2D3748',
        'text-secondary': '#718096',
        // shadcn/ui compat
        card: { DEFAULT: '#FFFFFF', foreground: '#2D3748' },
        popover: { DEFAULT: '#FFFFFF', foreground: '#2D3748' },
        muted: { DEFAULT: '#F7F8FC', foreground: '#718096' },
        destructive: { DEFAULT: '#FC8181', foreground: '#FFFFFF' },
        input: '#E2E8F0',
        ring: '#6B9AE8',
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
      boxShadow: {
        card: '0 2px 8px 0 rgba(107, 154, 232, 0.08)',
        'card-hover': '0 4px 16px 0 rgba(107, 154, 232, 0.16)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
