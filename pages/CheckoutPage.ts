import { Page } from "@playwright/test";

export class CheckoutPage {
    constructor(private page: Page) {}

    get checkout() {
        return this.page.locator('#checkout');
    }

    get firstName() {
        return this.page.locator('#first-name');
    }

    get lastname() {
        return this.page.locator('#last-name');
    }

    get zipcode() {
        return this.page.locator('#postal-code');
    }

    get continueBtn() {
        return this.page.locator('#continue');
    }

    get shippingInfo() {
        return this.page.locator('[data-test="shipping-info-value"]');
    }

    get totalPrice() {
        return this.page.locator('.summary_subtotal_label');
    }

    get tax() {
        return this.page.locator('.summary_tax_label');
    }

    get total() {
        return this.page.locator('.summary_total_label');
    }

    get finishBtn() {
        return this.page.locator('#finish');
    }

    get thankLabel() {
        return this.page.locator('.complete-header');
    }

    get backToHome() {
        return this.page.locator('#back-to-products');
    }

    async checkoutClick() {
        await this.checkout.click();
    }

    async firstNameFieldFill(name: string) {
        await this.firstName.fill(name);
    }

    async lastNameFieldFill(lastname: string) {
        await this.lastname.fill(lastname);
    }

    async zipcodeFieldFill(zipcode: string) {
        await this.zipcode.fill(zipcode);
    }

    async continueBtnClick() {
        await this.continueBtn.click();
    }

    async finishBtnClick() {
        await this.finishBtn.click();
    }

    async backToHomeClick() {
        await this.backToHome.click();
    }
}