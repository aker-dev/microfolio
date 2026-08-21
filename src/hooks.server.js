import { siteConfig } from '$lib/config.js';
import { getTextDirection } from '$lib/utils/locale.js';

// What a site configured before the font block existed falls back to — the
// typeface microfolio has always shipped with, rather than none at all.
export const DEFAULT_FONT = {
	url: 'https://fonts.bunny.net/css?family=ibm-plex-sans:400,400i,600&display=swap',
	family: "'IBM Plex Sans', sans-serif"
};

const attr = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

/**
 * The head markup for the configured typeface: its stylesheet, preconnected,
 * and the family as the page's default font. The style is deliberately outside
 * any layer, so it wins over the @theme default Tailwind puts in one.
 */
export function fontHead(font = DEFAULT_FONT) {
	const parts = [];
	if (font.url) {
		const origin = new URL(font.url).origin;
		parts.push(
			`<link rel="preconnect" href="${attr(origin)}" />`,
			`<link rel="dns-prefetch" href="${attr(origin)}" />`,
			`<link rel="stylesheet" href="${attr(font.url)}" />`
		);
	}
	if (font.family) {
		parts.push(`<style>:root{--default-font-family:${font.family.replace(/[<>]/g, '')}}</style>`);
	}
	return parts.join('\n\t\t');
}

export async function handle({ event, resolve }) {
	const locale = siteConfig.locale;
	const direction = getTextDirection(locale);
	const font = fontHead(siteConfig.font);

	const response = await resolve(event, {
		transformPageChunk: ({ html }) =>
			html
				.replace('%sveltekit.lang%', locale)
				.replace('%sveltekit.dir%', direction)
				.replace('%microfolio.font%', () => font)
	});

	return response;
}
