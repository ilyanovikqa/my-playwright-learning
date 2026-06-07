import { type Locator, type Page } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.locator("[data-test='checkout']");
  }

  getItemName(productName: string) {
    return this.page.locator(".inventory_item_name", { hasText: productName });
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}