import { test, expect } from '../fixtures/myFixture';
import { cartData } from '../data/cartData';
import { checkoutData } from '../data/checkoutData';
import { inventoryData } from '../data/inventoryData';

test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
        await page.screenshot({
            path: `test-results/${testInfo.title}.png`,
            fullPage: true,
        });
    }
});

test.describe('Shopping Cart Feature', () => {

    for (const data of cartData) {

        test(data.title, async ({
            page,
            loggedInPage: _,
            inventoryPage,
            cartPage
        }) => {

            await expect(page.locator('.title')).toHaveText('Products');

            await inventoryPage.addItem();

            await expect(inventoryPage.itemNumber).toHaveText('2');

            if (data.remove) {
                await inventoryPage.removeBackPackClick();
                await expect(inventoryPage.itemNumber).toHaveText(data.afterRemoveItemCount);
                return;
            }

            await cartPage.cartClick();

            await expect(page.locator('.title')).toHaveText('Your Cart');

            await expect(cartPage.qtyIndex(0)).toHaveText('1');
            await expect(cartPage.qtyIndex(1)).toHaveText('1');

            await inventoryPage.verifyItems(inventoryData.items);
        });
    }

    for (const data of checkoutData) {

        test('Checkout Process', async ({
            page,
            loggedInPage: _,
            inventoryPage,
            cartPage,
            checkoutPage
        }) => {

            await inventoryPage.addItem();

            await cartPage.cartClick();

            await checkoutPage.checkoutClick();

            await expect(page.locator('.title'))
                .toHaveText('Checkout: Your Information');

            await checkoutPage.firstNameFieldFill(data.customer.firstName);
            await checkoutPage.lastNameFieldFill(data.customer.lastName);
            await checkoutPage.zipcodeFieldFill(data.customer.zipCode);

            await checkoutPage.continueBtnClick();

            await expect(page.locator('.title'))
                .toHaveText('Checkout: Overview');

            await expect(checkoutPage.shippingInfo)
                .toHaveText(data.summary.shipping);

            await expect(checkoutPage.totalPrice)
                .toHaveText(data.summary.subtotal);

            await expect(checkoutPage.tax)
                .toHaveText(data.summary.tax);

            await expect(checkoutPage.total)
                .toHaveText(data.summary.total);

            await checkoutPage.finishBtnClick();

            await expect(page.locator('.title'))
                .toHaveText('Checkout: Complete!');

            await checkoutPage.backToHomeClick();

            await expect(page.locator('.title'))
                .toHaveText('Products');
        });
    }

    test('Remove item on cart page', async ({
        page,
        loggedInPage: _,
        inventoryPage,
        cartPage
    }) => {

        await inventoryPage.addItem();

        await cartPage.cartClick();

        await cartPage.removeBackPackClick();

        await expect(cartPage.backpackItem).toBeHidden();
    });

});