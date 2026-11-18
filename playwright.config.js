import { defineConfig } from '@playwright/test';
import { localBinCommand } from './scripts/local-bin.js';

// Overridable so the CI path (which starts its own server) can be exercised
// locally without colliding with a dev server already on the default port
const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 5555);

export default defineConfig({
	testDir: 'e2e',
	// e2e/smoke belongs to playwright.smoke.config.js, which serves the build
	// rather than the dev server this config starts
	testIgnore: 'smoke/**',
	// These tests are about browser history, which is inherently sequential
	fullyParallel: false,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 1 : 0,
	// The HTML report is what the workflow uploads when a run fails
	reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
	use: {
		baseURL: `http://localhost:${PORT}`,
		trace: 'retain-on-failure'
	},
	webServer: {
		// vite itself, not `pnpm dev`: under pnpm 12 the server outlives the stop
		// and the run never ends (scripts/local-bin.js has the whole story)
		command: localBinCommand('vite', 'vite', ['dev', '--port', PORT]),
		port: PORT,
		// Locally this picks up a dev server you already have running
		reuseExistingServer: !process.env.CI,
		timeout: 120_000
	}
});
