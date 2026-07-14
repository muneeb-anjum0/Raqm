import { expect, test } from '@playwright/test';

test('landing page loads', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Raqm', exact: true })).toBeVisible();
	await expect(page.getByText('Private by design. Ready for Iris.')).toBeVisible();
});

test('user creates vault, enters data, calculates, exports, locks, and wipes', async ({ page }) => {
	await page.goto('/app/vault');
	const nav = page.getByRole('navigation');
	await expect(page.getByRole('button', { name: 'Create encrypted vault' })).toBeEnabled();
	await page.getByLabel('Vault password').fill('correct horse battery');
	await page.getByLabel('Confirm password').fill('correct horse battery');
	await page.getByRole('button', { name: 'Create encrypted vault' }).click();
	await expect(page).toHaveURL(/\/app\/setup/);
	await nav.getByRole('link', { name: 'Income' }).click();
	await page.getByRole('spinbutton', { name: 'Monthly salary' }).fill('150000');
	await nav.getByRole('link', { name: 'Withholding' }).click();
	await page.getByRole('spinbutton', { name: 'Annual employer tax deducted' }).fill('85000');
	await nav.getByRole('link', { name: 'Calculate' }).click();
	await page.getByRole('button', { name: 'Run rules-based calculation' }).click();
	await expect(page.getByText('Deterministic explanation')).toBeVisible();
	await nav.getByRole('link', { name: 'Iris Summary' }).click();
	await expect(page.getByText('Manual Iris preparation fields')).toBeVisible();
	await nav.getByRole('link', { name: 'Checklist' }).click();
	await expect(page.getByText('Salary certificate')).toBeVisible();
	await page.locator('aside').getByRole('link', { name: 'Reports' }).click();
	await expect(page).toHaveURL(/\/app\/reports/);
	await expect(page.getByRole('button', { name: 'Export CSV' })).toBeVisible();
	await page.getByRole('button', { name: 'Lock' }).click();
	await expect(page).toHaveURL(/\/app\/vault/);
	await page.getByLabel('Vault password').fill('correct horse battery');
	await page.getByRole('button', { name: 'Unlock vault' }).click();
	await page.goto('/app/vault');
	await page.getByRole('textbox').last().fill('WIPE RAQM');
	await page.getByRole('button', { name: 'Panic wipe local data' }).click();
});
