import { siteConfig } from '$lib/config.js';
import { getTextDirection } from '$lib/utils/locale.js';

export async function handle({ event, resolve }) {
	const locale = siteConfig.locale;
	const direction = getTextDirection(locale);

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => {
			return html.replace('%sveltekit.lang%', locale).replace('%sveltekit.dir%', direction);
		}
	});

	return response;
}
