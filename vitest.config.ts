 import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    alias: {
      '@': path.resolve(__dirname, './apps/web/src'),
      '@pachanova/database': path.resolve(__dirname, './packages/database'),
      '@pachanova/integrations': path.resolve(__dirname, './packages/integrations/src/index.ts')
    }
  }
})
