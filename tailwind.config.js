/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Archivo Black"', 'system-ui', 'sans-serif'],
        sans: ['"Syne"', 'system-ui', 'sans-serif'],
        hand: ['"Caveat"', 'cursive', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(163, 230, 53, 0.25), 0 24px 80px rgba(0, 0, 0, 0.55)',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: '0.65', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        pulseSoft: 'pulseSoft 5s ease-in-out infinite',
        marquee: 'marquee 18s linear infinite',
      },
    },
  },
  plugins: [],
};
