// filepath: /Users/gr/Projects/combifi-web/tailwind.config.js
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
        // Add these for convenience
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-out forwards',
        'scaleIn': 'scaleIn 0.3s ease-out forwards',
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
      },
    },
  },
  plugins: [],
};
