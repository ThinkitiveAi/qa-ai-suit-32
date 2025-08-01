// patient-registration.spec.ts
import { test } from '@playwright/test';
import { LoginPage } from '../tests-examples/LoginPage';

test.describe('Patient Registration – Mandatory Fields', () => {
  test('Successful login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('tomsmith', 'SuperSecretPassword!');
    await loginPage.assertLoginSuccess();
  });

  test('Failed login with invalid username', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('invaliduser', 'SuperSecretPassword!');
    await loginPage.assertLoginFailure('Your username is invalid!');
  });

  test('Failed login with invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('tomsmith', 'WrongPassword!');
    await loginPage.assertLoginFailure('Your password is invalid!');
  });

  test('Verify error messages appear correctly', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('invaliduser', 'WrongPassword!');
    await loginPage.assertLoginFailure('Your username is invalid!');
    await loginPage.goto();
    await loginPage.login('tomsmith', 'WrongPassword!');
    await loginPage.assertLoginFailure('Your password is invalid!');
  });
});