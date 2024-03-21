import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import type { UserConfig } from 'vitest/config';

const test = {
  globals: true,
  environment: 'jsdom',
  setupFiles: ['src/__tests__/setup.ts'],
  threads: false,
  watch: false,
} as UserConfig['test'];

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  build: { minify: false },
  test,
});
