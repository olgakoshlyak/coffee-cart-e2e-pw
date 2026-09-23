import { test, expect } from '@playwright/test';

const uniqueEmail = () => `student-${Date.now()}-${Math.random()}@example.com`;

test.describe('User registration', () => {
  test('Successful registration with valid credentials', async ({ page }) => {
    await page.goto('/register');
    await page.getByLabel(/username/i).fill(`student-${Date.now()}`);
    await page.getByLabel(/email/i).fill(uniqueEmail());
// Password і Confirm password мають однаковий лейбл "Password",
// тому розрізняємо їх через data-testid
    await page.getByTestId('auth-password').fill('ValidPassword123!');
    await page.getByTestId('register-confirm-password').fill('ValidPassword123!');
// Check checkbox "I agree to the Terms of Service" через data-testid
    await page.getByTestId('register-terms').check();
    await page.getByTestId('auth-submit').click();

    await expect(page.getByTestId('nav-profile')).toBeVisible();
  });

  test('Registration with an already used email', async ({ page }) => {
    await page.goto('/register');
    await page.getByTestId('auth-username').fill('test1234');
    await page.getByTestId('auth-email').fill('olena@example.com');
    await page.getByTestId('auth-password').fill('password');
    await page.getByTestId('register-confirm-password').fill('password');
    await page.getByTestId('register-terms').check();
    await page.getByTestId('auth-submit').click();
    
    await expect(page.getByText('body email або username вже зайняті')).toBeVisible();
  });

  test('Registration with empty email', async ({ page }) => {
    await page.goto('/register');
    await page.getByTestId('auth-username').fill('test1234');
    await page.getByTestId('auth-email').fill('');
    await page.getByTestId('auth-password').fill('password');
    await page.getByTestId('register-confirm-password').fill('password');
    await page.getByTestId('register-terms').check();
    await page.getByTestId('auth-submit').click();
    
    await expect(page.getByText('email некоректний email')).toBeVisible();
  });
});

test.describe('Login', () => {
  test('Successful login', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('auth-email').fill('olena@example.com');
    await page.getByTestId('auth-password').fill('password');
    await page.getByTestId('auth-submit').click();

    await expect(page).toHaveURL('/articles');
    await expect(page.getByTestId('nav-profile')).toContainText('olena');
  });

  test('Login with invalid password', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('auth-email').fill('olena@example.com');
    await page.getByTestId('auth-password').fill('wrongpassword');
    await page.getByTestId('auth-submit').click();

    await expect(page.getByTestId('error-messages')).toHaveText('email or password неправильні');
  });

  test('Login with non-existent user', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('auth-email').fill('nonexistent@example.com');
    await page.getByTestId('auth-password').fill('password');
    await page.getByTestId('auth-submit').click();

    await expect(page.getByTestId('error-messages')).toHaveText('email or password неправильні');
  });
});