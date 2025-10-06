import adapter from '@sveltejs/adapter-static';
import { readdir } from 'fs/promises';
import { join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function createConfig() {
	const entries = ['/', '/projects', '/list', '/map', '/about'];

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
			paths: {
				base:
					process.env.CUSTOM_DOMAIN === 'true'
						? ''
						: process.env.NODE_ENV === 'production'
							? '/microfolio'
							: ''
			},
			prerender: {
				handleHttpError: 'warn',
				entries
			}
		}
	};
}

export default await createConfig();
