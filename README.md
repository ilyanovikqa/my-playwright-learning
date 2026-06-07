# Final Project — Playwright Test Suite

## Test target
SauceDemo (https://www.saucedemo.com)

## Covered user journey
Login → product selection → cart → checkout

## Test cases
- Valid user can log in and sees inventory page
- Locked user cannot log in and sees correct error message
- Wrong password shows error message
- Empty username shows validation error
- User can add a product to cart and badge updates
- User can add multiple products and badge shows correct count
- Cart page shows the name of the selected product
- User can remove a product and badge disappears
- User can sort products by price low to high
- User can complete full checkout and see success message

## Project structure
- `pages/` — Page Object classes
  - `LoginPage.ts` — login form locators and actions
  - `InventoryPage.ts` — product list, add/remove, sorting, cart badge
  - `CartPage.ts` — cart page locators and checkout navigation
  - `CheckoutPage.ts` — checkout form, finish button, success message
- `tests/` — test specs
  - `login.spec.ts` — login regression tests
  - `cart.spec.ts` — cart behavior tests
  - `checkout.spec.ts` — full checkout flow with test.step
  - `sorting.spec.ts` — product sorting by price
- `test-data/` — credentials and test inputs
  - `users.ts` — standard user, locked user, customer info
- `playwright.config.ts` — base URL, project configuration

## How to run

Clone the repository:
git clone https://github.com/ilyanovikqa/my-playwright-learning.git
cd my-playwright-learning

Install dependencies:
npm install
npx playwright install

Run all tests:
npx playwright test

Run specific file:
npx playwright test tests/login.spec.ts --project=chromium

Run with UI mode:
npx playwright test --ui

Run with trace:
npx playwright test --trace on
npx playwright show-report

## Notes
- No hard waits (waitForTimeout) are used — all waits are assertion-based
- Tests use semantic locators (getByRole, getByPlaceholder, getByTestId)
- testIdAttribute: "data-test" is configured so getByTestId works with SauceDemo
- Test data is stored separately from test logic in test-data/users.ts
- Checkout test uses test.step for clear timeline in trace viewer
- Failure messages added to every expect() call for easier debugging

## Known limitations
- Suite covers the main happy path and basic negative cases only
- Does not cover all edge cases (e.g. network errors, session expiry)
- Tests run against a demo site — behaviour may change without notice