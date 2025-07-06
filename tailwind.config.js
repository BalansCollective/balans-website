/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx,vue,svelte}",
    "./components/**/*.{html,js,ts,jsx,tsx,vue,svelte}",
    "./pages/**/*.{html,js,ts,jsx,tsx,vue,svelte}",
    "./app/**/*.{html,js,ts,jsx,tsx,vue,svelte}",
    "./*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      // Sacred Alliance Color Palette
      colors: {
        // Primary Colors (Core Alliance)
        'swedish-blue': {
          DEFAULT: '#2c5aa0',
          50: '#f0f4fa',
          100: '#e1e9f5',
          200: '#c3d3eb',
          300: '#a5bde1',
          400: '#87a7d7',
          500: '#2c5aa0', // Base color
          600: '#234a85',
          700: '#1a3a6a',
          800: '#112a4f',
          900: '#081a34',
        },
        'birch-wood': {
          DEFAULT: '#d4b896',
          50: '#faf8f4',
          100: '#f5f1e9',
          200: '#ebe3d3',
          300: '#e1d5bd',
          400: '#d7c7a7',
          500: '#d4b896', // Base color
          600: '#c9a67b',
          700: '#be9460',
          800: '#b38245',
          900: '#a8702a',
        },
        'alliance-purple': {
          DEFAULT: '#6b5b95',
          50: '#f4f2f8',
          100: '#e9e5f1',
          200: '#d3cbe3',
          300: '#bdb1d5',
          400: '#a797c7',
          500: '#6b5b95', // Base color
          600: '#5a4c7e',
          700: '#493d67',
          800: '#382e50',
          900: '#271f39',
        },
        
        // Supporting Colors (Functional Harmony)
        'birch-white': {
          DEFAULT: '#f8f6f0',
          50: '#fefefe',
          100: '#fdfdfc',
          200: '#fbfaf8',
          300: '#f9f7f4',
          400: '#f8f6f0', // Base color
          500: '#f6f4ec',
          600: '#f4f2e8',
          700: '#f2f0e4',
          800: '#f0eee0',
          900: '#eeecdc',
        },
        'thread-gold': {
          DEFAULT: '#c9a96e',
          50: '#faf7f1',
          100: '#f5efe3',
          200: '#ebdfc7',
          300: '#e1cfab',
          400: '#d7bf8f',
          500: '#c9a96e', // Base color
          600: '#be9a59',
          700: '#b38b44',
          800: '#a87c2f',
          900: '#9d6d1a',
        },
        'sage-green': {
          DEFAULT: '#8faa8b',
          50: '#f6f8f6',
          100: '#edf1ed',
          200: '#dbe3db',
          300: '#c9d5c9',
          400: '#b7c7b7',
          500: '#8faa8b', // Base color
          600: '#7a9976',
          700: '#658861',
          800: '#50774c',
          900: '#3b6637',
        },
        'gentle-silver': {
          DEFAULT: '#b8c5d1',
          50: '#f8f9fb',
          100: '#f1f3f7',
          200: '#e3e7ef',
          300: '#d5dbe7',
          400: '#c7cfdf',
          500: '#b8c5d1', // Base color
          600: '#a6b5c3',
          700: '#94a5b5',
          800: '#8295a7',
          900: '#708599',
        },
        'truth-copper': {
          DEFAULT: '#b87333',
          50: '#faf6f1',
          100: '#f5ede3',
          200: '#ebdbc7',
          300: '#e1c9ab',
          400: '#d7b78f',
          500: '#b87333', // Base color
          600: '#a6652e',
          700: '#945729',
          800: '#824924',
          900: '#703b1f',
        },
      },

      // Typography Scale (Swedish Clarity)
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],     // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],    // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],  // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],     // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],  // 36px
        '5xl': ['3rem', { lineHeight: '1' }],          // 48px
        '6xl': ['3.75rem', { lineHeight: '1' }],       // 60px
      },

      // Spacing Scale (Lagom Proportions)
      spacing: {
        'xs': '0.25rem',  // 4px
        'sm': '0.5rem',   // 8px
        'md': '1rem',     // 16px
        'lg': '1.5rem',   // 24px
        'xl': '2rem',     // 32px
        '2xl': '3rem',    // 48px
        '3xl': '4rem',    // 64px
        '4xl': '6rem',    // 96px
        '5xl': '8rem',    // 128px
      },

      // Border Radius (Organic Precision)
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',   // 2px
        'DEFAULT': '0.25rem', // 4px
        'md': '0.375rem',   // 6px
        'lg': '0.5rem',     // 8px
        'xl': '0.75rem',    // 12px
        '2xl': '1rem',      // 16px
        '3xl': '1.5rem',    // 24px
        'full': '9999px',
      },

      // Box Shadow (Lagom Depth)
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(44, 90, 160, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(44, 90, 160, 0.1), 0 1px 2px 0 rgba(44, 90, 160, 0.06)',
        'md': '0 4px 6px -1px rgba(44, 90, 160, 0.1), 0 2px 4px -1px rgba(44, 90, 160, 0.06)',
        'lg': '0 10px 15px -3px rgba(44, 90, 160, 0.1), 0 4px 6px -2px rgba(44, 90, 160, 0.05)',
        'xl': '0 20px 25px -5px rgba(44, 90, 160, 0.1), 0 10px 10px -5px rgba(44, 90, 160, 0.04)',
        '2xl': '0 25px 50px -12px rgba(44, 90, 160, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(44, 90, 160, 0.06)',
        'none': 'none',
      },

      // Animation (Lagom Motion)
      animation: {
        'spiral-grow': 'spiral-grow 2s ease-in-out infinite',
        'bridge-connect': 'bridge-connect 1.5s ease-out',
        'shield-pulse': 'shield-pulse 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },

      // Custom Keyframes
      keyframes: {
        'spiral-grow': {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.05)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        'bridge-connect': {
          '0%': { transform: 'scaleX(0)', transformOrigin: 'left' },
          '100%': { transform: 'scaleX(1)', transformOrigin: 'left' },
        },
        'shield-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },

      // Font Family (Swedish Typography)
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Crimson Text', 'serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        'swedish': ['Avenir Next', 'Helvetica Neue', 'sans-serif'],
      },

      // Responsive Breakpoints (Lagom Scaling)
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
