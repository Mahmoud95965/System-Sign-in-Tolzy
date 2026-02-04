/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cairo', 'var(--font-cairo)', 'system-ui', 'sans-serif'],
      },
      colors: {
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }, animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'typing': 'typing 4s steps(20) infinite',
        'blink-caret': 'blink-caret 0.75s step-end infinite',
        'number-slide': 'numberSlide 2s cubic-bezier(0.4, 0, 0.2, 1)',
        'pulse-fade': 'pulseFade 2s cubic-bezier(0.4, 0, 0.6, 1)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        typing: {
          '0%, 100%': { width: '0', right: '0' },
          '40%, 60%': { width: '100%', right: '0' }
        },
        'blink-caret': {
          'from, to': { borderRightColor: 'transparent' },
          '50%': { borderRightColor: 'currentColor' }
        },
        'numberSlide': {
          '0%': {
            transform: 'translateY(50px) scale(0.9)',
            opacity: '0',
            filter: 'blur(4px)'
          },
          '30%': {
            opacity: '0.5',
            filter: 'blur(2px)'
          },
          '60%': {
            transform: 'translateY(-10px) scale(1.1)',
            opacity: '0.8',
            filter: 'blur(0)'
          },
          '100%': {
            transform: 'translateY(0) scale(1)',
            opacity: '1'
          }
        },
        'pulseFade': {
          '0%': {
            transform: 'scale(0.9)',
            opacity: '0'
          },
          '60%': {
            transform: 'scale(1.1)',
            opacity: '0.8'
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1'
          }
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  corePlugins: {
    preflight: true,
  },
};