import { join } from 'path';
import { error } from '@sveltejs/kit';
import { loadMarkdownPage } from '$lib/utils/markdown.js';

export async function load() {
	const path = join(process.cwd(), 'content/legal.md');

	try {
		return { page: await loadMarkdownPage(path) };
	} catch (err) {
		console.error('Error loading legal page content:', err);
		throw error(404, 'legal page content not found');
	}
}
