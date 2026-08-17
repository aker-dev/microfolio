import { siteConfig } from '../config.js';

/**
 * The sub-path this site is served under, taken from `siteConfig.url` — the one
 * place the address is written.
 *
 *   https://example.com          → ''
 *   https://you.github.io/folio  → '/folio'
 *
 * Empty in development whatever the URL says, so `pnpm dev` keeps serving on
 * `/` rather than moving the whole site under a sub-path locally, which would
 * take the screenshots and the end-to-end suite with it.
 *
 * `svelte.config.js` imports this so there is a single definition rather than
 * two that have to agree.
 */
export function getBasePath() {
	if (process.env.NODE_ENV !== 'production') return '';

	try {
		return new URL(siteConfig.url).pathname.replace(/\/$/, '');
	} catch {
		console.warn(`siteConfig.url is not a valid URL: ${siteConfig.url}. Serving from the root.`);
		return '';
	}
}
