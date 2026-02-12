import { siteConfig } from '$lib/config.js';

function getTextDirection(locale) {
	// RTL languages: Arabic, Hebrew, Persian, Urdu, etc.
	const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
	return rtlLanguages.includes(locale) ? 'rtl' : 'ltr';
}

export async function handle({ event, resolve }) {
	const locale = siteConfig.locale;
	const direction = getTextDirection(locale);

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => {
			return html
				.replace('%sveltekit.lang%', locale)
				.replace('%sveltekit.dir%', direction);
		}
	});

	return response;
}