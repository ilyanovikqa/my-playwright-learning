# Broken Tests Bug Report

## Test 1 — login should redirect to inventory
Root cause:   Wrong placeholder text "User Name" used instead of the actual placeholder "Username" on SauceDemo login page
Fix:          Changed getByPlaceholder("User Name") to getByPlaceholder("Username")
How I verified: ran `npx playwright test tests/broken-tests.spec.ts --project=chromium` and test passed

## Test 2 — error message on wrong password
Root cause:   getByTestId() looks for data-testid attribute by default but SauceDemo uses data-test, so the element was never found
Fix:          Changed getByTestId("error") to locator("[data-test='error']")
How I verified: ran `npx playwright test tests/broken-tests.spec.ts --project=chromium` and test passed

## Test 3 — cart badge appears after adding product
Root cause:   Missing await before page.locator().click() — the click fired but the test didn't wait for it to complete before checking the badge
Fix:          Added await before page.locator("[data-test='add-to-cart-sauce-labs-backpack']").click()
How I verified: ran `npx playwright test tests/broken-tests.spec.ts --project=chromium` and test passed
