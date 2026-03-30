/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // 국민연금 - 초록
        np: {
          DEFAULT: '#1D9E75',
          light: '#E8F7F2',
          dark: '#157A5B',
        },
        // 퇴직연금 - 파랑
        dc: {
          DEFAULT: '#378ADD',
          light: '#EAF2FC',
          dark: '#2567B5',
        },
        // 개인연금 - 주황
        pp: {
          DEFAULT: '#EF9F27',
          light: '#FEF6E8',
          dark: '#CC7D10',
        },
      },
    },
  },
  plugins: [],
}
