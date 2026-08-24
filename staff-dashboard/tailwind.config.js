/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        government: {
          primary: '#1B5E20',      // deep institutional green
          secondary: '#2E7D32',
          accent: '#C9A227',       // wheat gold — CTAs & highlights only
          'accent-light': '#F5EDD3',
          bg: '#FAFAF7',           // warm off-white
          'bg-alt': '#F2F0E8',     // slightly deeper warm white for alternating sections
          text: '#1A1A1A',
          'text-secondary': '#4A4A4A',
          'text-muted': '#767676',
          border: '#D6D3C4',
          'border-light': '#E8E5D8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'Noto Sans Devanagari', 'sans-serif'],
      },
      fontSize: {
        'eyebrow': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.1em', fontWeight: '600' }],
        'caption': ['0.75rem', { lineHeight: '1.25rem', letterSpacing: '0.02em' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5rem' }],
        'body': ['1rem', { lineHeight: '1.625rem' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'h3': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'h2': ['1.75rem', { lineHeight: '2.25rem', fontWeight: '700' }],
        'h1': ['2.75rem', { lineHeight: '3.25rem', fontWeight: '700', letterSpacing: '-0.02em' }],
        'h1-xl': ['3.5rem', { lineHeight: '4rem', fontWeight: '800', letterSpacing: '-0.03em' }],
        'stat': ['2.5rem', { lineHeight: '1', fontWeight: '800', letterSpacing: '-0.02em' }],
      },
      spacing: {
        'section': '5rem',
        'section-sm': '3rem',
        'section-lg': '7rem',
      },
      borderWidth: {
        '1': '1px',
      },
    },
  },
  plugins: [],
};
