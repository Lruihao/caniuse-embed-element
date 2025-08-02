import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    build: {
      lib: {
        entry: 'src/caniuse-embed-element.ts',
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
    define: {
      DEFAULT_ORIGIN: JSON.stringify(env.VITE_DEFAULT_ORIGIN || 'https://caniuse.lruihao.cn'),
    },
    plugins: [dts({
      include: ['src/caniuse-embed-element.ts', 'src/typings'],
    })],
  }
})
