import { siteConfig } from '$lib/config.js';

export async function handle({ event, resolve }) {
	const response = await resolve(event, {
		transformPageChunk: ({ html }) => {
			return html.replace('<html lang="en">', `<html lang="${siteConfig.locale}">`);
		}
	});

	return response;
}