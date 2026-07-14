import { expect, test } from '@playwright/test';

test('landing page loads', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Raqm', exact: true })).toBeVisible();
	await expect(page.getByText('Private by design. Ready for Iris.')).toBeVisible();
});

test('user creates vault, enters data, calculates, exports, locks, and wipes', async ({ page }) => {
	await page.goto('/app');
	await expect(page.getByRole('button', { name: 'Create encrypted vault' })).toBeEnabled();
	await page.getByLabel('Vault password').fill('correct horse battery');
	await page.getByLabel('Confirm password').fill('correct horse battery');
	await page.getByRole('button', { name: 'Create encrypted vault' }).click();
	await expect(page.getByRole('heading', { name: 'Setup' })).toBeVisible();
	await page.getByRole('button', { name: /Done/ }).click();
	await page.getByRole('spinbutton', { name: 'Monthly salary' }).fill('150000');
	await page.getByRole('button', { name: /Done/ }).click();
	await page.getByRole('spinbutton', { name: 'Annual employer tax deducted' }).fill('85000');
	await page.getByRole('button', { name: /Done/ }).click();
	await page.getByRole('button', { name: /Done/ }).click();
	await page.getByRole('button', { name: /Done/ }).click();
	await page.getByRole('button', { name: /Done/ }).click();
	await page.getByRole('button', { name: /Done/ }).click();
	await page.getByRole('button', { name: 'Run rules-based calculation' }).click();
	await expect(page.getByText('Deterministic explanation')).toBeVisible();
	await page.getByRole('button', { name: /Next/ }).click();
	await expect(page.getByText('Manual Iris preparation fields')).toBeVisible();
	await page.getByRole('button', { name: /Next/ }).click();
	await expect(page.getByRole('heading', { name: 'Salary certificate' })).toBeVisible();
	await page.getByRole('button', { name: /Next/ }).click();
	await expect(page.getByRole('button', { name: 'Export CSV' })).toBeVisible();
	await page.getByRole('button', { name: 'Lock', exact: true }).click();
	await expect(page.getByRole('button', { name: 'Unlock vault' })).toBeVisible();
	await page.getByLabel('Vault password').fill('correct horse battery');
	await page.getByRole('button', { name: 'Unlock vault' }).click();
	await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
	await page.getByRole('button', { name: 'Lock', exact: true }).click();
	await page.getByLabel('Panic wipe confirmation').fill('WIPE RAQM');
	await page.getByRole('button', { name: 'Panic wipe local data' }).click();
});
