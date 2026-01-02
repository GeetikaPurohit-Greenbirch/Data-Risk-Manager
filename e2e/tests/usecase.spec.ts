import { test, expect } from '@playwright/test';

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

        console.log("usecaseApi", usecaseApi);
        console.log("permissionApi", permissionApi);

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
