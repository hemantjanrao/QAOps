import { Locator, Page } from "@playwright/test";

export class LoginPage {

    private readonly username: Locator;
    private readonly password: Locator;
    private readonly loginButton: Locator;

    constructor(private page: Page) {
        this.username = page.locator('#userEmail');
        this.password = page.locator('#userPassword');
        this.loginButton = page.locator('#login');
    }

    async goto() {
        await this.page.goto("https://rahulshettyacademy.com/client/#/dashboard/products");
    }

    async login(email: string, password: string) {
        await this.username.fill(email);
        await this.password.fill(password);
        await this.loginButton.click();
    }
}
module.exports = { LoginPage };