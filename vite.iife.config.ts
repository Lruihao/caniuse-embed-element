import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'CaniuseEmbedElement',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        // make sure all dependencies are bundled into one file
        inlineDynamicImports: true,
      },
    },
    copyPublicDir: false,
    outDir: 'dist',
    emptyOutDir: false,
  },
})
