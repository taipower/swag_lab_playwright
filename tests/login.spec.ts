import { test, expect } from '../fixtures/myFixture';
import { loginData } from '../data/loginData';

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

for (const data of loginData) {
  test(data.name, async ({ loginPage }) => {
    await loginPage.login(data.username, data.password);

    await expect(loginPage.errorMessage).toHaveText(data.expected);
  });
}

test.describe('Login Feature', () => {
    test('should be see title Swag Labs', async ({page}) => {
        await expect(page).toHaveTitle('Swag Labs');

        await page.screenshot({
            path: 'screenshots/first_page.png',
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