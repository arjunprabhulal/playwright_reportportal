// @ts-check
const { defineConfig } = require('@playwright/test');
const RPConfig = require('./config/reportportal');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['list'],
    ['@reportportal/agent-js-playwright', RPConfig]
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://demoblaze.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
}); 