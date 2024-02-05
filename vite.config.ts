import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals   : true,
    setupFiles: ['./src/utils/test/setup.ts'],
    exclude   : ['**/node_modules/**', '**/external/**'],
  },
  plugins: [tsconfigPaths()],
});
