import { expect, test } from '@playwright/test';

// The list view's own heading, used to tell "the list is really rendered" from
// "the address bar merely says /list/"
const listHeading = (page) => page.getByRole('heading', { level: 1, name: 'Projects List' });
const listRows = (page) => page.locator('table tbody tr');

async function openFirstProject(page) {
	await page.getByLabel('View project').first().click();
	await expect(page).toHaveURL(/\/projects\/[^/]+\/$/);
}

/**
 * The filter controls are prerendered, so they are clickable before Svelte has
 * hydrated them — and a click that lands in that window hits markup with no
 * listener attached and is silently lost. It never showed locally and failed on
 * the slower CI runner. AkFilters renders the row count only once its table
 * handler exists, which happens after hydration, so it is a usable signal.
 */
async function waitForFiltersReady(page) {
	// \s+ rather than spaces: getByText does not normalise whitespace for regex
	// matching, and the markup puts each value on its own line
	await expect(page.getByText(/Showing\s+\d+\s+to\s+\d+\s+of\s+\d+\s+entries/)).toBeVisible();
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
		await waitForFiltersReady(page);
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
			await waitForFiltersReady(page);
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
		await waitForFiltersReady(page);
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
		await waitForFiltersReady(page);

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

test.describe('navigating into a filtered view', () => {
	test('a list row title links to its project', async ({ page }) => {
		await page.goto('/list/');
		await waitForFiltersReady(page);

		const title = page.locator('table tbody tr h3 a').first();
		const label = (await title.textContent())?.trim();
		await title.click();

		await expect(page).toHaveURL(/\/projects\/[^/]+\/$/);
		await expect(page.getByRole('heading', { level: 1, name: label })).toBeVisible();
	});

	test('the type badge opens the projects view filtered on that type', async ({ page }) => {
		await page.goto('/projects/example-project/');
		const badge = page.locator('aside a[href*="?type="]').first();
		const type = (await badge.textContent())?.trim();
		await badge.click();

		await expect(page).toHaveURL(new RegExp(`/projects/\\?type=${type}`));
		// The filter is really applied, not just present in the URL
		await waitForFiltersReady(page);
		// Scoped to the type buttons: the demo content has a tag named like the
		// type, so matching on the label alone resolves to two elements
		await expect(page.getByTestId('type-filter').filter({ hasText: type })).toHaveClass(
			/(?:^|\s)bg-primary(?:\s|$)/
		);
	});

	test('a tag badge opens the projects view filtered on that tag', async ({ page }) => {
		await page.goto('/projects/example-project/');
		const badge = page.locator('aside a[href*="?tags="]').first();
		const tag = (await badge.textContent())?.trim();
		await badge.click();

		await expect(page).toHaveURL(/\/projects\/\?tags=/);
		await waitForFiltersReady(page);
		await expect(page.getByTestId('tag-filter').filter({ hasText: tag })).toHaveClass(
			/(?:^|\s)bg-primary(?:\s|$)/
		);
	});
});

/** See the note on waitForFiltersReady: the layout marks the tree interactive. */
async function waitForHydration(page) {
	await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true');
}

/**
 * Controls fade out after siteConfig.lightbox.hideControlsDelay and become
 * pointer-events-none, so a test that pauses would click through them. Any
 * pointer movement brings them back — assert that before interacting.
 */
async function revealControls(page) {
	await page.mouse.move(300, 300);
	await expect(page.getByRole('button', { name: 'Close' })).toHaveCSS('opacity', '1');
}

test.describe('lightbox', () => {
	const openLightbox = async (page) => {
		await page.goto('/projects/example-project/');
		await waitForHydration(page);
		await page.locator('section button.aspect-4\\/3').first().click();
		await expect(page.getByRole('dialog')).toBeVisible();
	};

	test('opens from the gallery and closes with Escape', async ({ page }) => {
		await openLightbox(page);

		await page.keyboard.press('Escape');
		await expect(page.getByRole('dialog')).toBeHidden();
	});

	test('opens with the image alone, and the panel is opt-in', async ({ page }) => {
		await openLightbox(page);
		await revealControls(page);
		const panel = page.getByRole('complementary', { name: 'Image details' });

		// Closed by default: the point of "full-bleed" is an unobstructed image
		await expect(panel).toBeHidden();

		await page.getByRole('button', { name: 'Image details' }).click();
		await expect(panel).toBeVisible();
		await expect(panel.getByRole('heading', { level: 2 })).toBeVisible();
	});

	test('the panel stays open while browsing to the next image', async ({ page }) => {
		await openLightbox(page);
		await revealControls(page);
		await page.getByRole('button', { name: 'Image details' }).click();

		const panel = page.getByRole('complementary', { name: 'Image details' });
		const firstTitle = await panel.getByRole('heading', { level: 2 }).textContent();

		await revealControls(page);
		await page.getByRole('button', { name: 'Next image' }).last().click();

		await expect(panel).toBeVisible();
		await expect(panel.getByRole('heading', { level: 2 })).not.toHaveText(firstTitle ?? '');
	});

	test('arrow keys move through the gallery and wrap around', async ({ page }) => {
		await openLightbox(page);
		const counter = page.getByText(/^\s*\d+ \/ \d+\s*$/);
		await expect(counter).toHaveText(/^\s*1 \/ (\d+)\s*$/);
		const total = Number((await counter.textContent())?.split('/')[1].trim());

		await page.keyboard.press('ArrowRight');
		await expect(counter).toHaveText(new RegExp(`^\\s*2 / ${total}\\s*$`));

		// Wrapping backwards from the first image is the behaviour to preserve
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('ArrowLeft');
		await expect(counter).toHaveText(new RegExp(`^\\s*${total} / ${total}\\s*$`));
	});
});

test.describe('lightbox idle controls', () => {
	test('controls fade out while idle and return on the first move', async ({ page }) => {
		await page.goto('/projects/example-project/');
		await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true');
		await page.locator('section button.aspect-4\\/3').first().click();

		const close = page.getByRole('button', { name: 'Close' });
		const counter = page.getByText(/^\s*\d+ \/ \d+\s*$/);
		await expect(close).toHaveCSS('opacity', '1');

		// siteConfig.lightbox.hideControlsDelay is 3s; no pointer movement here
		await expect(close).toHaveCSS('opacity', '0', { timeout: 8000 });
		await expect(counter).toHaveCSS('opacity', '0');

		await page.mouse.move(400, 300);
		await expect(close).toHaveCSS('opacity', '1');
		await expect(counter).toHaveCSS('opacity', '1');
	});

	test('clicking beside the image no longer closes the lightbox', async ({ page }) => {
		await page.goto('/projects/example-project/');
		await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true');
		await page.locator('section button.aspect-4\\/3').first().click();
		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();

		// Top centre: outside the image, clear of the navigation zones and controls
		const box = await dialog.boundingBox();
		await page.mouse.click(box.x + box.width / 2, box.y + 4);
		await expect(dialog).toBeVisible();

		// The counter is a control, not a way out either
		await revealControls(page);
		await page.getByText(/^\s*\d+ \/ \d+\s*$/).click();
		await expect(dialog).toBeVisible();
	});
});

// The point of prerendering: this is the only honest way to check that the
// content is in the HTML rather than conjured by hydration.
test.describe('without JavaScript', () => {
	test.use({ javaScriptEnabled: false });

	test('/list renders its rows, not a placeholder', async ({ page }) => {
		await page.goto('/list/');

		await expect(page.getByRole('heading', { level: 1, name: 'Projects List' })).toBeVisible();
		await expect(page.locator('table tbody tr')).toHaveCount(20);
		await expect(page.getByText('Loading projects')).toHaveCount(0);
	});

	test('/projects renders a page of cards', async ({ page }) => {
		await page.goto('/projects/');

		// Card headings rather than "links inside a grid", which also caught the
		// four navigation links in the footer
		await expect(page.locator('h3.text-lg')).toHaveCount(20);
	});

	test('the filter controls say they are not ready yet', async ({ page }) => {
		await page.goto('/list/');

		await expect(page.getByTestId('type-filter').first()).toBeDisabled();
		await expect(page.getByPlaceholder('Search projects...')).toBeDisabled();
	});
});

test.describe('keyboard and assistive technology', () => {
	test('tabbing leaves a visible focus ring', async ({ page }) => {
		await page.goto('/list/');
		await waitForFiltersReady(page);

		await page.keyboard.press('Tab');

		// :focus-visible only matches after a real key press, never after a
		// programmatic .focus() — which is the whole point of using it
		const focus = await page.evaluate(() => {
			const el = document.activeElement;
			const style = getComputedStyle(el);
			return {
				visible: el.matches(':focus-visible'),
				width: parseFloat(style.outlineWidth),
				style: style.outlineStyle
			};
		});

		expect(focus.visible).toBe(true);
		expect(focus.style).not.toBe('none');
		expect(focus.width).toBeGreaterThan(0);
	});

	test('the collapsible tag list announces its state', async ({ page }) => {
		await page.goto('/projects/');
		await waitForFiltersReady(page);

		const toggle = page.getByRole('button', { name: /more$/ });
		await expect(toggle).toHaveAttribute('aria-expanded', 'false');
		await expect(toggle).toHaveAttribute('aria-controls', 'tag-filters');

		await toggle.click();
		await expect(page.getByRole('button', { name: 'show less' })).toHaveAttribute(
			'aria-expanded',
			'true'
		);
	});

	test('the mobile menu announces its state', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 780 });
		await page.goto('/list/');
		await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true');

		const toggle = page.getByRole('button', { name: 'Toggle mobile menu' });
		await expect(toggle).toHaveAttribute('aria-expanded', 'false');

		await toggle.click();
		await expect(toggle).toHaveAttribute('aria-expanded', 'true');
		await expect(page.locator('#mobile-menu')).toBeVisible();
	});
});

test.describe('small screens', () => {
	test.use({ viewport: { width: 375, height: 820 } });

	test('the filter panel starts collapsed and reports what is active', async ({ page }) => {
		await page.goto('/list/?tags=digital');
		await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true');

		const panel = page.locator('#filter-panel');
		const toggle = page.getByRole('button', { name: /Filters/ });
		await expect(panel).toBeHidden();
		// One tag from the URL, so the button has to say so
		await expect(toggle).toContainText('(1)');
		await expect(toggle).toHaveAttribute('aria-expanded', 'false');

		await toggle.click();
		await expect(panel).toBeVisible();
		await expect(toggle).toHaveAttribute('aria-expanded', 'true');
	});

	test('/list shows cards rather than a table that scrolls sideways', async ({ page }) => {
		await page.goto('/list/');
		await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true');

		await expect(page.locator('table')).toBeHidden();
		await expect(page.locator('ul[data-testid="project-cards"] > li')).toHaveCount(20);
		// The first card carries what the table columns held
		const first = page.locator('ul[data-testid="project-cards"] > li').first();
		await expect(first.getByRole('link')).toBeVisible();
		await expect(first).toContainText(/\d{4}-\d{2}/);
	});

	test('content is reachable without scrolling past the filters', async ({ page }) => {
		await page.goto('/list/');
		await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true');

		const top = await page
			.locator('ul[data-testid="project-cards"] > li')
			.first()
			.evaluate((el) => el.getBoundingClientRect().top);
		// It used to start at 736px on an 820px screen
		expect(top).toBeLessThan(500);
	});
});
