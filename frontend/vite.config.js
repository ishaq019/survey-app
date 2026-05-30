import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/survey-app/',
  plugins: [react()],
  server: {
    port: 5174,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          recharts: ['recharts'],
          tiptap: ['@tiptap/react', '@tiptap/starter-kit'],
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
})
