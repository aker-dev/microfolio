import { expect, test } from '@playwright/test';

// The search used to replace the type, featured and tag filters rather than
// narrow them: @vincjo/datatables applies a search *instead of* its filters.
// The chips stayed lit and the URL kept its parameters, so nothing on screen
// said a filter had been dropped. These counts come from the demo set — "studio"
// matches six architecture projects and "The Metro as a Single Line", a design
// project that answers it through one of its authors.

const cards = (page) => page.locator('.grid > a');
const listRows = (page) => page.locator('table tbody tr');

/** See navigation.spec.js: the layout marks the tree interactive. */
async function waitForHydration(page) {
	await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true');
}

/** The type badge is the first one on a card, and the second cell of a row. */
async function typesOf(locator, badge) {
	const texts = await locator.locator(badge).allTextContents();
	return [...new Set(texts.map((text) => text.trim().toLowerCase()))];
}

test.describe('search combines with the other filters', () => {
	test('/projects keeps the type filter while searching', async ({ page }) => {
		await page.goto('/projects/?type=architecture&search=studio');
		await waitForHydration(page);

		await expect(cards(page)).toHaveCount(6);
		expect(await typesOf(cards(page), 'span.capitalize')).toEqual(['architecture']);
		await expect(page.getByText('The Metro as a Single Line')).toHaveCount(0);
		await expect(page.getByText(/Showing\s+1\s+to\s+6\s+of\s+6\s+entries/)).toBeVisible();
	});

	test('/projects keeps the tag filter while searching', async ({ page }) => {
		await page.goto('/projects/?search=studio&tags=timber');
		await waitForHydration(page);

		await expect(cards(page)).toHaveCount(2);
		await expect(page.getByTestId('tag-filter').filter({ hasText: 'timber' })).toHaveClass(
			/(?:^|\s)bg-primary(?:\s|$)/
		);
	});

	test('typing after choosing a type narrows rather than resets', async ({ page }) => {
		await page.goto('/projects/');
		await waitForHydration(page);

		await page.getByTestId('type-filter').filter({ hasText: 'architecture' }).click();
		await expect(cards(page)).toHaveCount(11);

		await page.getByPlaceholder('Search projects...').pressSequentially('studio');

		await expect(page).toHaveURL(/[?&]search=studio/);
		await expect(page).toHaveURL(/[?&]type=architecture/);
		await expect(cards(page)).toHaveCount(6);
		expect(await typesOf(cards(page), 'span.capitalize')).toEqual(['architecture']);
	});

	test('/list keeps the type filter while searching', async ({ page }) => {
		await page.goto('/list/?type=architecture&search=studio');
		await waitForHydration(page);

		await expect(listRows(page)).toHaveCount(6);
		expect(await typesOf(listRows(page), 'td:nth-child(2) span')).toEqual(['architecture']);
	});

	test('/map only places the markers of the chosen type', async ({ page }) => {
		await page.goto('/map/?type=architecture&search=studio');
		await waitForHydration(page);

		await expect(page.locator('.ak-marker')).toHaveCount(6);
		await expect(page.getByRole('button', { name: 'The Metro as a Single Line' })).toHaveCount(0);
	});
});
