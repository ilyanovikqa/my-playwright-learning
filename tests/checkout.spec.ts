import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { users, customer } from "../test-data/users";

const PRODUCT = "sauce-labs-backpack";
const PRODUCT_NAME = "Sauce Labs Backpack";

test.describe("Checkout flow", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory/);
  });

  test("User can complete full checkout flow", async ({ page }) => {

    await test.step("Add product to cart", async () => {
      await inventoryPage.addToCart(PRODUCT);
      await expect(
        inventoryPage.cartBadge,
        "Cart badge should show 1"
      ).toHaveText("1");
    });

    await test.step("Go to cart and verify product", async () => {
      await inventoryPage.goToCart();
      await expect(page, "Should be on cart page").toHaveURL(/cart/);

      await expect(
        page.locator(".cart_item"),
        "Cart should contain exactly 1 item"
      ).toHaveCount(1);

      await expect(
        cartPage.getItemName(PRODUCT_NAME),
        "Cart should show the selected product"
      ).toBeVisible();
    });

    await test.step("Proceed to checkout", async () => {
      await cartPage.checkout();
      await expect(page, "Should be on checkout step one").toHaveURL(/checkout-step-one/);
    });

    await test.step("Fill in customer information", async () => {
      await checkoutPage.fillInfo(
        customer.firstName,
        customer.lastName,
        customer.postalCode
      );
      await expect(page, "Should be on checkout step two").toHaveURL(/checkout-step-two/);
    });

    await test.step("Verify overview page shows selected product", async () => {
      await expect(
        page.locator(".inventory_item_name", { hasText: PRODUCT_NAME }),
        "Overview page should show the selected product"
      ).toBeVisible();

      await expect(
        page.locator(".cart_item"),
        "Overview should show exactly 1 item"
      ).toHaveCount(1);
    });

    await test.step("Complete the order", async () => {
      await checkoutPage.finish();
      await expect(page, "Should be on checkout complete page").toHaveURL(/checkout-complete/);
      await expect(
        checkoutPage.successMessage,
        "Success message should be visible"
      ).toHaveText("Thank you for your order!");
    });
  });
});