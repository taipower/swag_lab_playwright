import { test, expect } from '../fixtures/myFixture';
import { LoginPage } from '../pages/LoginPage';

test.beforeEach(async ({page}) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
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

    test('authorize with username and password are empty should error', async ({
        page,
        loginPage}) => {
        await loginPage.clickLogin();
        
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText(
            'Epic sadface: Username is required'
        );

        await page.screenshot({
            path: 'screenshots/empty_error.png',
            fullPage: true
        });
    });

    test('authorize with username is empty should error', async ({
        page,
        loginPage}) => {
        await loginPage.password.fill('secret_sauce');

        await loginPage.clickLogin();
        
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText(
            'Epic sadface: Username is required'
        );

        await page.screenshot({
            path: 'screenshots/username_empty.png',
            fullPage: true
        });
    });

    test('authorize with password is empty should error', async ({
        page,
        loginPage}) => {
        await loginPage.userName.fill('secret_sauce');

        await loginPage.clickLogin();
        
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText(
            'Epic sadface: Password is required'
        );

        await page.screenshot({
            path: 'screenshots/password_empty.png',
            fullPage: true
        });
    });

    test('authorize with incorrect username should show error', async ({
        page,
        loginPage}) => {
        await loginPage.login('taipower', 'secret_sauce');
        
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText(
            'Epic sadface: Username and password do not match any user in this service'
        );

        await page.screenshot({
            path: 'screenshots/username_incorrect.png',
            fullPage: true
        });
    });

    test('authorize with password incorrect should show error', async ({
        page,
        loginPage}) => {
        await loginPage.login('standard_user', 'secret_');
        
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText(
            'Epic sadface: Username and password do not match any user in this service'
        );

        await page.screenshot({
            path: 'screenshots/password_incorrect.png',
            fullPage: true
        });
    });

    test('login and logout successful', async ({
        page,
        loginPage}) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page.locator('.title')).toHaveText('Products');

        await loginPage.logout();

        await expect(page).toHaveTitle('Swag Labs');

        await page.screenshot({
            path: 'screenshots/after-login.png',
            fullPage: true
        });
    });
});