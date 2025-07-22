import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist-demo',
    rollupOptions: {
      input: {
        main: 'index.html',
        iife: 'iife.html'
      }
    }
  }
})
