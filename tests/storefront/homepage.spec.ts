import { test, expect } from '@playwright/test';

const STOREFRONT_URL = 'https://e-commerce.betterbytesvn.com';
const EXPECTED_TITLE = 'E-commerce site for automation testing – Automation test site';

test.describe('HOMEPAGE', () => {

    test('Verify page title', async ({ page }) => {
        await test.step('Navigate to storefront page', async () => {
            await page.goto(STOREFRONT_URL);
        });
        
        await test.step('Verify page title', async() => {
            await expect(page).toHaveTitle(EXPECTED_TITLE);
        });
    });
});
