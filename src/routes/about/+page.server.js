import { join } from 'path';
import { error } from '@sveltejs/kit';
import { loadMarkdownPage } from '$lib/utils/markdown.js';
import { getBasePath } from '$lib/utils/paths.js';

export async function load() {
	const aboutPath = join(process.cwd(), 'content/about.md');

	try {
		return { page: await loadMarkdownPage(aboutPath, `${getBasePath()}/content`) };
	} catch (err) {
		console.error('Error loading about page content:', err);
		throw error(404, 'About page content not found');
	}
}
