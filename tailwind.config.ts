import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFBF5',
        foreground: '#1C1917',
        primary: {
          DEFAULT: '#ae84ea',
          light: '#c4a3f0',
          dark: '#8e5ed0',
        },
        secondary: {
          DEFAULT: '#7B2FBE',
          light: '#9B52D6',
          dark: '#5B1F90',
        },
        accent: {
          teal: '#0EC7B4',
          yellow: '#FFD23F',
          pink: '#FF4B8B',
          blue: '#4BBAFF',
        },
        canvas: {
          dark: '#0D0B14',
          mid: '#1A1535',
        },
      },
      fontFamily: {
        display: ['aabak-swash', 'Georgia', 'serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        nakone: ['Nakone', 'Georgia', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
