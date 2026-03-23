import { test, expect } from "@playwright/test";

test("додавання 8 + 2 = 10", async ({ page }) => {
  await page.goto("http://localhost:5500");

  await expect(page.locator("#display")).toHaveValue("0");

  await page.locator('[data-digit="8"]').click();
  await page.locator('[data-op="+"]').click();
  await page.locator('[data-digit="2"]').click();
  await page.locator('[data-action="equals"]').click();

  await expect(page.locator("#display")).toHaveValue("10");
});

test("очищення калькулятора повертає 0", async ({ page }) => {
  await page.goto("http://localhost:5500");

  await expect(page.locator("#display")).toHaveValue("0");

  await page.locator('[data-digit="9"]').click();
  await page.locator('[data-action="clear"]').click();

  await expect(page.locator("#display")).toHaveValue("0");
});