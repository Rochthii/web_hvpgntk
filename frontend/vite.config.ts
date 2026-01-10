import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,  // Fail if port 3000 is busy (better than auto-increment)
    host: true,
    cors: true
  },
  optimizeDeps: {
    exclude: []
  }
})
