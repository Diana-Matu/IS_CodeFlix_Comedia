// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    include: ['src/**/*.{test,spec}.{js,ts}', '**/*.test.js'],
    globals: true,
  },
});