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

	test('a deep link to a page number lands on that page', async ({ page }) => {
		await page.goto('/list/?page=2');

		await expect(page).toHaveURL(/[?&]page=2/);
		await expect(page.getByLabel('Go to page 2')).toHaveAttribute('aria-current', 'page');
	});

	test('going back preserves the page number, not just the filters', async ({ page }) => {
		await page.goto('/list/?tags=digital&page=2');
		// Asserted against literals, not against whatever URL the page settled on,
		// so a deep link that silently drops its page cannot make this pass
		await expect(page).toHaveURL(/[?&]tags=digital/);
		await expect(page).toHaveURL(/[?&]page=2/);
		const firstRowOnPageTwo = await page.locator('table tbody tr h3').first().textContent();

		await openFirstProject(page);
		await page.goBack();

		await expect(page).toHaveURL(/[?&]tags=digital/);
		await expect(page).toHaveURL(/[?&]page=2/);
		await expect(listHeading(page)).toBeVisible();
		await expect(page.getByLabel('Go to page 2')).toHaveAttribute('aria-current', 'page');
		await expect(page.locator('table tbody tr h3').first()).toHaveText(firstRowOnPageTwo);
	});

	test('sorting from page 2 still returns to page 1', async ({ page }) => {
		// The mirroring effect in ThSort now preserves the page; an actual click on
		// a column header must still reset pagination
		await page.goto('/list/?page=2');
		await expect(page.getByLabel('Go to page 2')).toHaveAttribute('aria-current', 'page');

		await page.getByRole('button', { name: 'Title' }).click();

		await expect(page.getByLabel('Go to page 1')).toHaveAttribute('aria-current', 'page');
	});

	test('the back link returns to the filtered list it came from', async ({ page }) => {
		await page.goto('/list/?tags=digital&page=2');
		await expect(page).toHaveURL(/[?&]page=2/);

		await openFirstProject(page);
		await page.getByRole('link', { name: '← Back' }).click();

		await expect(page).toHaveURL(/[?&]tags=digital/);
		await expect(page).toHaveURL(/[?&]page=2/);
		await expect(listHeading(page)).toBeVisible();
		await expect(page.getByLabel('Go to page 2')).toHaveAttribute('aria-current', 'page');
	});

	test('the back link falls back to the index on a direct arrival', async ({ page }) => {
		// No in-app history here, so following the href must not leave the site
		await page.goto('/projects/example-project/');
		await page.getByRole('link', { name: '← Back' }).click();

		await expect(page).toHaveURL(/\/projects\/$/);
		await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible();
	});

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
			/(?:^|\s)bg-primary(?:\s|$)/
		);
	});
});
