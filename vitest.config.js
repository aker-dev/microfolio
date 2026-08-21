import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Deliberately does not load the SvelteKit plugin: these tests cover the plain
// content-parsing modules and the update script, so they stay fast and free of
// build machinery.
export default defineConfig({
	resolve: {
		alias: {
			$lib: fileURLToPath(new URL('./src/lib', import.meta.url))
		}
	},
	test: {
		include: ['src/**/*.test.js', 'scripts/**/*.test.js'],
		environment: 'node'
	}
});
