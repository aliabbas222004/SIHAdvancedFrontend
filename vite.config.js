import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["sihadvancedfrontend.onrender.com"], 
    host: '0.0.0.0', // 👈 important for Render
    port: 5173, // 👈 use Render’s assigned port
  },
})
