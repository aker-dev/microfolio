import { join } from 'path';
import { error } from '@sveltejs/kit';
import { loadMarkdownPage } from '$lib/utils/markdown.js';
import { getBasePath } from '$lib/utils/paths.js';

export async function load() {
	const path = join(process.cwd(), 'content/privacy.md');

	try {
		return { page: await loadMarkdownPage(path, `${getBasePath()}/content`) };
	} catch (err) {
		console.error('Error loading privacy page content:', err);
		throw error(404, 'privacy page content not found');
	}
}
