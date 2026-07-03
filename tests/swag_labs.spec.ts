import { test, expect, type Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.use({
    headless: true,
    launchOptions: {
        slowMo: 500
    }
});

test.beforeEach(async ({page}) => {
    await page.goto('https://www.saucedemo.com/', { waitUntil: 'domcontentloaded' });
});

test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
        await page.screenshot({
            path: `test-results/${testInfo.title}.png`,
            fullPage: true
        });
    }
});

test.describe('Login Feature', () => {
    test('should be see title Swag Labs', async ({page}) => {
        await expect(page).toHaveTitle('Swag Labs');

        await page.screenshot({
            path: 'screenshots/first_page.png',
            fullPage: true
        });
    });

    test('authorize with username and password are empty should error', async ({page}) => {
        const loginButton = page.locator('#login-button');

        await loginButton.waitFor({ state: 'visible', timeout: 10000 });
        await loginButton.click();

        const errorMessage = page.locator('[data-test="error"]');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText(
            'Epic sadface: Username is required'
        );

        await page.screenshot({
            path: 'screenshots/empty_error.png',
            fullPage: true
        });
    });

    test('authorize with username is empty should error', async ({page}) => {
        const passwordField = page.getByPlaceholder('Password');
        const loginButton = page.locator('#login-button');

        await passwordField.fill('secret_sauce');

        await loginButton.waitFor({ state: 'visible', timeout: 10000 });
        await loginButton.click();

        const errorMessage = page.locator('[data-test="error"]');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText(
            'Epic sadface: Username is required'
        );

        await page.screenshot({
            path: 'screenshots/username_empty.png',
            fullPage: true
        });
    });

    test('authorize with password is empty should error', async ({page}) => {
        const usernameField = page.getByPlaceholder('Username');
        const loginButton = page.locator('#login-button');

        await usernameField.fill('secret_sauce');

        await loginButton.waitFor({ state: 'visible', timeout: 10000 });
        await loginButton.click();

        const errorMessage = page.locator('[data-test="error"]');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText(
            'Epic sadface: Password is required'
        );

        await page.screenshot({
            path: 'screenshots/password_empty.png',
            fullPage: true
        });
    });

    test('authorize with incorrect username should show error', async ({page}) => {
        const loginPage = new LoginPage(page);
        await loginPage.login('taipower', 'secret_sauce');

        const errorMessage = page.locator('[data-test="error"]');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText(
            'Epic sadface: Username and password do not match any user in this service'
        );

        await page.screenshot({
            path: 'screenshots/username_incorrect.png',
            fullPage: true
        });
    });

    test('authorize with password incorrect should show error', async ({page}) => {
        const loginPage = new LoginPage(page);
        await loginPage.login('standard_user', 'secret_');

        const errorMessage = page.locator('[data-test="error"]');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText(
            'Epic sadface: Username and password do not match any user in this service'
        );

        await page.screenshot({
            path: 'screenshots/password_incorrect.png',
            fullPage: true
        });
    });

    test('login and logout successful', async ({page}) => {
        const loginPage = new LoginPage(page);
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page.locator('.title')).toHaveText('Products');

        const burger = page.locator('#react-burger-menu-btn')
        await burger.waitFor({state: 'visible', timeout: 10000});
        await burger.click();

        const logout = page.locator('#logout_sidebar_link');
        await logout.waitFor({state: 'visible', timeout: 10000});
        await logout.click();

        await expect(page).toHaveTitle('Swag Labs');

        await page.screenshot({
            path: 'screenshots/after-login.png',
            fullPage: true
        });
    });
});

test.describe('Shopping Cart Feature', () => {
    test('Add and remove item to cart', async ({page}) => {
        const loginPage = new LoginPage(page);
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page.locator('.title')).toHaveText('Products');

        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addBackpackClick();
        await expect(page.locator('#remove-sauce-labs-backpack')).toBeVisible();

        await inventoryPage.addBikeLightClick();
        await expect(page.locator('#remove-sauce-labs-bike-light')).toBeVisible();

        await expect(inventoryPage.itemNumber).toBeVisible();
        await expect(inventoryPage.itemNumber).toHaveText('2', { timeout: 10000 });

        await inventoryPage.removeBackPackClick();

        await expect(inventoryPage.itemNumber).toBeVisible();
        await expect(inventoryPage.itemNumber).toHaveText('1', { timeout: 10000 });

        await page.screenshot({
            path: 'screenshots/add_remove.png',
            fullPage: true
        });
    });

    test('your cart', async ({page}) => {
        const loginPage = new LoginPage(page);
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page.locator('.title')).toHaveText('Products');

        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addBackpackClick();
        await expect(page.locator('#remove-sauce-labs-backpack')).toBeVisible();

        await inventoryPage.addBikeLightClick();
        await expect(page.locator('#remove-sauce-labs-bike-light')).toBeVisible();

        const cartPage = new CartPage(page);
        await cartPage.cartClick();
        await expect(page.locator('.title')).toHaveText('Your Cart');

        const firstQty = cartPage.qtyIndex(0);
        const secondQty = cartPage.qtyIndex(1);

        const firstItemName = inventoryPage.itemNameIndex(0);
        const secondItemName = inventoryPage.itemNameIndex(1);

        await expect(firstQty).toHaveText('1');
        await expect(secondQty).toHaveText('1');

        await expect(firstItemName).toHaveText('Sauce Labs Backpack');
        await expect(secondItemName).toHaveText('Sauce Labs Bike Light');

        await expect(cartPage.backpackPrice).toHaveText('$29.99');
        await expect(cartPage.bikeLightPrice).toHaveText('$9.99');

        await page.screenshot({
            path: 'screenshots/youir_cart.png',
            fullPage: true
        });
    });

    test('Remove item on cart page', async ({page}) => {
        const loginPage = new LoginPage(page);
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page.locator('.title')).toHaveText('Products');

        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addBackpackClick();
        await expect(page.locator('#remove-sauce-labs-backpack')).toBeVisible();

        await inventoryPage.addBikeLightClick();
        await expect(page.locator('#remove-sauce-labs-bike-light')).toBeVisible();

        const cartPage = new CartPage(page);
        await cartPage.cartClick();
        await expect(page.locator('.title')).toHaveText('Your Cart');

        cartPage.removeBackPackClick();

        await expect(cartPage.backpackItem).toBeHidden();

        await page.screenshot({
            path: 'screenshots/remove.png',
            fullPage: true
        });
    });

    test('Checkout process', async ({page}) => {
        const loginPage = new LoginPage(page);
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page.locator('.title')).toHaveText('Products');

        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addBackpackClick();
        await expect(page.locator('#remove-sauce-labs-backpack')).toBeVisible();

        await inventoryPage.addBikeLightClick();
        await expect(page.locator('#remove-sauce-labs-bike-light')).toBeVisible();

        const cartPage = new CartPage(page);
        await cartPage.cartClick();
        await expect(page.locator('.title')).toHaveText('Your Cart');

        const checkoutPage = new CheckoutPage(page);
        await checkoutPage.checkoutClick();
        await expect(page.locator('.title')).toHaveText('Checkout: Your Information');

        await checkoutPage.firstNameFieldFill('Wichian');
        await checkoutPage.lastNameFieldFill('Chotwattana');
        await checkoutPage.zipcodeFieldFill('10260');

        checkoutPage.continueBtnClick();
        await expect(page.locator('.title')).toHaveText('Checkout: Overview');

        const firstQty = cartPage.qtyIndex(0);
        const secondQty = cartPage.qtyIndex(1);

        const firstItemName = inventoryPage.itemNameIndex(0);
        const secondItemName = inventoryPage.itemNameIndex(1);

        await expect(firstQty).toHaveText('1');
        await expect(secondQty).toHaveText('1');

        await expect(firstItemName).toHaveText('Sauce Labs Backpack');
        await expect(secondItemName).toHaveText('Sauce Labs Bike Light');

        await expect(cartPage.backpackPrice).toHaveText('$29.99');
        await expect(cartPage.bikeLightPrice).toHaveText('$9.99');

        await expect(checkoutPage.shippingInfo).toHaveText('Free Pony Express Delivery!');
        await expect(checkoutPage.totalPrice).toHaveText('Item total: $39.98');
        await expect(checkoutPage.tax).toHaveText('Tax: $3.20');
        await expect(checkoutPage.total).toHaveText('Total: $43.18');

        checkoutPage.finishBtnClick();
        await expect(page.locator('.title')).toHaveText('Checkout: Complete!');

        checkoutPage.backToHomeClick();
        await expect(page.locator('.title')).toHaveText('Products');

        await page.screenshot({
            path: 'screenshots/checkout.png',
            fullPage: true
        });
    });
})