import { siteConfig } from '$lib/config.js';

const ROOT = siteConfig.url.replace(/\/$/, '');

/**
 * Turns a route path into the full URL a shared link or a search engine needs.
 * Relative URLs are simply ignored in Open Graph tags — which is what made the
 * previous `og:image` look present and do nothing.
 *
 * Takes the path **without** the base: `siteConfig.url` already carries it, so
 * passing `${base}/projects/foo/` would write it twice in production. Say
 * `/projects/foo/`.
 *
 * `page.url.origin` is not an option: during prerendering it is
 * `http://sveltekit-prerender`, which would bake a fictional host into every
 * page with nothing to signal it.
 *
 * @param {string} path route path, leading slash included
 */
export function absoluteUrl(path = '/') {
	return `${ROOT}${path.startsWith('/') ? path : `/${path}`}`;
}
