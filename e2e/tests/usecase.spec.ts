import { test, expect, Page } from '@playwright/test';

test.describe('Use Cases List – API Validation', () => {

    test('should load use cases list when API calls succeed', async ({ page }) => {

        // 1️⃣ Capture usecase list API
        const usecaseApi = page.waitForResponse(response =>
            response.url().includes('/use_cases') &&
            response.request().method() === 'GET' &&
            response.status() === 200
        );

        // 2️⃣ Capture permission API
        const permissionApi = page.waitForResponse(response =>
            response.url().includes('user-use-case/permission') &&
            response.request().method() === 'POST' &&
            response.status() === 200
        );

        // console.log("usecaseApi", usecaseApi);
        // console.log("permissionApi", permissionApi);

        // 3️⃣ Navigate to Use Cases page
        await page.goto('/use-cases');

        // 4️⃣ Wait for APIs
        const usecaseResponse = await usecaseApi;
        const permissionResponse = await permissionApi;

        // 5️⃣ Validate API payloads
        const usecaseJson = await usecaseResponse.json();
        expect(Array.isArray(usecaseJson)).toBeTruthy();
        expect(usecaseJson.length).toBeGreaterThan(0);

        const permissionJson = await permissionResponse.json();
        expect(Array.isArray(permissionJson)).toBeTruthy();

        // 6️⃣ Validate table rendered rows
        const rows = page.locator('p-table tbody tr');
        const rowCount = await rows.count();
        expect(rowCount).toBeGreaterThan(0);
    });

});

test.describe('Create Use Case', () => {

  test('should create a new use case successfully', async ({ page }) => {

    // Spy API
    const createApi = page.waitForResponse(resp =>
      resp.url().includes('/use_cases') &&
      resp.request().method() === 'POST' &&
      resp.status() === 200
    );

    await page.goto('/use-cases/create-use-case');

    await fillUseCaseForm(page);

    await page.getByRole('button', { name: 'Save' }).click();

    const response = await createApi;
    const body = await response.json();

    expect(body.useCaseEntity.use_case_id).toBeTruthy();

    // After save, it navigates to edit page
    await expect(page).toHaveURL(/\/use-cases\/edit-usecase\/\d+/);
  });
});

export async function fillUseCaseForm(page: Page) {
  await page.getByLabel('Use Case Name').fill('E2E Test Use Case');
  await page.getByLabel('Use Case Description').fill('E2E Description');
  await page.getByLabel('Use Case Owner').fill('E2E Owner');
  await page.getByLabel('Owner Email').fill('e2e@test.com');
  await page.getByLabel('Version Number - Current').fill('1.0');

  await page.getByLabel('Use Case Status').click();
  await page.getByRole('option', { name: 'NEW' }).click();
}
