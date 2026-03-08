/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Aura Green (Primary - from organic/natural theme)
        'aura': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',  // Primary Aura Green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#145231',
        },
        // Earth Brown (Secondary - organic/natural)
        'earth': {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',  // Primary Earth Brown
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        // Cream/Natural (Accent)
        'cream': {
          50: '#fffbf0',
          100: '#fef6e4',
          200: '#ffecc4',
          300: '#ffd89b',
          400: '#ffbeaa',
          500: '#ff9966',  // Primary Cream/Natural
          600: '#ff8844',
          700: '#dd6633',
          800: '#996633',
          900: '#664422',
        },
        // Backward compatibility aliases
        'magenta': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',  // Maps to Aura Green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#145231',
        },
        'golden': {
          50: '#fffbf0',
          100: '#fef6e4',
          200: '#ffecc4',
          300: '#ffd89b',
          400: '#ffbeaa',
          500: '#ff9966',  // Maps to Cream
          600: '#ff8844',
          700: '#dd6633',
          800: '#996633',
          900: '#664422',
        },
        'olive': {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',  // Maps to Earth Brown
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
      },
      fontFamily: {
        against: ["'Against', sans-serif"],
        garamond: ["'Garamond', serif"],
        'dm-serif': ["'DM Serif Text', serif"],
        'noto-serif': ["'Noto Serif', serif"],
        montserrat: ["'Montserrat', sans-serif"],
        audiowide: ["'Audiowide', sans-serif"],
        heebo: ["'Heebo', sans-serif"],
      },
      backgroundImage: {
        'gradient-auth': 'linear-gradient(135deg, #22c55e 0%, #ff9966 100%)',
        'gradient-text': 'linear-gradient(135deg, #22c55e 0%, #78716c 50%, #ff9966 100%)',
      },
    },
  },
  plugins: [],
}
