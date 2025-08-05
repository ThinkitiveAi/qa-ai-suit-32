import { test, expect } from '@playwright/test';

test('Complete Healthcare Provider Workflow', async ({ page }) => {
  // 1. Login to the application
  await page.goto('https://stage_aithinkitive.uat.provider.ecarehealth.com/auth/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('rose.gomez@jourrapide.com');
  await page.getByRole('textbox', { name: '*********' }).click();
  await page.getByRole('textbox', { name: '*********' }).fill('Pass@123');
  await page.getByRole('button', { name: 'Let\'s get Started' }).click();

 
 
  // 5. Appointment Booking - Create a new appointment for the patient
  await page.getByRole('banner').getByTestId('ExpandMoreIcon').click();
  await page.getByText('New Appointment').click();

  // Fill appointment details
  await page.getByRole('combobox', { name: 'Patient Name *' }).click();
  await page.getByRole('option', { name: 'Roumy Van 3 Feb' }).click();
  await page.getByRole('combobox', { name: 'Appointment Type *' }).click();
  await page.getByRole('option', { name: 'New Patient Visit' }).click();
  await page.getByRole('textbox', { name: 'Reason For Visit *' }).click();
  await page.getByRole('textbox', { name: 'Reason For Visit *' }).fill('Fever');
  await page.locator('form').filter({ hasText: 'Timezone *Timezone *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: 'Alaska Standard Time (GMT -09:00)' }).click();
  await page.getByRole('button', { name: 'Telehealth' }).click();

  // Select provider and schedule appointment
    await page.getByRole('combobox', { name: 'Provider *' }).click();
   await page.getByRole('combobox', { name: 'Provider *' }).fill('Clavin tim');
   await page.getByRole('option', { name: 'Clavin Tim' }).click();
 // await page.getByRole('option', { name: 'Clavin Tim' }).click();
  await page.getByRole('button', { name: 'View availability' }).click({
    button: 'right'
  });
  await page.getByRole('button', { name: 'View availability' }).click();
  //await page.getByRole('gridcell', { name: '3' }).click();
    await page.getByRole('gridcell', { name: '6', exact: true }).click();
  await page.getByRole('button', { name: '12:00 AM - 12:30 AM' }).click();
  await page.getByRole('button', { name: 'Save And Close' }).click();
   await page.getByTestId('PersonIcon').locator('path').click();
  await page.getByText('Log Out').click();
  await page.getByRole('button', { name: 'Yes,Sure' }).click();
});