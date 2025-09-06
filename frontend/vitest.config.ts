import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './unit/vitest.setup.ts',
    coverage: {
      provider: 'v8',
      include: ['src/**/*'],
      exclude: ['mock-server/*'],
    },
  },
});