import { test, expect } from '@playwright/test';

test('Patient Registration – Mandatory Fields: Successful login with valid credentials', async ({ page }) => {
  // Go to the login page
  await page.goto('https://practicetestautomation.com/practice-test-login/');

  // Enter username
  await page.click('input#username');
  await page.fill('input#username', 'student');

  // Enter password
  await page.click('input#password');
  await page.fill('input#password', 'Password123');

  // Click the submit button
  await page.click('button#submit');

  // Assert successful login by checking for a success message or redirected page
  await expect(page).toHaveURL(/.*practicetestautomation\.com\/logged-in-successfully/);
  await expect(page.locator('h1')).toHaveText('Logged In Successfully');
  await expect(page.locator('.post-content')).toContainText('Congratulations student. You successfully logged in!');
});