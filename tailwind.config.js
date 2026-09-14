/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F8FAFC', // Slate-50
        card: '#FFFFFF',
        primary: {
          DEFAULT: '#0F172A', // Slate-900
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#3B82F6', // Blue-500
          foreground: '#FFFFFF',
        },
        surface: '#fcf8fa',
        'surface-dim': '#dcd9db',
        'on-surface': '#1b1b1d',
        success: '#10B981', // Emerald-500
        pending: '#F59E0B', // Amber-500
        urgent: '#F43F5E', // Rose-500
        border: '#E2E8F0', // Slate-200
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-md': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-sm': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '600' }],
        'label-sm': ['11px', { lineHeight: '14px', fontWeight: '500' }],
      },
      borderRadius: {
        'sm': '0.25rem',
        DEFAULT: '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        'full': '9999px',
      },
      spacing: {
        'base': '4px',
        'xs': '8px',
        'sm': '12px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        'gutter': '24px',
      },
      boxShadow: {
        'card': '0px 4px 6px -1px rgba(15, 23, 42, 0.05)',
        'card-hover': '0px 10px 15px -3px rgba(15, 23, 42, 0.1)',
      }
    },
  },
  plugins: [],
}
