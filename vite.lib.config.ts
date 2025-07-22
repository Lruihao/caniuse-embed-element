import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'CaniuseEmbedElement',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['lit'],
      output: {
        globals: {
          lit: 'Lit',
        },
      },
    },
    copyPublicDir: false,
    outDir: 'dist',
    emptyOutDir: false,
  },
  plugins: [dts()],
})
