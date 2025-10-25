import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brutal-red': '#FF0037',
        'brutal-black': '#000000',
        'brutal-white': '#FFFFFF',
        'brutal-yellow': '#FFD700',
      },
      fontFamily: {
        'mono': ['Space Mono', 'IBM Plex Mono', 'monospace'],
        'brutal': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'glitch': 'glitch 2s infinite',
        'pulse-red': 'pulse-red 2s infinite',
        'skew': 'skew 3s infinite alternate',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'pulse-red': {
          '0%, 100%': { 
            backgroundColor: '#FF0037',
            transform: 'scale(1)',
          },
          '50%': { 
            backgroundColor: '#FF3366',
            transform: 'scale(1.05)',
          },
        },
        skew: {
          '0%': { transform: 'skewY(-2deg)' },
          '100%': { transform: 'skewY(2deg)' },
        },
      },
    },
  },
  plugins: [],
}
export default config


