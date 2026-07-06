import { test, expect } from '../fixtures/myFixture';

test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
        await page.screenshot({
            path: `test-results/${testInfo.title}.png`,
            fullPage: true
        });
    }
});

test.describe('Shopping Cart Feature', () => {
    test('Add and remove item to cart', async ({
        page,
        loggedInPage: _,
        inventoryPage}) => {
        await expect(page.locator('.title')).toHaveText('Products');

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

    test('your cart', async ({
        page,
        loggedInPage: _,
        inventoryPage,
        cartPage}) => {
        await expect(page.locator('.title')).toHaveText('Products');

        await inventoryPage.addBackpackClick();
        await expect(page.locator('#remove-sauce-labs-backpack')).toBeVisible();

        await inventoryPage.addBikeLightClick();
        await expect(page.locator('#remove-sauce-labs-bike-light')).toBeVisible();

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

    test('Remove item on cart page', async ({
        page,
        loggedInPage: _,
        inventoryPage,
        cartPage}) => {
        await expect(page.locator('.title')).toHaveText('Products');

        await inventoryPage.addBackpackClick();
        await expect(page.locator('#remove-sauce-labs-backpack')).toBeVisible();

        await inventoryPage.addBikeLightClick();
        await expect(page.locator('#remove-sauce-labs-bike-light')).toBeVisible();

        await cartPage.cartClick();
        await expect(page.locator('.title')).toHaveText('Your Cart');

        cartPage.removeBackPackClick();

        await expect(cartPage.backpackItem).toBeHidden();

        await page.screenshot({
            path: 'screenshots/remove.png',
            fullPage: true
        });
    });

    test('Checkout process', async ({
        page,
        loggedInPage: _,
        inventoryPage,
        cartPage,
        checkoutPage}) => {
        await expect(page.locator('.title')).toHaveText('Products');

        await inventoryPage.addBackpackClick();
        await expect(page.locator('#remove-sauce-labs-backpack')).toBeVisible();

        await inventoryPage.addBikeLightClick();
        await expect(page.locator('#remove-sauce-labs-bike-light')).toBeVisible();

        await cartPage.cartClick();
        await expect(page.locator('.title')).toHaveText('Your Cart');

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