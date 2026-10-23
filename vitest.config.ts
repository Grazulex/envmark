import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Vitest 5 no longer excludes dist/ by default; the compiled copies of the tests live there
    include: ['src/**/*.test.ts'],
  },
});
