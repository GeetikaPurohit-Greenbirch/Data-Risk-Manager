import { test, expect } from '@playwright/test';

test('Home page loads after Auth0 login', async ({ page }) => {
  await page.goto('/home');

  await expect(page).toHaveURL(/\/home$/);

  const welcomeBanner = page.locator('section.welcome-banner');

  await expect(
    welcomeBanner.getByRole('heading', {
      name: 'GreenBirch Data Risk Manager'
    })
  ).toBeVisible();

  await expect(
    welcomeBanner.getByText(/^Welcome\s/)
  ).toBeVisible();

  const userName = await page.evaluate(() => localStorage.getItem('userName'));
  expect(userName).toBeTruthy();
});


