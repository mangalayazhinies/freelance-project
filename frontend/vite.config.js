import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    proxy: {
      // Any request to /api goes to our Spring Boot backend
      // This avoids CORS issues during development
      '/api': 'http://localhost:8082'
    }
  }
})
