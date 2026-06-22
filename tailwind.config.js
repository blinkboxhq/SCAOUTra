/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './web/index.html', './src/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans Variable"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#4ade80',
          hover: '#86efac',
          muted: 'rgba(74,222,128,0.12)',
          glow: 'rgba(74,222,128,0.22)',
          cyan: '#22d3ee',
          'cyan-muted': 'rgba(34,211,238,0.08)',
        },
        surface: {
          base: '#050508',
          card: '#09090e',
          elevated: '#0d0d15',
        },
        ink: {
          border: '#1a1a24',
          subtle: '#0e0e16',
          muted: '#52525b',
          secondary: '#a1a1aa',
          primary: '#f4f4f5',
        },
      },
      boxShadow: {
        accent: '0 0 30px rgba(129,140,248,0.2)',
        'accent-lg': '0 0 60px rgba(129,140,248,0.28)',
        card: '0 8px 40px rgba(0,0,0,0.45)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
