/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      keyframes: {
        bounce: {
          '0%, 20%, 50%, 80%, 100%': {
            transform: 'translateX(-50%) translateY(0)',
          },
          '40%': {
            transform: 'translateX(-50%) translateY(-10px)',
          },
          '60%': {
            transform: 'translateX(-50%) translateY(-5px)',
          },
        },
        fall: {
          '0%': {
            transform: 'translateY(-50px) translateX(0px) rotate(0deg)',
            opacity: '1',
          },
          '10%': {
            opacity: '1',
          },
          '90%': {
            opacity: '0.8',
          },
          '100%': {
            transform: 'translateY(100vh) translateX(50px) rotate(360deg)',
            opacity: '0',
          },
        },
        swayLeft: {
          '0%, 100%': { transform: 'translateX(0px)' },
          '25%': { transform: 'translateX(-20px)' },
          '75%': { transform: 'translateX(20px)' },
        },
        swayRight: {
          '0%, 100%': { transform: 'translateX(0px)' },
          '25%': { transform: 'translateX(20px)' },
          '75%': { transform: 'translateX(-20px)' },
        },
      },
      animation: {
        'bounce-custom': 'bounce 2s infinite',
        'fall': 'fall linear infinite',
        'fall-sway-left': 'fall linear infinite, swayLeft linear infinite',
        'fall-sway-right': 'fall linear infinite, swayRight linear infinite',
      },
    },
  },
  plugins: [],
}

