/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // use 'class' instead of 'media' (the default)
  theme: {
    extend: {
      colors: {
        primary: {
          '50': 'rgb(var(--color-primary-50) / <alpha-value>)',
          '100': 'rgb(var(--color-primary-100) / <alpha-value>)',
          '200': 'rgb(var(--color-primary-200) / <alpha-value>)',
          '300': 'rgb(var(--color-primary-300) / <alpha-value>)',
          '400': 'rgb(var(--color-primary-400) / <alpha-value>)',
          '500': 'rgb(var(--color-primary-500) / <alpha-value>)',
          '600': 'rgb(var(--color-primary-600) / <alpha-value>)',
          '700': 'rgb(var(--color-primary-700) / <alpha-value>)',
          '800': 'rgb(var(--color-primary-800) / <alpha-value>)',
          '900': 'rgb(var(--color-primary-900) / <alpha-value>)',
          '950': 'rgb(var(--color-primary-950) / <alpha-value>)',
        },
        // Define custom gray colors from your CSS variables
        gray: {
          '50': 'rgb(var(--color-gray-50) / <alpha-value>)',
          '100': 'rgb(var(--color-gray-100) / <alpha-value>)',
          '200': 'rgb(var(--color-gray-200) / <alpha-value>)',
          '300': 'rgb(var(--color-gray-300) / <alpha-value>)',
          '400': 'rgb(var(--color-gray-400) / <alpha-value>)',
          '500': 'rgb(var(--color-gray-500) / <alpha-value>)',
          '600': 'rgb(var(--color-gray-600) / <alpha-value>)',
          '700': 'rgb(var(--color-gray-700) / <alpha-value>)',
          '800': 'rgb(var(--color-gray-800) / <alpha-value>)',
          '900': 'rgb(var(--color-gray-900) / <alpha-value>)',
          '950': 'rgb(var(--color-gray-950) / <alpha-value>)',
        },
        // The app's warm theme (m-splitzy constants/themeColors.json and
        // design-system): indigo is the amber/brown action colour, green and
        // red the income and spending colours, amber/yellow attention.
        indigo: { '50': '#FFF8E6', '100': '#FFF0CF', '200': '#FBE3B0', '300': '#F5CD7E', '400': '#C99A3E', '500': '#A26C13', '600': '#8F5F10', '700': '#7A510E', '800': '#5C3D0A', '900': '#3F2A07', '950': '#2A1C05' },
        purple: { '50': '#FFF8E6', '100': '#FFF0CF', '200': '#FBE3B0', '300': '#F5CD7E', '400': '#C99A3E', '500': '#A26C13', '600': '#8F5F10', '700': '#7A510E', '800': '#5C3D0A', '900': '#3F2A07', '950': '#2A1C05' },
        green: { '50': '#F1F8F1', '100': '#E8F2E8', '200': '#CDE5D2', '300': '#A6D2B3', '400': '#73BC8E', '500': '#4F9A6C', '600': '#397A56', '700': '#2F6447', '800': '#264F39', '900': '#1D3B2B', '950': '#12261B' },
        red: { '50': '#FDF3EF', '100': '#FBEAE4', '200': '#F6D0C4', '300': '#F0AE9B', '400': '#E7866F', '500': '#D0624A', '600': '#B6503D', '700': '#974232', '800': '#793528', '900': '#5C281E', '950': '#3D1A14' },
        amber: { '50': '#FFF8E6', '100': '#FFF3D6', '200': '#FDE7B0', '300': '#FBD889', '400': '#FBCC4F', '500': '#E3AD35', '600': '#B88A26', '700': '#8B681D', '800': '#6B5016', '900': '#4D3A10', '950': '#2F230A' },
        yellow: { '50': '#FFF8E6', '100': '#FFF3D6', '200': '#FDE7B0', '300': '#FBD889', '400': '#FBCC4F', '500': '#E3AD35', '600': '#B88A26', '700': '#8B681D', '800': '#6B5016', '900': '#4D3A10', '950': '#2F230A' },
        white: '#FEFBF6',
        // Primary buttons: amber with ink text, as in the app.
        brand: { DEFAULT: '#FBCA66', hover: '#F7BF4F', border: '#EDB950', disabled: '#F5CD7E' },
        ink: '#2C2B25',
        // Add these for convenience
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        sans: ['var(--font-app-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-out forwards',
        'scaleIn': 'scaleIn 0.3s ease-out forwards',
        'section-expand': 'sectionExpand 300ms ease-out forwards',
        'section-collapse': 'sectionCollapse 300ms ease-out forwards',
        'fade-to-hint': 'fadeToHint 500ms ease-out forwards',
        'fade-from-hint': 'fadeFromHint 400ms ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        sectionExpand: {
          '0%': { opacity: '0', maxHeight: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', maxHeight: '1000px', transform: 'translateY(0)' },
        },
        sectionCollapse: {
          '0%': { opacity: '1', maxHeight: '1000px', transform: 'translateY(0)' },
          '100%': { opacity: '0', maxHeight: '0', transform: 'translateY(-8px)' },
        },
        fadeToHint: {
          '0%': { opacity: '1', filter: 'blur(0)' },
          '100%': { opacity: '0.4', filter: 'blur(1px)' },
        },
        fadeFromHint: {
          '0%': { opacity: '0.4', filter: 'blur(1px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
      },
    },
  },
  plugins: [],
};
