import { test, expect } from '@playwright/test';

test('Securyt test request intercept', async ({page}) => {

    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    await page.locator('#userEmail').fill('hemantjanrao@gmail.com');
    await page.locator('#userPassword').fill('@Test1234');
    await page.locator('#login').click();

    await page.waitForLoadState('networkidle');

    await page.goto('https://rahulshettyacademy.com/client/#/dashboard/myorders');

    await page.getByRole('heading', { name: 'Your Orders' }).waitFor({ state: 'visible', timeout: 5000 });

    await page.route('https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*', (route, request) => {
        return route.continue({

            url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=12433545466",
        });
    });
    await page.locator('button').filter({ hasText: 'View' }).first().click();


    console.log('aaaa');
});