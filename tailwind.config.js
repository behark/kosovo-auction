/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef4ff',
          100: '#dce8fd',
          200: '#bfd5fc',
          300: '#93b8f8',
          400: '#6190f2',
          500: '#3f69eb',
          600: '#2a4fde', // Primary brand color
          700: '#243ccd',
          800: '#2333a6',
          900: '#232f83',
          950: '#1a1d50',
        },
        secondary: {
          50: '#fdfae8',
          100: '#faf3c3',
          200: '#f6e68a',
          300: '#f1d246', // Secondary brand color
          400: '#eac032',
          500: '#dba51e',
          600: '#bc8016',
          700: '#985d16',
          800: '#7c4a18',
          900: '#683c19',
          950: '#3d1f0a',
        },
        accent: {
          50: '#f6f7f9',
          100: '#ebedf2',
          200: '#d3d8e2',
          300: '#acb6c8',
          400: '#7f8da8',
          500: '#5f6e8c', // Accent color for UI elements
          600: '#4c5874',
          700: '#3f4860',
          800: '#373e51',
          900: '#323745',
          950: '#23262f',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair-display)', 'serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
        'dropdown': '0 10px 25px 0 rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        bidvista: {
          primary: '#2a4fde',
          secondary: '#f1d246',
          accent: '#5f6e8c',
          neutral: '#23262f',
          'base-100': '#ffffff',
          'base-200': '#f6f7f9',
          'base-300': '#ebedf2',
          'base-content': '#23262f',
          info: '#3abff8',
          success: '#36d399',
          warning: '#fbbd23',
          error: '#f87272',
        },
        'bidvista-dark': {
          primary: '#4469e5',
          secondary: '#f3d968',
          accent: '#7f8da8',
          neutral: '#ebedf2',
          'base-100': '#1a1d29',
          'base-200': '#23262f',
          'base-300': '#323745',
          'base-content': '#f6f7f9',
          info: '#3abff8',
          success: '#36d399',
          warning: '#fbbd23',
          error: '#f87272',
        },
      },
    ],
  },
}
