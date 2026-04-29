/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary palette per brief
        ink: {
          DEFAULT: '#0d121c',  // black-ish text & strong contrast
          50:  '#f6f8fb',
          100: '#eef2f7',      // light gray (secondary background)
          200: '#dde4ee',
          300: '#b9c2d2',
          400: '#7d8aa1',
          500: '#4a5469',
          600: '#2c3548',      // dark gray (cards / sections)
          700: '#1d2433',
          800: '#141a26',
          900: '#0d121c',
        },
        brand: {
          50:  '#eaf3ff',
          100: '#d6e7ff',
          200: '#a8ccff',
          300: '#74acff',
          400: '#3b8bff',
          500: '#1f74ff',      // bright blue (primary accent)
          600: '#0f5be0',
          700: '#0d4cb8',
          800: '#0c3f95',      // deep blue (secondary accent)
          900: '#0a3478',
        },
        good: {
          500: '#16a34a',
          600: '#15803d',
        },
        bad: {
          500: '#dc2626',
          600: '#b91c1c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        soft: '0 4px 14px rgba(13, 18, 28, 0.06)',
        card: '0 6px 22px rgba(13, 18, 28, 0.07)',
        pop:  '0 18px 40px rgba(15, 91, 224, 0.18)',
      },
      animation: {
        'fade-up': 'fadeUp 280ms cubic-bezier(.2,.7,.3,1) both',
        'pop-in':  'popIn 240ms cubic-bezier(.2,.7,.3,1) both',
        'shake':   'shake 320ms ease',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        popIn: {
          '0%': { opacity: 0, transform: 'scale(.96)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '50%': { transform: 'translateX(4px)' },
          '75%': { transform: 'translateX(-2px)' },
        },
      },
    },
  },
  plugins: [],
};
