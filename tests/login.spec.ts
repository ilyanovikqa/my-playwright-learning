import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { users } from "../test-data/users";

test.describe("Login regression", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
  });

  test("standard_user can log in and sees inventory page", async ({ page }) => {
    await loginPage.login(users.standard.username, users.standard.password);

    await expect(page, "Should redirect to inventory page").toHaveURL(/inventory/);
    await expect(page.locator(".inventory_list"), "Inventory list should be visible").toBeVisible();
  });

  test("locked_out_user cannot log in and sees correct error", async () => {
    await loginPage.login(users.locked.username, users.locked.password);

    await expect(
      loginPage.errorMessage,
      "Should show locked out error"
    ).toContainText("Sorry, this user has been locked out.");
  });

  test("Wrong password shows error message", async () => {
    await loginPage.login(users.standard.username, "wrong_password");

    await expect(
      loginPage.errorMessage,
      "Should show invalid credentials error"
    ).toContainText("Username and password do not match");
  });

  test("Empty username shows validation error", async () => {
    await loginPage.login("", users.standard.password);

    await expect(
      loginPage.errorMessage,
      "Should show username required error"
    ).toContainText("Username is required");
  });
});