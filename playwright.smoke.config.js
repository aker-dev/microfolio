import { defineConfig } from '@playwright/test';
import { getBasePath } from './src/lib/utils/paths.js';

// The end-to-end suite drives `pnpm dev`, so nothing in it ever loads the site
// that actually ships. This config is the other half: it serves `build/` and
// walks the pages of it. See e2e/smoke/built-site.spec.js for what it looks for.
const PORT = Number(process.env.PLAYWRIGHT_SMOKE_PORT ?? 2001);

// Where the preview server puts the site: svelte.config.js takes `paths.base`
// from this same function, so reading it here keeps one definition rather than
// writing the sub-path a second time.
//
// It answers on NODE_ENV, and `vite preview` sets that to production itself
// whatever the build was made with — which is why the site is under /microfolio
// there even after a plain `pnpm build`, and why the root 404s. The `test:smoke`
// script therefore sets NODE_ENV=production too, so this agrees with the server
// by construction rather than by coincidence.
//
// The trailing slash matters: Playwright resolves a page's URL against this one
// with `new URL()`, and without it the last segment is a filename to be replaced
// rather than a directory to descend from. The spec's routes are relative for
// the same reason — a leading slash would jump back to the origin root.
const BASE_URL = `http://localhost:${PORT}${getBasePath()}/`;

export default defineConfig({
	testDir: 'e2e/smoke',
	fullyParallel: false,
	forbidOnly: Boolean(process.env.CI),
	// No retries: a smoke test that only passes on the second attempt has found
	// something, and the deploy should stop rather than shrug
	retries: 0,
	reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
	use: {
		baseURL: BASE_URL,
		trace: 'retain-on-failure'
	},
	webServer: {
		// strictPort because vite.config.js deliberately leaves it off: a preview
		// that quietly moved to the next free port would leave this suite reporting
		// on whatever else holds 2001
		command: `pnpm preview --port ${PORT} --strictPort`,
		// The base itself, not the origin root: with a base path the root 404s
		url: BASE_URL,
		// Never reuse: the whole point is the artefact this build just produced
		reuseExistingServer: false,
		timeout: 120_000
	}
});
