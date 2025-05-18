import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '8vgnum-95-191-10-201.ru.tuna.am',
      'localhost',
      '127.0.0.1'
    ]
  }
})
