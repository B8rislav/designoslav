import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { defineConfig } from 'vitest/config';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Stories are this repo's only verification surface, so the test runner runs *them* — every
 * story renders in a real browser and any `play` function becomes an assertion. That is what
 * keeps a component's keyboard contract from quietly drifting away from what its UI promises.
 */
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
        // Pre-bundled up front because Vite discovering these mid-run reloads the page and
        // fails the in-flight suites — which is every run on a cold cache, i.e. CI.
        optimizeDeps: {
          include: ['react', 'react-dom/client', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
        },
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
