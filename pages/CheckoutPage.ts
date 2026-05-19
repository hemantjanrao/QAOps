import { Locator, Page } from "@playwright/test";

export class CheckoutPage {

    private readonly products: Locator;

    constructor(private page: Page) {
        this.products = page.locator('.card-body');
    }

    async checkout(productName: string) {
        
        await this.products.first().waitFor({ state: 'visible', timeout: 5000 });
        const count = await this.products.count();

        for (let i = 0; i < count; i++) {
            const product = this.products.nth(i);
            const productNameText = await product.locator('b').textContent();
            if (productNameText && productNameText.includes(productName)) {
                await product.getByText('Add To Cart').click();
            }
        }

        await this.page.locator("[routerlink*='/dashboard/cart']").click();

        await this.page.locator('.cart').waitFor({ state: 'visible', timeout: 5000 });
        await this.page.locator("div[class='cartSection'] h3").textContent()

        await this.page.getByRole('button', { name: 'Checkout' }).click();
        await this.page.locator('[placeholder*="Country"]').pressSequentially('ind', { delay: 100 });

        const dropdown = await this.page.locator('.ta-results');
        await dropdown.waitFor({ state: 'visible', timeout: 5000 });

        const buttons = await dropdown.locator('button').allTextContents();

        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].trim() === 'India') {
                await dropdown.locator('button').nth(i).click();
                break;
            }
        }

        await this.page.locator('.actions').locator('a').first().click();

        await this.page.locator('h1.hero-primary').waitFor({ state: 'visible', timeout: 5000 });
    }
}

module.exports = { CheckoutPage };