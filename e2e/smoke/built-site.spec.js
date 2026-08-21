import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { siteConfig } from '../../src/lib/config.js';

/**
 * The only suite that loads the built site rather than the dev server.
 *
 * It exists because of one bug and the class it belongs to: MapLibre builds its
 * worker URL at runtime from a name it assembles, Rollup could not see through
 * that, and the production build referenced a chunk it had never emitted. The
 * map came up blank — while `pnpm dev` was perfect and every end-to-end test
 * passed. Nothing in CI would have caught it, because the suite that clicks
 * through the site runs against `pnpm dev` and finishes before `pnpm build`
 * starts.
 *
 * So the assertions here are deliberately shallow and about the artefact, not
 * about behaviour: every page loads, asks for nothing it does not have, and
 * hydrates. `e2e/navigation.spec.js` is where features are tested.
 */

// Requests that leave the machine — the font CDN, the tile server — are somebody
// else's uptime, and no reason to block a deploy. Same-origin is exactly what we
// just built, and it is where a chunk that was referenced but never emitted
// shows up as a 404.
function isSameOrigin(url, baseURL) {
	try {
		return new URL(url).origin === new URL(baseURL).origin;
	} catch {
		return false;
	}
}

/**
 * Watches a page for the three ways a built site breaks without saying so:
 * a file it asks for and does not get, a request that never lands, and an
 * uncaught exception. Attach before navigating — a listener added afterwards
 * has already missed the document.
 */
function watchForBreakage(page, baseURL) {
	const problems = [];

	page.on('response', (response) => {
		const url = response.url();
		if (isSameOrigin(url, baseURL) && response.status() >= 400) {
			problems.push(`${response.status()} ${url}`);
		}
	});

	page.on('requestfailed', (request) => {
		const url = request.url();
		if (isSameOrigin(url, baseURL)) {
			problems.push(`failed (${request.failure()?.errorText ?? 'unknown'}) ${url}`);
		}
	});

	page.on('pageerror', (error) => {
		problems.push(`uncaught ${error.message}`);
	});

	return problems;
}

// Relative, with no leading slash: these resolve against the config's baseURL,
// which carries the /microfolio the site is served under, and a leading slash
// would throw that away and ask the origin root instead.
//
// The project page is whichever project the content holds first, because this
// suite also runs in the deploy workflow of a site that replaced example-project
// with its own. The frontmatter check mirrors what the build requires: a
// project without title or date is skipped, and its page would 404 here.
function firstProjectRoute() {
	const dir = 'content/projects';
	if (!existsSync(dir)) return null;
	for (const name of readdirSync(dir).sort()) {
		const file = `${dir}/${name}/index.md`;
		if (!existsSync(file)) continue;
		const head = readFileSync(file, 'utf8').slice(0, 4000);
		if (/^title:/m.test(head) && /^date:/m.test(head)) return `projects/${name}/`;
	}
	return null;
}

const PAGES = ['./', 'about/', 'projects/', 'list/', 'map/', firstProjectRoute()].filter(Boolean);

for (const route of PAGES) {
	test(`${route} loads from the build, whole and hydrated`, async ({ page, baseURL }) => {
		const problems = watchForBreakage(page, baseURL);

		const response = await page.goto(route);
		expect(response?.status(), `${route} did not return 200`).toBe(200);

		await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true');

		expect(problems, `${route} broke:\n${problems.join('\n')}`).toEqual([]);
	});
}

// The route the build has actually broken before. Both assertions stay on this
// machine: a .pbf tile request would be the truest echo of the original symptom
// — "no tile request at all" — but it needs the style JSON back from
// openfreemap first, and a third party has no business failing a deploy.
test('the map starts, rather than coming up blank', async ({ page, baseURL }) => {
	const problems = watchForBreakage(page, baseURL);

	await page.goto('map/');
	await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true');

	// MapLibre draws with WebGL and throws outright where there is none, which is
	// the one failure the page catches and reports for itself
	await expect(page.getByText(/This map needs WebGL/)).toBeHidden();

	// Present only once the Map constructor has run
	await expect(page.locator('canvas.maplibregl-canvas')).toBeVisible();

	expect(problems, `/map/ broke:\n${problems.join('\n')}`).toEqual([]);
});

// Nothing links to either, so they are listed explicitly in svelte.config.js
// entries — which means a typo there costs the sitemap with no page 404ing
test('the endpoints nothing links to were prerendered', async ({ request }) => {
	for (const route of ['sitemap.xml', 'robots.txt']) {
		const response = await request.get(route);
		expect(response.status(), `${route} did not return 200`).toBe(200);
	}
});

// The typeface is whatever config.js says. This suite also runs in a fork's
// deploy workflow, so it checks that site's own config rather than Bunny.
test('the typeface comes from config.js', async ({ page, baseURL }) => {
	await page.goto('./');
	const font = siteConfig.font;
	const sheets = await page
		.locator('link[rel="stylesheet"]')
		.evaluateAll((links) => links.map((link) => link.href));
	if (font?.url) expect(sheets).toContain(font.url);
	else expect(sheets.filter((href) => !isSameOrigin(href, baseURL))).toEqual([]);
	if (font?.family) {
		const family = await page.evaluate(() => getComputedStyle(document.documentElement).fontFamily);
		// Browsers normalise the quotes around a family name, so compare without them
		const unquote = (s) => s.replace(/["']/g, '');
		expect(unquote(family)).toContain(unquote(font.family.split(',')[0].trim()));
	}
});
