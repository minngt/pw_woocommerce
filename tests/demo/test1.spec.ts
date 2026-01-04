import { test, expect } from '@playwright/test'

test.describe('Playwright Practice', async () => {
    const MATERIALPAGE_URL = 'https://material.playwrightvn.com'

    test('Test 01 - Register page', async ({ page }) => {
        const registerInfo = {
            username: "minhnguyen",
            email: "minhexample@gmail.com",
            gender: "female",
            hobbies:
                ["traveling", "cooking"],
            interests:
                ["technology", "science", "music"],
            country: "uk",
            dateOfBirth: "1990-01-01",
            profilePicture: "tests/demo/Ghost-Flat-icon.png",
            biography: "If there is a will there will be a way.",
            rating: "8",
            favColor: "#c7401f",
            newsletter: 'Yes',
            switch: "Yes",
        }

        await test.step('Navigate to https://material.playwrightvn.com', async () => {
            await page.goto(MATERIALPAGE_URL);
        });

        await test.step('Click to "Bài học 1: Register Page" and verify text "User Registration"', async () => {
            await page.locator("//a[contains(text(),'Bài học 1: Register Page')]").click();
            await expect(page.locator("//h1")).toContainText('User Registration');
        });

        await test.step('Fill the user information', async () => {
            await page.locator('#username').fill(registerInfo.username);
            await page.locator('#email').fill(registerInfo.email);
            await page.locator(`#${registerInfo.gender}`).check()
            for (const hobby of registerInfo.hobbies) {
                await page.locator(`//label[@for='hobbies']/following-sibling::div//input[@id='${hobby}']`).check()
            }
            await page.locator('#interests').selectOption(registerInfo.interests);
            await page.locator('#country').selectOption({ value: registerInfo.country });
            await page.locator('#dob').fill(registerInfo.dateOfBirth);
            await page.locator('#profile').click();
            await page.locator('#bio').fill(registerInfo.biography);
            await page.locator('#rating').fill(registerInfo.rating);
            await page.locator('#favcolor').fill(registerInfo.favColor);
            registerInfo.newsletter === 'Yes' ?
                await page.locator('#newsletter').check() : null
            registerInfo.switch === 'Yes' ?
                await page.locator('//label[@class="switch"]').click() : null

            await page.locator('//button[@type="submit"]').click();
        });

        await test.step('Verify registered information in table', async () => {

            const targetRow = page.locator('#userTable tbody tr').filter({
                has: page.locator('td', { hasText: registerInfo.username })
            });

            await expect(targetRow.locator('td').nth(1)).toHaveText(registerInfo.username);
            await expect(targetRow.locator('td').nth(2)).toHaveText(registerInfo.email);

            const infoCell = targetRow.locator('td').nth(3);

            const infoFields = [
                { label: 'Gender', value: registerInfo.gender },
                { label: 'Hobbies', value: registerInfo.hobbies.join(', ') },
                { label: 'Country', value: registerInfo.country },
                { label: 'Date of Birth', value: registerInfo.dateOfBirth },
                { label: 'Biography', value: registerInfo.biography },
                { label: 'Rating', value: registerInfo.rating },
                { label: 'Favorite Color', value: registerInfo.favColor },
                { label: 'Newsletter', value: registerInfo.newsletter },
                { label: 'Enable Feature', value: registerInfo.switch },
            ];

            for (const { label, value } of infoFields) {
                const expectedText = `${label}: ${value}`;
                await expect(infoCell, `${label} field should contain: ${value}`).toContainText(expectedText);
            }
        });
    });

    test('Test 02 - Test Product Page', async ({ page} ) => {
        
    })
})