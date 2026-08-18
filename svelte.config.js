import adapter from '@sveltejs/adapter-static';
import { readdir } from 'fs/promises';
import { join } from 'path';
import dotenv from 'dotenv';
import { getBasePath } from './src/lib/utils/paths.js';

// Load environment variables
dotenv.config();

async function createConfig() {
	// Explicit, so the two endpoints have to be named: SvelteKit finds pages by
	// crawling links, and nothing on the site links to a sitemap or to robots.txt.
	const entries = ['/', '/projects', '/list', '/map', '/about', '/sitemap.xml', '/robots.txt'];

	try {
		const projectsPath = join(process.cwd(), 'content/projects');
		const projectFolders = await readdir(projectsPath);

		for (const folder of projectFolders) {
			if (folder.startsWith('.') || folder.endsWith('.zip')) continue;
			entries.push(`/projects/${folder}`);
		}

		console.log(`Generated ${entries.length} prerender entries`);
	} catch (error) {
		console.error('Error generating entries:', error);
	}

	/** @type {import('@sveltejs/kit').Config} */
	return {
		kit: {
			adapter: adapter({
				pages: 'build',
				assets: 'build',
				fallback: '404.html',
				precompress: false,
				strict: true
			}),
			// Derived from siteConfig.url, the one place the address is written
			paths: { base: getBasePath() },
			prerender: {
				handleHttpError: 'warn',
				entries
			}
		}
	};
}

export default await createConfig();
