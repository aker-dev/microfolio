export async function handle({ event, resolve }) {
	const response = await resolve(event, {
		transformPageChunk: ({ html, done }) => {
			if (done) {
				// Transforme tous les liens CSS en preload + defer
				return html.replace(
					/<link rel="stylesheet"([^>]*href="[^"]*\.css"[^>]*)>/gi,
					(match, attrs) => {
						const href = match.match(/href="([^"]*)"/)?.[1];
						return `<link rel="preload"${attrs} as="style" onload="this.onload=null;this.rel='stylesheet'">
                    <noscript><link rel="stylesheet"${attrs}></noscript>`;
					}
				);
			}
			return html;
		}
	});

	return response;
}
