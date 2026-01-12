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

    test('Test 02 - Test Product Page', async ({ page }) => {

        type Product = {
            name: string;
            quantity: number;
            price: number; // optional
        };

        let productToCart: Product[] = [
            {
                name: "Product 1",
                quantity: 2,
                price: 0
            },
            {
                name: "Product 2",
                quantity: 3,
                price: 0
            },
            {
                name: "Product 3",
                quantity: 1,
                price: 0
            }
        ]

        await test.step('Navigate to https://material.playwrightvn.com', async () => {
            await page.goto(MATERIALPAGE_URL);
        });

        await test.step('Navigate to product page', async () => {
            await page.locator("//*[@href='02-xpath-product-page.html']").click();
            await expect(page.locator("//h1")).toContainText('Simple E-commerce');
        });

        await test.step('Add product to cart', async () => {

            for (const product of productToCart) {
                const productNameLoc = page.locator(`//div[normalize-space()='${product.name}']`)
                const addButtonLoc = productNameLoc.locator('xpath=following-sibling::button')
                const priceLoc = productNameLoc.locator('xpath=following-sibling::div[@class="product-price"]')
                const productPriceText = await priceLoc.innerText()
                const productPrice = Number(productPriceText.replace(/[^\d.]/g, ''));

                product.price = productPrice;

                for (let i = 0; i < product.quantity; i++) {
                    await addButtonLoc.click();
                }
            }
        });

        await test.step('Verify product in cart and total price', async () => {
            const rows = page.locator('#cart-items tr');
            const totalPriceLocs = page.locator("//td[@class='total-price']");
            let totalPrice = 0
            let i = 0;
            for (let item of productToCart) {
                const rowIndex = rows.nth(i++);
                const columnName = rowIndex.locator('td').nth(0);
                const columnPrice = rowIndex.locator('td').nth(1);
                const columnQuantity = rowIndex.locator('td').nth(2);
                totalPrice += item.price * item.quantity

                await expect(columnName).toHaveText(item.name)
                await expect(columnPrice).toContainText(item.price.toLocaleString())
                await expect(columnQuantity).toHaveText(item.quantity.toLocaleString());
            }
            await expect(totalPriceLocs).toContainText(totalPrice.toLocaleString())
        });
    });

    test('Test 03 - Todo page', async ({ page }) => {
        const taskListLoc = page.locator('#task-list li');

        await test.step('Navigate to material page', async () => {
            await page.goto(MATERIALPAGE_URL);
        });

        await test.step('Navigate to Todo page', async () => {
            await page.locator('//a[@href="03-xpath-todo-list.html"]').click();
            await expect(page.locator('//h1')).toHaveText('To-Do List')
        });

        await test.step('Add todo list "Todo i"', async () => {
            for (let i = 0; i < 100; i++) {
                await page.locator('//input[@id="new-task"]').fill(`Todo ${i + 1}`);
                await page.locator('//button[@id="add-task"]').click();
                await expect(taskListLoc.nth(i).locator('span')).toHaveText(`Todo ${i + 1}`)
            }
        });

        await test.step('Delete todo items with an odd number', async () => {

            for (let i = 99; i >= 1; i -= 2) {
                page.once('dialog', dialog => {
                    dialog.accept();
                });
                await page.locator(`#todo-${i}-delete`).click();
            }
            await expect(taskListLoc).toHaveCount(50);
            for (let i = 1; i <= 50; i++) {
                await expect(taskListLoc.nth(i-1).locator('span')).toHaveText(`Todo ${i*2}`)
            }
        })


    })
})