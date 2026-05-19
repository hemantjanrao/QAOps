import { test, expect } from '@playwright/test';
import { APIUtil } from '../util/APIUtil';

let token: string;
let orderId: string;

const authPayload = {
    userEmail: 'hemantjanrao@gmail.com',
    userPassword: '@Test1234',
};

test.describe('API tests', async () => {

    test.use({
        baseURL: 'https://rahulshettyacademy.com',
    });

    test.beforeEach(async ({ request }) => {
        const apiUtil = new APIUtil(request, authPayload);
        token = await apiUtil.getToken();
        const productId = await apiUtil.getProductIdByName('ZARA COAT 3');
        orderId = await apiUtil.createOrder({
            orders: [{ country: 'India', productOrderedId: productId }],
        });
        console.log('API orderId:', orderId);
    });

    test('Add to cart', async ({ page }) => {

        const products = page.locator('.card-body');
        const name = 'ZARA COAT 3';

        await page.addInitScript(`window.localStorage.setItem('token', '${token}')`);

        await page.goto('/client/#/dashboard/products');

        await products.first().waitFor({ state: 'visible', timeout: 5000 });
        const count = await products.count();

        for (let i = 0; i < count; i++) {
            const product = products.nth(i);
            const productName = await product.locator('b').textContent();
            if (productName && productName.includes(name)) {
                await product.getByText('Add To Cart').click();
            }
        }

        await page.locator("[routerlink*='/dashboard/cart']").click();

        await page.locator('.cart').waitFor({ state: 'visible', timeout: 5000 });
        const cartItems = await page.locator("div[class='cartSection'] h3").textContent();

        expect(cartItems).toContain(name);
        await page.getByRole('button', { name: 'Checkout' }).click();

        await page.locator('[placeholder*="Country"]').pressSequentially('ind', { delay: 100 });

        const dropdown = page.locator('.ta-results');
        await dropdown.waitFor({ state: 'visible', timeout: 5000 });

        const buttons = await dropdown.locator('button').allTextContents();

        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].trim() === 'India') {
                await dropdown.locator('button').nth(i).click();
                break;
            }
        }

        expect(await page.locator('div.user__name.mt-5 label').textContent()).toEqual('hemantjanrao@gmail.com');
        await page.locator('.actions').locator('a').first().click();
        await page.locator('h1.hero-primary').waitFor({ state: 'visible', timeout: 5000 });
        expect(await page.locator('h1.hero-primary')).toHaveText(' Thankyou for the order. ');
        const uiOrderId = await page.locator('label.ng-star-inserted').textContent();
        console.log('UI orderId:', uiOrderId);
    });

});
