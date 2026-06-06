import { test, expect } from "@playwright/test";

const BASE_URL = "https://www.saucedemo.com";
const PRODUCT = "sauce-labs-backpack";

const credentials = {
  username: "standard_user",
  password: "secret_sauce",
};

const EXPECTED_ERROR =
  "Epic sadface: Username and password do not match any user in this service";

test.describe("SauceDemo", () => {

  test.describe("Login", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(BASE_URL);
    });

    test("Happy path — valid credentials redirect to inventory page", async ({ page }) => {
      await page.locator("[data-test='username']").fill(credentials.username);
      await page.locator("[data-test='password']").fill(credentials.password);
      await page.locator("[data-test='login-button']").click();

      await expect(page, "Should redirect to inventory page after login").toHaveURL(`${BASE_URL}/inventory.html`);
      await expect(page.locator(".inventory_list"), "Inventory list should be visible after login").toBeVisible();
    });

    test.describe("Negative login", () => {
      test("Wrong password — error message is shown", async ({ page }) => {
        await page.locator("[data-test='username']").fill(credentials.username);
        await page.locator("[data-test='password']").fill("wrong_password");
        await page.locator("[data-test='login-button']").click();

        await expect(page, "Should stay on login page after wrong password").toHaveURL(BASE_URL + "/");
        const error = page.locator("[data-test='error']");
        await expect(error, "Error message should be visible").toBeVisible();
        await expect(error, "Error should mention invalid credentials").toContainText(EXPECTED_ERROR);
      });

      test("Empty username — error message is shown", async ({ page }) => {
        await page.locator("[data-test='password']").fill(credentials.password);
        await page.locator("[data-test='login-button']").click();

        await expect(page, "Should stay on login page when username is empty").toHaveURL(BASE_URL + "/");
        const error = page.locator("[data-test='error']");
        await expect(error, "Error message should be visible").toBeVisible();
        await expect(error, "Error should say username is required").toContainText("Username is required");
      });

      test("Empty password — error message is shown", async ({ page }) => {
        await page.locator("[data-test='username']").fill(credentials.username);
        await page.locator("[data-test='login-button']").click();

        await expect(page, "Should stay on login page when password is empty").toHaveURL(BASE_URL + "/");
        const error = page.locator("[data-test='error']");
        await expect(error, "Error message should be visible").toBeVisible();
        await expect(error, "Error should say password is required").toContainText("Password is required");
      });

      test("Both fields empty — error message is shown", async ({ page }) => {
        await page.locator("[data-test='login-button']").click();

        await expect(page, "Should stay on login page when both fields are empty").toHaveURL(BASE_URL + "/");
        const error = page.locator("[data-test='error']");
        await expect(error, "Error message should be visible").toBeVisible();
        await expect(error, "Error should say username is required").toContainText("Username is required");
      });

      test("locked out user - error message is shown", async ({ page }) => {
      await page.goto("https://www.saucedemo.com");
      await page.locator("[data-test='username']").fill("locked_out_user");
      await page.locator("[data-test='password']").fill("secret_sauce");
      await page.locator("[data-test='login-button']").click();

      const error = page.locator("[data-test='error']");
      await expect(error, "Should show locked out error message").toBeVisible();
      await expect(error, "Should show exact locked out error text").toHaveText(
      "Epic sadface: Sorry, this user has been locked out.");
      });
    });
  }); 

  test.describe("Cart", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(BASE_URL);
      await page.locator("[data-test='username']").fill(credentials.username);
      await page.locator("[data-test='password']").fill(credentials.password);
      await page.locator("[data-test='login-button']").click();
      await expect(page, "Should be on inventory page before each cart test").toHaveURL(`${BASE_URL}/inventory.html`);
    });

    test("Add one product — cart badge shows '1'", async ({ page }) => {
      await page.locator(`[data-test='add-to-cart-${PRODUCT}']`).click();

      const badge = page.locator("[data-test='shopping-cart-badge']");
      await expect(badge, "Cart badge should appear after adding a product").toBeVisible();
      await expect(badge, "Cart badge should show 1 item").toHaveText("1");
    });

    test("Remove product — cart badge disappears", async ({ page }) => {
      await page.locator(`[data-test='add-to-cart-${PRODUCT}']`).click();

      const badge = page.locator("[data-test='shopping-cart-badge']");
      await expect(badge, "Cart badge should appear after adding a product").toBeVisible();
      await expect(badge, "Cart badge should show 1 item").toHaveText("1");

      await page.locator(`[data-test='remove-${PRODUCT}']`).click();

      await expect(badge, "Cart badge should disappear after removing the product").not.toBeVisible();
    });

    test("Multiple products — add 3, badge shows '3', remove 1, badge shows '2'", async ({ page }) => {
      const products = [
        "sauce-labs-backpack",
        "sauce-labs-bike-light",
        "sauce-labs-fleece-jacket",
      ];

      for (const product of products) {
        await page.locator(`[data-test='add-to-cart-${product}']`).click();
      }

      const badge = page.locator("[data-test='shopping-cart-badge']");
      await expect(badge, "Cart badge should show 3 items after adding 3 products").toHaveText("3");

      await page.locator(`[data-test='remove-${products[0]}']`).click();
      await expect(badge, "Cart badge should show 2 items after removing 1 product").toHaveText("2");
    });

    test.describe("Edge cases", () => {
      test("Rapid double-click on Add to cart — item gets added then immediately removed", async ({ page }) => {
        const addButton = page.locator(`[data-test='add-to-cart-${PRODUCT}']`);
        const removeButton = page.locator(`[data-test='remove-${PRODUCT}']`);
        const badge = page.locator("[data-test='shopping-cart-badge']");

        await addButton.dblclick();

        await expect(badge, "Cart badge should not be visible — item was added and removed by double-click").not.toBeVisible();
        await expect(addButton, "Add to cart button should be visible again after double-click").toBeVisible();
        await expect(removeButton, "Remove button should not be visible after double-click").not.toBeVisible();
      });

      test("Fast add/remove cycle — badge disappears cleanly", async ({ page }) => {
        const badge = page.locator("[data-test='shopping-cart-badge']");

        await page.locator(`[data-test='add-to-cart-${PRODUCT}']`).click();
        await expect(badge, "Cart badge should show 1 after first add").toHaveText("1");
        await page.locator(`[data-test='remove-${PRODUCT}']`).click();
        await expect(badge, "Cart badge should disappear after first remove").not.toBeVisible();

        await page.locator(`[data-test='add-to-cart-${PRODUCT}']`).click();
        await expect(badge, "Cart badge should show 1 after second add").toHaveText("1");
        await page.locator(`[data-test='remove-${PRODUCT}']`).click();
        await expect(badge, "Cart badge should disappear after second remove").not.toBeVisible();
      });

      test("Add to cart button changes to Remove after click", async ({ page }) => {
        const addButton = page.locator(`[data-test='add-to-cart-${PRODUCT}']`);
        const removeButton = page.locator(`[data-test='remove-${PRODUCT}']`);

        await expect(addButton, "Add to cart button should be visible before adding").toBeVisible();
        await expect(removeButton, "Remove button should not be visible before adding").not.toBeVisible();

        await addButton.click();

        await expect(addButton, "Add to cart button should disappear after clicking").not.toBeVisible();
        await expect(removeButton, "Remove button should appear after adding product").toBeVisible();
      });

      test("Cart persists after page reload", async ({ page }) => {
        await page.locator(`[data-test='add-to-cart-${PRODUCT}']`).click();

        const badge = page.locator("[data-test='shopping-cart-badge']");
        await expect(badge, "Cart badge should show 1 before reload").toHaveText("1");

        await page.reload();
        await expect(badge, "Cart badge should still show 1 after page reload").toHaveText("1");
      });
    });
  });

  test.describe("Sorting", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(BASE_URL);
      await page.locator("[data-test='username']").fill(credentials.username);
      await page.locator("[data-test='password']").fill(credentials.password);
      await page.locator("[data-test='login-button']").click();
      await expect(page, "Should be on inventory page before each sorting test").toHaveURL(`${BASE_URL}/inventory.html`);
    });

    test("Sort by price low to high — first product changes", async ({ page }) => {
      const firstProduct = page.locator(".inventory_item_name").first();
      const nameBefore = await firstProduct.textContent();

      await page.locator("[data-test='product-sort-container']").selectOption("lohi");

      const nameAfter = await firstProduct.textContent();

      expect(nameAfter, "First product name should change after sorting by price low to high").not.toBe(nameBefore);
    });
  });
});