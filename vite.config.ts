import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: env.VITE_BASE_URL || '/',
    build: {
      outDir: 'dist-demo',
    },
    define: {
      DEFAULT_ORIGIN: JSON.stringify(env.VITE_DEFAULT_ORIGIN || 'https://caniuse.lruihao.cn'),
    },
  }
})
