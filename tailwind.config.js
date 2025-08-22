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
        // Splash Screen Animations
        particleFloat: {
          '0%': {
            transform: 'translateY(100vh) rotate(0deg)',
            opacity: '0',
          },
          '10%': {
            opacity: '1',
          },
          '90%': {
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(-100px) rotate(360deg)',
            opacity: '0',
          },
        },
        breathe: {
          '0%, 100%': {
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: '0.3',
          },
          '50%': {
            transform: 'translate(-50%, -50%) scale(1.1)',
            opacity: '0.6',
          },
        },
        breatheDelayed: {
          '0%, 100%': {
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: '0.2',
          },
          '50%': {
            transform: 'translate(-50%, -50%) scale(1.1)',
            opacity: '0.4',
          },
        },
        breatheSlow: {
          '0%, 100%': {
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: '0.1',
          },
          '50%': {
            transform: 'translate(-50%, -50%) scale(1.1)',
            opacity: '0.3',
          },
        },
        logoFadeIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        taglineFadeIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        loadingBarFadeIn: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-50%) translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(-50%) translateY(0)',
          },
        },
        loadingProgress: {
          '0%': {
            width: '0%',
          },
          '100%': {
            width: '100%',
          },
        },
        loadingTextFadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        splashFadeOut: {
          '0%': {
            opacity: '1',
            transform: 'scale(1)',
          },
          '100%': {
            opacity: '0',
            transform: 'scale(1.1)',
          },
        },
        mainContentFadeIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        barFillCenter: {
          '0%': {
            transform: 'translateX(-50%) scaleX(0)', 
            left: '50%'
          },
          '100%': {
            transform: 'translateX(0%) scaleX(1)',
            left: '0%'
          }
        },
        fadeIn: {
          '0%': {
            opacity: '0'
          },
          '100%': {
            opacity: '1'
          }
        },
        simpleBarFill: {
          '0%': {
            width: '0%'
          },
          '100%': {
            width: '100%'
          }
        },
      },
      animation: {
        'bounce-custom': 'bounce 2s infinite',
        'fall': 'fall linear infinite',
        'fall-sway-left': 'fall linear infinite, swayLeft linear infinite',
        'fall-sway-right': 'fall linear infinite, swayRight linear infinite',
        // Splash Screen Animations
        'particle-float': 'particleFloat linear infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'breathe-delayed': 'breatheDelayed 4s ease-in-out infinite 0.5s',
        'breathe-slow': 'breatheSlow 4s ease-in-out infinite 1s',
        'logo-fade-in': 'logoFadeIn 1.5s ease-out 0.5s forwards',
        'tagline-fade-in': 'taglineFadeIn 1.5s ease-out 1s forwards',
        'loading-bar-fade-in': 'loadingBarFadeIn 0.5s ease-out 2s forwards',
        'loading-progress': 'loadingProgress 2s ease-out 2.5s forwards',
        'loading-text-fade-in': 'loadingTextFadeIn 0.5s ease-out 2.5s forwards',
        'splash-fade-out': 'splashFadeOut 0.8s ease-out forwards',
        'main-content-fade-in': 'mainContentFadeIn 1s ease-out forwards',
        'bar-fill-center': 'barFillCenter 2s ease-in-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'simple-bar-fill': 'simpleBarFill 2s ease-out forwards',
        'simple-bar-fill': 'simpleBarFill 2s ease-in-out forwards',
      },
    },
  },
  plugins: [],
}

