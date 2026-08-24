module.exports = {
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
      // Formal type scale — use these tokens, not ad-hoc text-sm/xl
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
      // Vertical rhythm — one spacing scale across all sections
      spacing: {
        'section': '5rem',        // py-section = 80px between major sections
        'section-sm': '3rem',     // tighter variant
        'section-lg': '7rem',
      },
      borderWidth: {
        '1': '1px',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'marquee': 'marquee 40s linear infinite',
        'fade-up': 'fade-up 0.5s ease-out forwards',
      },
    }
  }
}
