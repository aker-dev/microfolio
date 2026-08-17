import { absoluteUrl } from '$lib/utils/seo.js';

export const prerender = true;

// An endpoint rather than a file in static/, because the one line that matters
// is the sitemap's absolute URL, and only siteConfig.url knows it.
export function GET() {
	return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`, {
		headers: { 'Content-Type': 'text/plain' }
	});
}
