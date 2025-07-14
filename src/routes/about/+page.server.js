import { readFile } from 'fs/promises';
import { join } from 'path';
import { parse } from 'yaml';
import { marked } from 'marked';
import { error } from '@sveltejs/kit';

export async function load() {
	const aboutPath = join(process.cwd(), 'content/about.md');

	try {
		const content = await readFile(aboutPath, 'utf-8');
		const [, frontmatter, ...markdownParts] = content.split('---');
		const markdownContent = markdownParts.join('---').trim();

		const metadata = parse(frontmatter);
		const htmlContent = marked(markdownContent);

		return {
			page: {
				...metadata,
				content: htmlContent
			}
		};
	} catch (err) {
		console.error('Error loading about page content:', err);
		throw error(404, 'About page content not found');
	}
}
