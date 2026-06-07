import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { users } from "../test-data/users";

const PRODUCT = "sauce-labs-backpack";
const PRODUCT_NAME = "Sauce Labs Backpack";
const PRODUCTS = ["sauce-labs-backpack", "sauce-labs-bike-light"];

test.describe("Cart behavior", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory/);
  });

  test("Cart badge shows correct count after adding a product", async () => {
    await inventoryPage.addToCart(PRODUCT);

    await expect(
      inventoryPage.cartBadge,
      "Cart badge should show 1 after adding one product"
    ).toHaveText("1");
  });

  test("Cart page shows the name of the selected product", async ({ page }) => {
    await inventoryPage.addToCart(PRODUCT);
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);

    await expect(
      page.locator(".cart_item"),
      "Cart should contain exactly 1 item"
    ).toHaveCount(1);

    await expect(
      cartPage.getItemName(PRODUCT_NAME),
      "Cart page should show the product name"
    ).toBeVisible();
  });

  test("Removing a product makes badge disappear", async () => {
    await inventoryPage.addToCart(PRODUCT);
    await expect(
      inventoryPage.cartBadge,
      "Badge should show 1 before removing"
    ).toHaveText("1");

    await inventoryPage.removeFromCart(PRODUCT);
    await expect(
      inventoryPage.cartBadge,
      "Cart badge should disappear after removing the product"
    ).not.toBeVisible();
  });

  test("Adding multiple products shows correct badge count", async ({ page }) => {
    for (const product of PRODUCTS) {
      await inventoryPage.addToCart(product);
    }

    await expect(
      inventoryPage.cartBadge,
      "Cart badge should show 2 after adding 2 products"
    ).toHaveText("2");

    await inventoryPage.goToCart();
    await expect(
      page.locator(".cart_item"),
      "Cart should contain exactly 2 items"
    ).toHaveCount(2);
  });
});