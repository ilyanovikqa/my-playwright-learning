import { type Locator, type Page } from "@playwright/test";

export class InventoryPage {
  readonly page: Page;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.locator("[data-test='shopping-cart-badge']");
    this.cartLink = page.locator("[data-test='shopping-cart-link']");
    this.sortDropdown = page.locator("[data-test='product-sort-container']");
  }

  async addToCart(product: string) {
    await this.page.locator(`[data-test='add-to-cart-${product}']`).click();
  }

  async removeFromCart(product: string) {
    await this.page.locator(`[data-test='remove-${product}']`).click();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async sortBy(option: "az" | "za" | "lohi" | "hilo") {
    await this.sortDropdown.selectOption(option);
  }

  async getPrices(): Promise<number[]> {
    const priceLocators = this.page.locator(".inventory_item_price");
    const priceTexts = await priceLocators.allTextContents();
    return priceTexts.map((price) => parseFloat(price.replace("$", "")));
  }
}