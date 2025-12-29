import { test } from '@playwright/test';
import { environment as env } from 'src/environments/environment'

test('Authenticate via Auth0 Universal Login', async ({ page }) => {
  await page.goto('/login');
  
  // Now on Auth0 Universal Login page
  await page.waitForURL(/auth0\.com/);

  await page.fill('input[name="username"]', env.auth.AUTH_EMAIL!);
  await page.fill('input[name="password"]', env.auth.AUTH_PASSWORD!);

  await page.click('button[type="submit"]');

  if (page.url().includes('mfa')) {
    console.log(' MFA enforced — check Auth0 Action');
  }
  
  // ✅ wait for Angular app, NOT Auth0
  await page.waitForURL('**/home', { timeout: 60000 });

  // Save session
  await page.context().storageState({
    path: 'e2e/.auth/user.json'
  });
});
