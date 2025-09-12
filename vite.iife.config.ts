import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import minifyHtmlLiterals from '@lit-labs/rollup-plugin-minify-html-literals'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
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
        plugins: [
          minifyHtmlLiterals({
            options: {
              minifyOptions: {
                removeComments: true,
                collapseWhitespace: true,
                minifyCSS: true,
                minifyJS: false,
                caseSensitive: true,
                removeEmptyElements: false,
                // strict whitespace handling
                ignoreCustomFragments: [],
                processConditionalComments: false,
                removeAttributeQuotes: false,
                removeRedundantAttributes: false,
                removeScriptTypeAttributes: false,
                removeStyleLinkTypeAttributes: false,
              },
            },
          }),
        ],
      },
      copyPublicDir: false,
      outDir: 'dist',
      emptyOutDir: false,
    },
    define: {
      DEFAULT_ORIGIN: JSON.stringify(env.VITE_DEFAULT_ORIGIN || 'https://caniuse.lruihao.cn'),
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
  }
})
