import { test, expect } from '@playwright/test';

test('add-to-cart', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');
  await page.locator('[data-test="Cappuccino"]').click();
  await page.getByRole('link', { name: 'Cart page' }).click();
  await expect(page.getByLabel('Cart')).toHaveText('cart (1)');
});

test('total-price', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');
  await page.locator('[data-test="Espresso"]').click();
  await page.locator('[data-test="Cappuccino"]').click();
  await expect(page.locator('[data-test="checkout"]')).toHaveText('Total: $29.00');
  await expect(page.locator('[data-test="checkout"]')).toContainText('$29.00');
});

test('payment-form', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');
  await page.locator('[data-test="checkout"]').click();
  await page.getByRole('textbox', { name: 'Name' }).fill('test');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('test@gmail.com');
  await expect (page.getByLabel('Name')).toHaveValue('test');
  await expect (page.getByLabel('Email')).toHaveValue('test@gmail.com');
});

test('empty-cart', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');
  await page.getByRole('link', { name: 'Cart page' }).click();
  await expect (page.getByText('No coffee, go add some.')).toBeVisible();
});

test('promo-offer', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');
  await page.locator('[data-test="Espresso_Macchiato"]').click();
  await page.locator('[data-test="Espresso"]').click();
  await page.locator('[data-test="Cappuccino"]').click();
  await expect (page.getByText('It\'s your lucky day! Get an extra cup of Mocha for $4.espressochocolate')).toBeVisible();
});