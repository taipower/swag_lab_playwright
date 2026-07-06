import { test as base, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

type MyFixtures = {
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
    loggedInPage: void;
}

export const test = base.extend<MyFixtures>({
    loginPage: async({ page }, use) => {
        await use(new LoginPage(page));
    },

    inventoryPage: async({ page }, use) => {
        await use(new InventoryPage(page));
    },

    cartPage: async({ page }, use) => {
        await use(new CartPage(page));
    },

    checkoutPage: async({ page }, use) => {
        await use(new CheckoutPage(page));
    },

    loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await page.goto('/');
    await loginPage.login('standard_user', 'secret_sauce');

    await use();
},
});

export { expect } from '@playwright/test';