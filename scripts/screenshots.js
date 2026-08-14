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

const PORT = process.env.PORT ?? 5555;
const BASE = `http://localhost:${PORT}`;
// Matches the dimensions of the previous set, so the README layout is unchanged
const VIEWPORT = { width: 1280, height: 1028 };

// Shown in the address bar of the frame. The live demo really is served here,
// so nothing on the screenshots is invented.
const PUBLIC_ORIGIN = 'aker-dev.github.io/microfolio';

/**
 * A raw capture reads as a truncated page rather than a product, so each one is
 * composed into a browser window before being written out. Playwright only
 * renders page content, hence the second pass: the capture goes back in as a
 * data: URI and the frame around it is captured in turn.
 *
 * The chrome is deliberately microfolio's own — black and white, IBM Plex, a
 * thin border — rather than an imitation of any operating system.
 */
function frameTemplate(dataUri, address, theme) {
	const dark = theme === 'dark';
	const ink = dark ? '#fff' : '#000';
	const surface = dark ? 'oklch(26.9% 0 0)' : '#fff';
	const page = dark ? 'oklch(20.5% 0 0)' : 'oklch(97% 0 0)';
	const muted = dark ? 'rgba(255,255,255,.6)' : 'rgba(0,0,0,.55)';
	const field = dark ? 'oklch(20.5% 0 0)' : 'oklch(97% 0 0)';

	return `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.bunny.net/css?family=ibm-plex-sans:400,600&display=swap">
<style>
  * { box-sizing: border-box; }
  body { margin: 0; background: ${page}; font-family: 'IBM Plex Sans', sans-serif; }
  /* The padding is what keeps the drop shadow inside the captured element */
  #shot { padding: 40px; display: inline-block; }
  .window {
    border: 1px solid ${ink};
    border-radius: 10px;
    overflow: hidden;
    background: ${surface};
    box-shadow: 0 18px 40px rgba(0,0,0,${dark ? '.5' : '.14'});
  }
  .bar {
    display: flex; align-items: center; gap: 14px;
    padding: 10px 14px;
    border-bottom: 1px solid ${ink};
    background: ${surface};
  }
  .dots { display: flex; gap: 6px; flex: 0 0 auto; }
  .dots i { width: 10px; height: 10px; border-radius: 50%; border: 1px solid ${ink}; display: block; }
  .address {
    flex: 1; text-align: center;
    font-size: 12px; color: ${muted};
    background: ${field};
    border: 1px solid ${muted};
    border-radius: 999px;
    padding: 4px 12px;
    max-width: 420px; margin: 0 auto;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .spacer { flex: 0 0 46px; }
  img { display: block; width: ${VIEWPORT.width}px; height: auto; }
</style></head>
<body><div id="shot"><div class="window">
  <div class="bar">
    <span class="dots"><i></i><i></i><i></i></span>
    <span class="address">${address}</span>
    <span class="spacer"></span>
  </div>
  <img src="${dataUri}" alt="">
</div></div></body></html>`;
}

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
	{ name: 'microfolio_home', path: '/' },
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

async function capture(browser, context, shots, theme) {
	const page = await context.newPage();
	// Reused across shots; its own viewport only has to be big enough to hold
	// the frame, which is captured by element rather than by viewport
	const framer = await browser.newPage({
		viewport: { width: VIEWPORT.width + 120, height: 600 }
	});

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

		const raw = await page.screenshot();
		const address = PUBLIC_ORIGIN + shot.path;
		await framer.setContent(
			frameTemplate(`data:image/png;base64,${raw.toString('base64')}`, address, theme),
			{ waitUntil: 'load' }
		);
		// The webfont has to be in before the address bar is captured
		await framer.evaluate(() => document.fonts.ready);

		const file = join(outDir, `${shot.name}.png`);
		await framer.locator('#shot').screenshot({ path: file });
		console.log(`  ✓ ${shot.name}.png  —  ${address}`);
	}

	await framer.close();
	await page.close();
}

async function main() {
	await mkdir(outDir, { recursive: true });

	const browser = await chromium.launch();
	try {
		console.log(`Capturing ${BASE} at ${VIEWPORT.width}x${VIEWPORT.height}`);

		const light = await browser.newContext({ viewport: VIEWPORT, colorScheme: 'light' });
		await capture(browser, light, LIGHT, 'light');
		await light.close();

		const dark = await browser.newContext({ viewport: VIEWPORT, colorScheme: 'dark' });
		await capture(browser, dark, DARK, 'dark');
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
