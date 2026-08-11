import { expect, test } from '@playwright/test';

// The list view's own heading, used to tell "the list is really rendered" from
// "the address bar merely says /list/"
const listHeading = (page) => page.getByRole('heading', { level: 1, name: 'Projects List' });
const listRows = (page) => page.locator('table tbody tr');

async function openFirstProject(page) {
	await page.getByLabel('View project').first().click();
	await expect(page).toHaveURL(/\/projects\/[^/]+\/$/);
}

test.describe('browser history', () => {
	test('going back from a project re-renders the list, not just the URL', async ({ page }) => {
		await page.goto('/list/');
		await expect(listHeading(page)).toBeVisible();

		await openFirstProject(page);
		await expect(listHeading(page)).toBeHidden();

		await page.goBack();

		// The URL alone passing is exactly the reported bug, so assert the content
		await expect(page).toHaveURL(/\/list\/$/);
		await expect(listHeading(page)).toBeVisible();
		await expect(listRows(page).first()).toBeVisible();
	});

	test('typing in the search field keeps focus while the URL updates', async ({ page }) => {
		// Syncing the URL goes through goto(), which moves focus to the body unless
		// keepFocus is set — that would drop a character on every keystroke
		await page.goto('/list/');
		const search = page.getByPlaceholder('Search projects...');

		await search.click();
		await search.pressSequentially('arch', { delay: 40 });

		await expect(page).toHaveURL(/[?&]search=arch/);
		await expect(search).toBeFocused();
		await expect(search).toHaveValue('arch');
	});

	// AkFilters is shared by all three, so the URL sync has to hold in each host
	for (const view of ['/projects/', '/list/', '/map/']) {
		test(`filtering ${view} writes the tag to the URL`, async ({ page }) => {
			await page.goto(view);
			await page.getByTestId('tag-filter').first().click();

			await expect(page).toHaveURL(/[?&]tags=/);
		});
	}

	test('going back preserves the filters that were applied', async ({ page }) => {
		await page.goto('/list/');
		await expect(listHeading(page)).toBeVisible();

		const firstTag = page.getByTestId('tag-filter').first();
		const tagLabel = (await firstTag.textContent())?.trim() ?? '';
		await firstTag.click();
		await expect(page).toHaveURL(/[?&]tags=/);

		const filteredUrl = page.url();
		const filteredRowCount = await listRows(page).count();

		await openFirstProject(page);
		await page.goBack();

		await expect(page).toHaveURL(filteredUrl);
		await expect(listHeading(page)).toBeVisible();
		// Same filtered result set, and the tag chip still reads as selected
		await expect(listRows(page)).toHaveCount(filteredRowCount);
		await expect(page.getByTestId('tag-filter').filter({ hasText: tagLabel })).toHaveClass(
			/bg-primary/
		);
	});
});
