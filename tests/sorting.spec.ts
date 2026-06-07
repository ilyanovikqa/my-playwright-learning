import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { users } from "../test-data/users";

test.describe("Product sorting", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory/);
  });

  test("Products are sorted by price low to high", async () => {
    await test.step("Select price low to high from dropdown", async () => {
      await inventoryPage.sortBy("lohi");
    });

    await test.step("Collect all prices from the page", async () => {
      const prices = await inventoryPage.getPrices();

      expect(
        prices.length,
        "Should find at least one price on the page"
      ).toBeGreaterThan(0);

      prices.forEach((price) => {
        expect(
          isNaN(price),
          `Price ${price} should be a valid number`
        ).toBe(false);
      });

      const sorted = [...prices].sort((a, b) => a - b);
      expect(
        prices,
        `Prices should be in ascending order. Got: ${prices}`
      ).toEqual(sorted);
    });
  });
});