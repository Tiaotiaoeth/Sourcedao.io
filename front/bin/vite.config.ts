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
  plugins: [reactRefresh()],
  root: path.resolve(__dirname, '../src'),
  server: {
    open: true,
    port: 3000,
  },
})
