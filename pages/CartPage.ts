import { Page } from "@playwright/test";

export class CartPage {
    constructor(private page: Page) {}

    get cart() {
        return this.page.locator('.shopping_cart_link');
    }

    get quantity() {
        return this.page.locator('.cart_quantity');
    }

    get backpackPrice() {
        return this.page.locator('.cart_item', { hasText: 'Sauce Labs Backpack' })
                            .locator('.inventory_item_price');
    }

    get bikeLightPrice() {
        return this.page.locator('.cart_item', { hasText: 'Sauce Labs Bike Light' })
                              .locator('.inventory_item_price');
    }

    get removeBackPack() {
        return this.page.locator('#remove-sauce-labs-backpack');
    }

    get backpackItem() {
        return this.page.getByText('Sauce Labs Backpack');
    }

    async cartClick() {
        await this.cart.click();
    }

    async removeBackPackClick() {
        await this.removeBackPack.click();
    }

    qtyIndex(index: number) {
        return this.quantity.nth(index);
    }
}