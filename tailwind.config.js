/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans KR"', 'sans-serif'],
      },
      colors: {
        pastel: {
          pink: '#fce4ec',
          yellow: '#fff9c4',
          green: '#e8f5e9',
          blue: '#e3f2fd',
          purple: '#f3e5f5',
          peach: '#ffe0b2',
        },
      },
    },
  },
  plugins: [],
}
