import { loadProjects } from '$lib/utils/projects.js';
import { absoluteUrl } from '$lib/utils/seo.js';

export const prerender = true;

// The four views, then a page per project. Built from loadProjects() — the same
// loader the views themselves use — so adding a project adds a sitemap entry
// with nothing to remember.
const VIEWS = ['/', '/projects/', '/list/', '/map/', '/about/'];

function urlEntry(path, lastmod) {
	const modified = lastmod ? `\n\t\t<lastmod>${lastmod}</lastmod>` : '';
	return `\t<url>\n\t\t<loc>${absoluteUrl(path)}</loc>${modified}\n\t</url>`;
}

export async function GET() {
	const projects = await loadProjects();

	const entries = [
		...VIEWS.map((path) => urlEntry(path)),
		...projects.map((project) =>
			// A project's date is the one thing here that says when the page last
			// meant something different
			urlEntry(`/projects/${project.slug}/`, new Date(project.date).toISOString().slice(0, 10))
		)
	];

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`,
		{ headers: { 'Content-Type': 'application/xml' } }
	);
}
