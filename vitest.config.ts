import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    cache: false,
    exclude: ['**/node_modules/**', '**/.next/**'],
  },
  resolve: {
    conditions: ['node'],
  },
  esbuild: {
    target: 'node18',
  },
})