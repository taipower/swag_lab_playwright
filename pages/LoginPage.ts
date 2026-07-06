import { Locator, Page } from "@playwright/test";

export class LoginPage {
    constructor(private page: Page) {}

    get userName(): Locator {
        return this.page.getByPlaceholder('Username');
    }

    get password(): Locator {
        return this.page.getByPlaceholder('Password');
    }

    get loginButton(): Locator {
        return this.page.locator('#login-button');
    }

    get errorMessage(): Locator {
        return this.page.locator('[data-test="error"]');
    }

    get burgerMenu(): Locator {
        return this.page.locator('#react-burger-menu-btn');
    }

    get logoutButton(): Locator {
        return this.page.locator('#logout_sidebar_link');
    }


    async login(username: string, password: string) {
        await this.userName.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
    }

    async clickLogin() {
        await this.loginButton.click();
    }

    async logout() {
        await this.burgerMenu.click();
        await this.logoutButton.click();
    }
}