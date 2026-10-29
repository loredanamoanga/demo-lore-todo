const { test, expect } = require('@playwright/test');

test('Page exists at the root', async ({ page }) => {
  await page.goto('index.html');
  await expect(page).toHaveURL(/\/index\.html$/);
});

test('Single blue rectangle is visible', async ({ page }) => {
  await page.goto('index.html');

  const visibleElements = page.locator('body *:visible');
  await expect(visibleElements).toHaveCount(1);

  const rectangle = page.locator('.rectangle');
  await expect(rectangle).toBeVisible();
  await expect(rectangle).toHaveCSS('width', '300px');
  await expect(rectangle).toHaveCSS('height', '300px');
  await expect(rectangle).toHaveCSS('background-color', 'rgb(0, 0, 255)');
});

test('No additional interface elements appear', async ({ page }) => {
  await page.goto('index.html');

  const visibleElements = page.locator('body *:visible');
  await expect(visibleElements).toHaveCount(1);

  const uiSelectors = [
    'button:visible',
    'input:visible',
    'select:visible',
    'textarea:visible',
    'a:visible',
    'nav:visible',
    'label:visible',
    'menu:visible'
  ];

  for (const selector of uiSelectors) {
    await expect(page.locator(selector)).toHaveCount(0);
  }

  const visibleText = await page.locator('body').innerText();
  expect(visibleText.trim()).toBe('');
});

test('Source contains only static markup and styles', async ({ page }) => {
  await page.goto('index.html');

  await expect(page.locator('script')).toHaveCount(0);

  const interactive = page.locator('button, input, select, textarea, form');
  await expect(interactive).toHaveCount(0);
});
