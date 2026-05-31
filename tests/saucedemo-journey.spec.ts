import { test, expect } from "@playwright/test";

const BASE_URL = "https://www.saucedemo.com";

const credentials = {
  username: "standard_user",
  password: "secret_sauce",
};

const PRODUCTS = [
  "sauce-labs-backpack",
  "sauce-labs-bike-light",
];

async function login(page) {
  await page.goto(BASE_URL);
  await page.locator("[data-test='username']").fill(credentials.username);
  await page.locator("[data-test='password']").fill(credentials.password);
  await page.locator("[data-test='login-button']").click();
  await expect(page, "Should land on inventory page after login").toHaveURL(`${BASE_URL}/inventory.html`);
}

test.describe("SauceDemo — Full Journey", () => {

  test.describe("Login", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(BASE_URL);
    });

    test("Valid user can log in and see inventory page", async ({ page }) => {
      await page.locator("[data-test='username']").fill(credentials.username);
      await page.locator("[data-test='password']").fill(credentials.password);
      await page.locator("[data-test='login-button']").click();

      await expect(page, "Should redirect to inventory page").toHaveURL(`${BASE_URL}/inventory.html`);
      await expect(page.locator(".inventory_list"), "Inventory list should be visible").toBeVisible();
    });

    test("Locked user cannot log in and sees correct error", async ({ page }) => {
      await page.locator("[data-test='username']").fill("locked_out_user");
      await page.locator("[data-test='password']").fill("secret_sauce");
      await page.locator("[data-test='login-button']").click();

      await expect(page, "Should stay on login page").toHaveURL(BASE_URL + "/");
      const error = page.locator("[data-test='error']");
      await expect(error, "Error message should be visible").toBeVisible();
      await expect(error, "Should show locked out error").toHaveText(
        "Epic sadface: Sorry, this user has been locked out."
      );
    });
  });

  test.describe("Cart", () => {
    test.beforeEach(async ({ page }) => {
      await login(page);
    });

    test("User can add two products and verify badge count", async ({ page }) => {
      for (const product of PRODUCTS) {
        await page.locator(`[data-test='add-to-cart-${product}']`).click();
      }

      const badge = page.locator("[data-test='shopping-cart-badge']");
      await expect(badge, "Cart badge should show 2 items").toHaveText("2");
    });

    test("User can remove one product and verify cart updates", async ({ page }) => {
      for (const product of PRODUCTS) {
        await page.locator(`[data-test='add-to-cart-${product}']`).click();
      }

      const badge = page.locator("[data-test='shopping-cart-badge']");
      await expect(badge, "Cart badge should show 2 items after adding").toHaveText("2");

      await page.locator(`[data-test='remove-${PRODUCTS[0]}']`).click();
      await expect(badge, "Cart badge should show 1 item after removing one").toHaveText("1");
    });
  });

  test.describe("Checkout", () => {
    test.beforeEach(async ({ page }) => {
      await login(page);

      for (const product of PRODUCTS) {
        await page.locator(`[data-test='add-to-cart-${product}']`).click();
      }
    });

    test("User can complete checkout and see success message", async ({ page }) => {
 
      await page.locator("[data-test='shopping-cart-link']").click();
      await expect(page, "Should be on cart page").toHaveURL(`${BASE_URL}/cart.html`);

      await page.locator("[data-test='checkout']").click();
      await expect(page, "Should be on checkout step one").toHaveURL(`${BASE_URL}/checkout-step-one.html`);

      await page.locator("[data-test='firstName']").fill("John");
      await page.locator("[data-test='lastName']").fill("Doe");
      await page.locator("[data-test='postalCode']").fill("12345");
      await page.locator("[data-test='continue']").click();

      await expect(page, "Should be on checkout step two").toHaveURL(`${BASE_URL}/checkout-step-two.html`);

      await page.locator("[data-test='finish']").click();

      await expect(page, "Should be on checkout complete page").toHaveURL(`${BASE_URL}/checkout-complete.html`);
      await expect(
        page.locator("[data-test='complete-header']"),
        "Success message should be visible"
      ).toHaveText("Thank you for your order!");
    });
  });
});