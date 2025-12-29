import { test, expect } from '@playwright/test';

test.describe('HOMEPAPE', () => {

    test('Verify page title', async ({ page }) => {
        await test.step('Navigate to storefront page', async () => {
            await page.goto('https://e-commerce.betterbytesvn.com');
        })
        
        await test.step('Verify page title', async() => {
            await expect(page).toHaveTitle('E-commerce site for automation testing – Automation test site')
        })
    });
})
