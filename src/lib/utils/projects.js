import { readdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { parse } from 'yaml';

// Get base path from environment - same logic as svelte.config.js
const basePath =
	process.env.CUSTOM_DOMAIN === 'true'
		? ''
		: process.env.NODE_ENV === 'production'
			? '/microfolio'
			: '';

export async function loadProjects() {
	const projectsPath = join(process.cwd(), 'content/projects');

	try {
		const projectFolders = await readdir(projectsPath);
		const projects = [];

		for (const folder of projectFolders) {
			if (folder.startsWith('.') || folder.endsWith('.zip')) continue;

			const indexPath = join(projectsPath, folder, 'index.md');

			try {
				const content = await readFile(indexPath, 'utf-8');
				const [, frontmatter] = content.split('---');
				const metadata = parse(frontmatter);

				// Check if WebP thumbnail exists
				const projectPath = join(projectsPath, folder);
				const webpPath = join(projectPath, 'thumbnail.webp');
				const hasWebP = existsSync(webpPath);

				const project = {
					slug: folder,
					...metadata,
					thumbnailSrc: basePath + '/content/projects/' + folder + '/thumbnail.jpg',
					hasWebP
				};

				projects.push(project);
			} catch (err) {
				console.warn('Error loading project ' + folder + ':', err);
			}
		}

		// Sort projects by date only (newest first)
		projects.sort((a, b) => {
			return new Date(b.date) - new Date(a.date);
		});

		return projects;
	} catch (error) {
		console.error('Error loading projects:', error);
		return [];
	}
}
