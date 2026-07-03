import { Page } from "@playwright/test";

export class LoginPage {
    constructor(private page: Page) {}

    get userName() {
        return this.page.getByPlaceholder('Username');
    }

    get password() {
        return this.page.getByPlaceholder('Password');
    }

    get loginButton() {
        return this.page.locator('#login-button');
    }

    async login(username: string, password: string) {
        await this.userName.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
    }
}