import { join } from 'path';
import { error } from '@sveltejs/kit';
import { loadMarkdownPage } from '$lib/utils/markdown.js';
import { loadProjects } from '$lib/utils/projects.js';
import { getBasePath } from '$lib/utils/paths.js';

export async function load() {
	const indexPath = join(process.cwd(), 'content/index.md');

	try {
		const page = await loadMarkdownPage(indexPath, `${getBasePath()}/content`);

		// loadProjects() already sorts by date, newest first
		const projects = await loadProjects();
		const featuredProjects = projects.filter((project) => project.featured === true);

		return { page, featuredProjects };
	} catch (err) {
		console.error('Error loading home page content:', err);
		throw error(404, 'Page content not found');
	}
}
