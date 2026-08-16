import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF0F1',
          100: '#FCE8E9',
          200: '#F8C8CB',
          500: '#E41522', // Official IFG Life Crimson Red
          600: '#C80F1A',
          700: '#A60A13',
          800: '#84060C',
          900: '#0A192F', // IFG Corporate Navy Accent
        },
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          500: '#002855',
          800: '#001A38',
          900: '#0A192F',
        },
        surface: {
          bg: '#F4F5F7',
          border: '#E2E4E8',
          heading: '#0A192F',
          body: '#212B36',
          subtle: '#637381',
          muted: '#9FA6B0',
        },
        danger: {
          50: '#FFF0F2',
          100: '#FFC2CD',
          500: '#EF144A',
          600: '#D40E3E',
        },
        warning: {
          50: '#FFF8E6',
          100: '#FDE68A',
          500: '#D97706',
        },
        info: {
          50: '#EBF5FF',
          100: '#BEE3F8',
          500: '#0060AF',
        },
      },
      boxShadow: {
        tokopedia: '0 1px 6px 0 rgba(0, 0, 0, 0.08)',
        'tokopedia-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.12)',
        'tokopedia-modal': '0 8px 24px 0 rgba(0, 0, 0, 0.18)',
      },
      borderRadius: {
        tokopedia: '8px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out forwards',
        slideInRight: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
};

export default config;
