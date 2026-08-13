#!/usr/bin/env node

/**
 * Regenerates the screenshots in doc/screenshots, used by README.md and
 * LISEZMOI.md.
 *
 * Needs a dev server already running:
 *
 *   pnpm dev --port 5199
 *   PORT=5199 pnpm screenshots
 *
 * The footer shows the version from package.json, so bump it before running
 * this for a release. Dark mode goes through prefers-color-scheme rather than
 * the footer toggle, which stores its choice in localStorage.
 */

import { chromium } from '@playwright/test';
import { mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(projectRoot, 'doc/screenshots');

const PORT = process.env.PORT ?? 5173;
const BASE = `http://localhost:${PORT}`;
// Matches the dimensions of the previous set, so the README layout is unchanged
const VIEWPORT = { width: 1280, height: 1028 };

/**
 * Opens the gallery on its first image — the one carrying a full set of EXIF —
 * and deploys the information panel beside it.
 */
async function openLightbox(page) {
	await page.locator('section button.aspect-4\\/3').first().click();
	await page.locator('[role="dialog"]').waitFor();
	await page.getByRole('button', { name: 'Image details' }).click();

	// A capture taken before the full-size image has decoded shows an empty frame
	await page.waitForFunction(() => {
		const img = document.querySelector('[role="dialog"] img');
		return img && img.complete && img.naturalWidth > 0;
	});

	// The controls fade after siteConfig.lightbox.hideControlsDelay, so this has
	// to be the last thing that happens before the shutter
	await page.mouse.move(900, 500);
	await page.waitForTimeout(400);
}

const LIGHT = [
	{ name: 'microfolio_home_01', path: '/' },
	{ name: 'microfolio_projects', path: '/projects/' },
	{ name: 'microfolio_project_01', path: '/projects/example-project/' },
	// `main section` rather than `section`: AkHeader opens with one of its own,
	// already at the top, so scrolling to it moved nothing
	{ name: 'microfolio_project_02', path: '/projects/example-project/', scrollTo: 'main section' },
	{
		name: 'microfolio_lightbox',
		path: '/projects/example-project/',
		actions: openLightbox
	},
	{ name: 'microfolio_list', path: '/list/' },
	{ name: 'microfolio_map', path: '/map/', settle: 2500 }
];

const DARK = [
	{ name: 'microfolio_home_dark', path: '/' },
	{ name: 'microfolio_project_dark', path: '/projects/example-project/' },
	{
		name: 'microfolio_lightbox_dark',
		path: '/projects/example-project/',
		actions: openLightbox
	},
	{ name: 'microfolio_list_dark', path: '/list/' }
];

async function capture(context, shots) {
	const page = await context.newPage();

	for (const shot of shots) {
		await page.goto(BASE + shot.path, { waitUntil: 'networkidle' });

		// The filter controls stay disabled until the layout marks the tree
		// interactive; capturing earlier would show them greyed out
		await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');

		if (shot.scrollTo) {
			await page.locator(shot.scrollTo).first().scrollIntoViewIfNeeded();
		}
		await page.waitForTimeout(shot.settle ?? 600);

		// Anything the shot needs to set up — opening the lightbox, say. Runs last
		// so a control that fades on a timer is still on screen when we shoot.
		if (shot.actions) {
			await shot.actions(page);
		}

		const file = join(outDir, `${shot.name}.png`);
		await page.screenshot({ path: file });
		console.log(`  ✓ ${shot.name}.png`);
	}

	await page.close();
}

async function main() {
	await mkdir(outDir, { recursive: true });

	const browser = await chromium.launch();
	try {
		console.log(`Capturing ${BASE} at ${VIEWPORT.width}x${VIEWPORT.height}`);

		const light = await browser.newContext({ viewport: VIEWPORT, colorScheme: 'light' });
		await capture(light, LIGHT);
		await light.close();

		const dark = await browser.newContext({ viewport: VIEWPORT, colorScheme: 'dark' });
		await capture(dark, DARK);
		await dark.close();
	} finally {
		await browser.close();
	}

	console.log(`\nWritten to doc/screenshots`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
