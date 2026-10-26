import { expect, test } from '@playwright/test';

test('the shell renders the nav entry, the demo badge, the header band and one empty card', async ({
  page,
}) => {
  await page.goto('/');

  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toContainText('Todo');
  await expect(page.getByRole('status')).toHaveText('demo');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Team todo');
  await expect(page.getByRole('button', { name: 'Add item' })).toBeVisible();
  await expect(page.getByText('No items yet. Add the first one.')).toBeVisible();
});

test('the backend health endpoint answers UP through the frontend proxy', async ({ request }) => {
  const response = await request.get('/actuator/health');

  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject({ status: 'UP' });
});
