import { Page,expect } from "@playwright/test";

export class InventoryPage {
    constructor(private page: Page) {}

    get addBackpack() {
        return this.page.locator('#add-to-cart-sauce-labs-backpack');
    }

    get addBikeLight() {
        return this.page.locator('#add-to-cart-sauce-labs-bike-light');
    }

    get cart() {
        return this.page.locator('.shopping_cart_link');
    }

    get itemNumber() {
        return this.page.locator('.shopping_cart_badge');
    }

    get removeBackPack() {
        return this.page.locator('#remove-sauce-labs-backpack');
    }

    get itemName() {
        return this.page.locator('.inventory_item_name');
    }

    get itemPrice() {
        return this.page.locator('.inventory_item_price');
    }

    async addBackpackClick() {
        await this.addBackpack.click();
    }

    async addBikeLightClick() {
        await this.addBikeLight.click();
    }

    async removeBackPackClick() {
        await this.removeBackPack.click();
    }

    async addItem() {
        await this.addBackpack.click();
        await this.addBikeLight.click();
    }

    async openCart() {
        await this.cart.click();
    }

    itemNameIndex(index: number) {
        return this.itemName.nth(index);
    }

    itemPriceIndex(index: number) {
        return this.itemPrice.nth(index);
    }

    async verifyItems(items: InventoryItem[]) {
        for (const [index, item] of items.entries()) {
            await expect(this.itemNameIndex(index)).toHaveText(item.name);
            await expect(this.itemPriceIndex(index)).toHaveText(item.price);
        }
    }
}

export interface InventoryItem {
    name: string;
    price: string;
    quantity: string;
}