import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vercel 배포용 base 설정
export default defineConfig({
  plugins: [react()],
  base: '/',
})
