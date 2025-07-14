import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { parse } from 'yaml';

// Get base path from environment
const basePath = process.env.NODE_ENV === 'production' ? '/microfolio' : '';

export async function load() {
	const projectsPath = join(process.cwd(), 'content/projects');

	try {
		const projectFolders = await readdir(projectsPath);
		const projects = [];

		for (const folder of projectFolders) {
			// Skip hidden files and non-directories
			if (folder.startsWith('.')) continue;
			
			const projectPath = join(projectsPath, folder);
			const indexPath = join(projectPath, 'index.md');

			try {
				const content = await readFile(indexPath, 'utf-8');
				const [, frontmatter] = content.split('---');
				const metadata = parse(frontmatter);

				projects.push({
					slug: folder,
					...metadata,
					thumbnailPath: `${basePath}/content/projects/${folder}/thumbnail.jpg`
				});
			} catch (error) {
				console.warn(`Error reading project ${folder}:`, error);
			}
		}

		// Sort by date (newest first)
		projects.sort((a, b) => new Date(b.date) - new Date(a.date));

		return {
			projects
		};
	} catch (error) {
		console.error('Error loading projects:', error);
		return {
			projects: []
		};
	}
}