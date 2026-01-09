import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 90000,
  // globalSetup: 'e2e/global-setup.ts',

  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
       use: {
        baseURL: 'http://localhost:4203' // ✅ REQUIRED
      }
    },
    {
      name: 'chromium',
      dependencies: ['setup'],
      use: {
        baseURL: 'http://localhost:4203',
        browserName: 'chromium',
        storageState: 'e2e/.auth/user.json'
      }
    }
  ]
});

// import { defineConfig, devices } from '@playwright/test';

// export default defineConfig({
//   testDir: './e2e',

//   /* Global timeouts */
//   timeout: 30000,

//   expect: {
//     timeout: 5000,
//   },

//   /* Parallelization */
//   // fullyParallel: true,
//   // forbidOnly: !!process.env.CI,
//   // retries: process.env.CI ? 2 : 0,
//   // workers: process.env.CI ? 1 : undefined,

//   /* No globalSetup needed (fixtures handle auth) */

//   use: {
//     /* Angular dev server */
//     baseURL: 'http://localhost:4203',

//     /* Debug helpers */
//     trace: 'on-first-retry',
//     screenshot: 'only-on-failure',
//     video: 'retain-on-failure',

//     /* Browser */
//     headless: true,
//     ignoreHTTPSErrors: true,
//   },

//   projects: [
//     {
//       name: 'Chromium',
//       use: { ...devices['Desktop Chrome'] },
//     },
//   ],

//   /* Start Angular automatically */
//   // webServer: {
//   //   command: 'npm run start',
//   //   port: 4200,
//   //   reuseExistingServer: !process.env.CI,
//   //   timeout: 120_000,
//   // },
// });

