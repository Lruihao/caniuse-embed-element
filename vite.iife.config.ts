import { defineConfig } from 'vite'
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/caniuse-embed-element.ts',
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
  plugins: [
    {
      name: 'copy-iife-to-demo',
      writeBundle() {
        const sourceFile = 'dist/caniuse-embed-element.iife.js'
        const targetDir = 'dist-demo'
        const targetFile = join(targetDir, 'embed.js')
        
        if (existsSync(sourceFile)) {
          if (!existsSync(targetDir)) {
            mkdirSync(targetDir, { recursive: true })
          }
          copyFileSync(sourceFile, targetFile)
          console.log(`✓ Copied ${sourceFile} to ${targetFile}`)
        }
      },
    },
  ],
})
