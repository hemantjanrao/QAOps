import { expect, BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { test } from '../util/test.base';

let webContext: BrowserContext;

test.describe('UI Basics tests', () => {


    // test.beforeAll(async ({ browser }) => {
    //     const context = await browser.newContext();
    //     const page = await context.newPage();
    //     await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    //     await page.locator('#userEmail').fill('hemantjanrao@gmail.com');
    //     await page.locator('#userPassword').fill('@Test1234');
    //     await page.locator('#login').click();

    //     // Wait until authenticated UI is visible
    //     await page.waitForURL('**/dashboard/**');

    //     // or: await expect(page.locator('.card-body h5').first()).toBeVisible();
    //     await context.storageState({ path: 'storageState.json' });
    //     webContext = await browser.newContext({ storageState: 'storageState.json' });
    //     await context.close(); // optional but good practice

    // });

    test('First playwright test', async ({ page }) => {

        const usernameField = page.getByRole('textbox', { name: 'Username:' });
        const passwordField = page.getByRole('textbox', { name: 'Password:' });
        const adminCheckbox = page.getByLabel('Admin');
        const dropdown = page.locator('select.form-control');
        const termsCheckbox = page.locator('#terms');
        const signInButton = page.locator('#signInBtn');
        const cardsTitles = page.locator('.card-body a');

        await usernameField.fill("rahulshettyacademy");
        await passwordField.fill("Learning@830$3mK2");
        await adminCheckbox.click();
        expect(await adminCheckbox.isChecked()).toBe(true);
        await dropdown.selectOption('stud');

        await termsCheckbox.check();

        await signInButton.click();

        // Shop page loads after login — locator runs too early without this wait
        // await page.waitForURL('**/angularpractice/**');
        await expect(cardsTitles.first()).toBeVisible();

        const allTitles = await cardsTitles.allTextContents();
        console.log(allTitles);
    });

    // test('Second playwright test', async () => {

    //     const page = await webContext.newPage();
    //     await page.goto("https://rahulshettyacademy.com/client/#/dashboard/products");
    //     await page.locator('.card-body h5').first().waitFor({ state: 'visible', timeout: 5000 });
    //     console.log(await page.locator('.card-body h5').allTextContents());
    //     await page.close();
    // });

    test('Child with parent', async ({ browser }) => {

        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
        const documentRequestLink = page.locator("[href*='/documents-request']");

        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            documentRequestLink.click()
        ]);

        const text = await newPage.locator('p.im-para.red').textContent();
        const arr: string[] = text?.split('@') ?? [];
        const username = arr[1].split(' ')[0];

        await page.locator('#username').fill(username);
        console.log(await page.locator('#username').inputValue());

    });


    test('Add to cart', async ({ page, testData }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login("hemantjanrao@gmail.com", "@Test1234");

        const checkoutPage = new CheckoutPage(page);
        await checkoutPage.checkout(testData.productName);

        expect(await page.locator('h1.hero-primary')).toHaveText(' Thankyou for the order. ');

        const orderId = await page.locator('label.ng-star-inserted').textContent();
        console.log(orderId);
    });

});