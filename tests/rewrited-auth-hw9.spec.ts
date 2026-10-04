import { test, expect } from "@playwright/test";

const uniqueEmail = () => `student-${Date.now()}-${Math.random()}@example.com`;

test.describe("User registration", () => {
  test("Successful registration with valid credentials", async ({ page }) => {
    const usernameInput = page.getByLabel(/username/i);
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByTestId("auth-password");
    const confirmPasswordInput = page.getByTestId("register-confirm-password");
    //check checkbox
    const termsCheckbox = page.getByTestId("register-terms");
    const submitButton = page.getByTestId("auth-submit");

    const profileLink = page.getByTestId("nav-profile");

    await page.goto("/register");
    await usernameInput.fill(`student-${Date.now()}`);
    await emailInput.fill(uniqueEmail());
    await passwordInput.fill("ValidPassword123!");
    await confirmPasswordInput.fill("ValidPassword123!");
    await termsCheckbox.check();
    await submitButton.click();

    await expect(profileLink).toBeVisible();
  });

  test("Registration with an already used email", async ({ page }) => {
    const usernameInput = page.getByTestId("auth-username");
    const emailInput = page.getByTestId("auth-email");
    const passwordInput = page.getByTestId("auth-password");
    const confirmPasswordInput = page.getByTestId("register-confirm-password");
    const termsCheckbox = page.getByTestId("register-terms");
    const submitButton = page.getByTestId("auth-submit");
    const errorMessage = page.getByText("body email або username вже зайняті");

    await page.goto("/register");
    await usernameInput.fill("test1234");
    await emailInput.fill("olena@example.com");
    await passwordInput.fill("password");
    await confirmPasswordInput.fill("password");
    await termsCheckbox.check();
    await submitButton.click();

    await expect(errorMessage).toBeVisible();
  });

  test("Registration with empty email", async ({ page }) => {
    const usernameInput = page.getByTestId("auth-username");
    const emailInput = page.getByTestId("auth-email");
    const passwordInput = page.getByTestId("auth-password");
    const confirmPasswordInput = page.getByTestId("register-confirm-password");
    const termsCheckbox = page.getByTestId("register-terms");
    const submitButton = page.getByTestId("auth-submit");
    const errorMessage = page.getByText("email некоректний email");

    await page.goto("/register");
    await usernameInput.fill("test1234");
    await emailInput.fill("");
    await passwordInput.fill("password");
    await confirmPasswordInput.fill("password");
    await termsCheckbox.check();
    await submitButton.click();

    await expect(errorMessage).toBeVisible();
  });
});

test.describe("Login", () => {
  test("Successful login", async ({ page }) => {
    const emailInput = page.getByTestId("auth-email");
    const passwordInput = page.getByTestId("auth-password");
    const submitButton = page.getByTestId("auth-submit");
    const profileLink = page.getByTestId("nav-profile");

    await page.goto("/login");
    await emailInput.fill("olena@example.com");
    await passwordInput.fill("password");
    await submitButton.click();

    await expect(page).toHaveURL("/articles");
    await expect(profileLink).toContainText("olena");
  });

  test("Login with invalid password", async ({ page }) => {
    const emailInput = page.getByTestId("auth-email");
    const passwordInput = page.getByTestId("auth-password");
    const submitButton = page.getByTestId("auth-submit");
    const errorMessages = page.getByTestId("error-messages");

    await page.goto("/login");
    await emailInput.fill("olena@example.com");
    await passwordInput.fill("wrongpassword");
    await submitButton.click();

    await expect(errorMessages).toHaveText("email or password неправильні");
  });

  test("Login with non-existent user", async ({ page }) => {
    const emailInput = page.getByTestId("auth-email");
    const passwordInput = page.getByTestId("auth-password");
    const submitButton = page.getByTestId("auth-submit");
    const errorMessages = page.getByTestId("error-messages");

    await page.goto("/login");
    await emailInput.fill("nonexistent@example.com");
    await passwordInput.fill("password");
    await submitButton.click();

    await expect(errorMessages).toHaveText("email or password неправильні");
  });
});
