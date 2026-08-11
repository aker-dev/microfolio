import { defineConfig } from '@playwright/test';

const PORT = 5173;

export default defineConfig({
	testDir: 'e2e',
	// These tests are about browser history, which is inherently sequential
	fullyParallel: false,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 1 : 0,
	use: {
		baseURL: `http://localhost:${PORT}`,
		trace: 'retain-on-failure'
	},
	webServer: {
		command: 'pnpm dev',
		port: PORT,
		// Locally this picks up a dev server you already have running
		reuseExistingServer: !process.env.CI,
		timeout: 120_000
	}
});
