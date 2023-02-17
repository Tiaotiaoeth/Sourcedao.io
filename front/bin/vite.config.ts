import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
const path = require('path')
const alias = require('./config/alias')
const extensions = require('./config/extensions')

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias,
    extensions,
  },
  define: {
    'global': 'globalThis'
  },
  plugins: [reactRefresh()],
  root: path.resolve(__dirname, '../src'),
  server: {
    open: true,
    port: 3000,
  },
  build: {
    target: 'es2020',
    minify: false,
    commonjsOptions: {
      include: []
    }
  },
  optimizeDeps: {
    disabled: false,
    esbuildOptions: {
      target: 'es2020'
    }
  }
})
