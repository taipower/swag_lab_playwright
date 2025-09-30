import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({page}) => {
    await page.goto('https://www.saucedemo.com/', { waitUntil: 'domcontentloaded' });
});

test.describe('Login Feature', () => {
    test('should be see title Swag Labs', async ({page}) => {
        await expect(page).toHaveTitle('Swag Labs');
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
    });

    test('authorize with incorrect username should show error', async ({page}) => {
        const usernameField = page.getByPlaceholder('Username');
        const passwordField = page.getByPlaceholder('Password');
        const loginButton = page.locator('#login-button');

        await usernameField.fill('taipower');
        await passwordField.fill('secret_sauce');

        await loginButton.waitFor({ state: 'visible', timeout: 10000 });
        await loginButton.click();

        const errorMessage = page.locator('[data-test="error"]');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText(
            'Epic sadface: Username and password do not match any user in this service'
        );
    });

    test('authorize with password incorrect should show error', async ({page}) => {
        const usernameField = page.getByPlaceholder('Username');
        const passwordField = page.getByPlaceholder('Password');
        const loginButton = page.locator('#login-button');

        await usernameField.fill('standard_user');
        await passwordField.fill('secret_');

        await loginButton.waitFor({ state: 'visible', timeout: 10000 });
        await loginButton.click();

        const errorMessage = page.locator('[data-test="error"]');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText(
            'Epic sadface: Username and password do not match any user in this service'
        );
    });

    test('login and logout successful', async ({page}) => {
        const usernameField = page.getByPlaceholder('Username');
        const passwordField = page.getByPlaceholder('Password');
        const loginButton = page.locator('#login-button');

        await usernameField.fill('standard_user');
        await passwordField.fill('secret_sauce');

        await loginButton.waitFor({ state: 'visible', timeout: 10000 });
        await loginButton.click();

        await expect(page).toHaveTitle('Swag Labs');

        const burger = page.locator('#react-burger-menu-btn')
        await burger.waitFor({state: 'visible', timeout: 10000});
        await burger.click();

        const logout = page.locator('#logout_sidebar_link');
        await logout.waitFor({state: 'visible', timeout: 10000});
        await logout.click();

        await expect(page).toHaveTitle('Swag Labs');
    });
});

test.describe('Shopping Cart Feature', () => {
    test('Add and remove item to cart', async ({page}) => {
        const usernameField = page.getByPlaceholder('Username');
        const passwordField = page.getByPlaceholder('Password');
        const loginButton = page.locator('#login-button');

        await usernameField.fill('standard_user');
        await passwordField.fill('secret_sauce');

        await loginButton.waitFor({ state: 'visible', timeout: 10000 });
        await loginButton.click();

        await expect(page.locator('.title')).toHaveText('Products');

        const addBackpack = page.locator('#add-to-cart-sauce-labs-backpack');
        const addBikeLight = page.locator('#add-to-cart-sauce-labs-bike-light');

        await addBackpack.click();
        await expect(page.locator('#remove-sauce-labs-backpack')).toBeVisible();

        await addBikeLight.click();
        await expect(page.locator('#remove-sauce-labs-bike-light')).toBeVisible();

        const itemNumber = page.locator('.shopping_cart_badge');
        await expect(itemNumber).toBeVisible();
        await expect(itemNumber).toHaveText('2', { timeout: 10000 });

        const removeBackpack = page.locator('#remove-sauce-labs-backpack');
        await removeBackpack.click();

        await expect(itemNumber).toBeVisible();
        await expect(itemNumber).toHaveText('1', { timeout: 10000 });
    });

    test('your cart', async ({page}) => {
        const usernameField = page.getByPlaceholder('Username');
        const passwordField = page.getByPlaceholder('Password');
        const loginButton = page.locator('#login-button');

        await usernameField.fill('standard_user');
        await passwordField.fill('secret_sauce');

        await loginButton.waitFor({ state: 'visible', timeout: 10000 });
        await loginButton.click();

        await expect(page.locator('.title')).toHaveText('Products');

        const addBackpack = page.locator('#add-to-cart-sauce-labs-backpack');
        const addBikeLight = page.locator('#add-to-cart-sauce-labs-bike-light');

        await addBackpack.click();
        await expect(page.locator('#remove-sauce-labs-backpack')).toBeVisible();

        await addBikeLight.click();
        await expect(page.locator('#remove-sauce-labs-bike-light')).toBeVisible();

        const cart = page.locator('.shopping_cart_link');
        await cart.click();

        await expect(page.locator('.title')).toHaveText('Your Cart');

        const firstQty = page.locator('.cart_quantity').nth(0);
        const secondQty = page.locator('.cart_quantity').nth(1);

        const firstItemName = page.locator('.inventory_item_name').nth(0);
        const secondItemName = page.locator('.inventory_item_name').nth(1);

        const firstItemPrice = page.locator('.inventory_item_price').nth(0);
        const secondItemPrice = page.locator('.inventory_item_price').nth(1);

        await expect(firstQty).toHaveText('1');
        await expect(secondQty).toHaveText('1');

        await expect(firstItemName).toHaveText('Sauce Labs Backpack');
        await expect(secondItemName).toHaveText('Sauce Labs Bike Light');

        const backpackPrice = page.locator('.cart_item', { hasText: 'Sauce Labs Backpack' })
                            .locator('.inventory_item_price');
        await expect(backpackPrice).toHaveText('$29.99');

        const bikeLightPrice = page.locator('.cart_item', { hasText: 'Sauce Labs Bike Light' })
                              .locator('.inventory_item_price');
        await expect(bikeLightPrice).toHaveText('$9.99');
    });

    test('Remove item on cart page', async ({page}) => {
        const usernameField = page.getByPlaceholder('Username');
        const passwordField = page.getByPlaceholder('Password');
        const loginButton = page.locator('#login-button');

        await usernameField.fill('standard_user');
        await passwordField.fill('secret_sauce');

        await loginButton.waitFor({ state: 'visible', timeout: 10000 });
        await loginButton.click();

        await expect(page.locator('.title')).toHaveText('Products');

        const addBackpack = page.locator('#add-to-cart-sauce-labs-backpack');
        const addBikeLight = page.locator('#add-to-cart-sauce-labs-bike-light');

        await addBackpack.click();
        await expect(page.locator('#remove-sauce-labs-backpack')).toBeVisible();

        await addBikeLight.click();
        await expect(page.locator('#remove-sauce-labs-bike-light')).toBeVisible();

        const cart = page.locator('.shopping_cart_link');
        await cart.click();

        await expect(page.locator('.title')).toHaveText('Your Cart');

        const removeBackpack = page.locator('#remove-sauce-labs-backpack');
        await removeBackpack.click();

        const backpackItem = page.getByText('Sauce Labs Backpack');
        await expect(backpackItem).toBeHidden();
    });

    test('Checkout process', async ({page}) => {
        const usernameField = page.getByPlaceholder('Username');
        const passwordField = page.getByPlaceholder('Password');
        const loginButton = page.locator('#login-button');

        await usernameField.fill('standard_user');
        await passwordField.fill('secret_sauce');

        await loginButton.waitFor({ state: 'visible', timeout: 10000 });
        await loginButton.click();

        await expect(page.locator('.title')).toHaveText('Products');

        const addBackpack = page.locator('#add-to-cart-sauce-labs-backpack');
        const addBikeLight = page.locator('#add-to-cart-sauce-labs-bike-light');

        await addBackpack.click();
        await expect(page.locator('#remove-sauce-labs-backpack')).toBeVisible();

        await addBikeLight.click();
        await expect(page.locator('#remove-sauce-labs-bike-light')).toBeVisible();

        const cart = page.locator('.shopping_cart_link');
        await cart.click();

        await expect(page.locator('.title')).toHaveText('Your Cart');

        const checkout = page.locator('#checkout');
        await checkout.click();

        await expect(page.locator('.title')).toHaveText('Checkout: Your Information');

        const firstNameField = page.locator('#first-name');
        const lastNameField = page.locator('#last-name');
        const zipCode = page.locator('#postal-code');

        await firstNameField.fill('Wichian');
        await lastNameField.fill('Chotwattana');
        await zipCode.fill('10260');

        const continueBtn = page.locator('#continue');
        await continueBtn.click();

        await expect(page.locator('.title')).toHaveText('Checkout: Overview');

        const firstQty = page.locator('.cart_quantity').nth(0);
        const secondQty = page.locator('.cart_quantity').nth(1);

        const firstItemName = page.locator('.inventory_item_name').nth(0);
        const secondItemName = page.locator('.inventory_item_name').nth(1);

        const firstItemPrice = page.locator('.inventory_item_price').nth(0);
        const secondItemPrice = page.locator('.inventory_item_price').nth(1);

        await expect(firstQty).toHaveText('1');
        await expect(secondQty).toHaveText('1');

        await expect(firstItemName).toHaveText('Sauce Labs Backpack');
        await expect(secondItemName).toHaveText('Sauce Labs Bike Light');

        const backpackPrice = page.locator('.cart_item', { hasText: 'Sauce Labs Backpack' })
                            .locator('.inventory_item_price');
        await expect(backpackPrice).toHaveText('$29.99');

        const bikeLightPrice = page.locator('.cart_item', { hasText: 'Sauce Labs Bike Light' })
                              .locator('.inventory_item_price');
        await expect(bikeLightPrice).toHaveText('$9.99');

        const shippingInfo = page.locator('[data-test="shipping-info-value"]');
        const totalPrice = page.locator('.summary_subtotal_label');
        const tax = page.locator('.summary_tax_label');
        const total = page.locator('.summary_total_label');

        await expect(shippingInfo).toHaveText('Free Pony Express Delivery!');
        await expect(totalPrice).toHaveText('Item total: $39.98');
        await expect(tax).toHaveText('Tax: $3.20');
        await expect(total).toHaveText('Total: $43.18');

        const finishBtn = page.locator('#finish');
        await finishBtn.click();

        await expect(page.locator('.title')).toHaveText('Checkout: Complete!');

        const thankLabel = page.locator('.complete-header');
        const backToHome = page.locator('#back-to-products');

        await backToHome.click();

        await expect(page.locator('.title')).toHaveText('Products');
    });
})