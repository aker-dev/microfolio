import { describe, expect, it } from 'vitest';
import { DEFAULT_FONT, fontHead } from './hooks.server.js';

describe('fontHead', () => {
	it('preconnects to the provider, loads the stylesheet and sets the family', () => {
		const head = fontHead({
			url: 'https://fonts.bunny.net/css?family=space-grotesk:400,700&display=swap',
			family: "'Space Grotesk', sans-serif"
		});
		expect(head).toContain('<link rel="preconnect" href="https://fonts.bunny.net" />');
		expect(head).toContain('<link rel="dns-prefetch" href="https://fonts.bunny.net" />');
		// The & of the query string is escaped, as an attribute wants it
		expect(head).toContain(
			'href="https://fonts.bunny.net/css?family=space-grotesk:400,700&amp;display=swap"'
		);
		expect(head).toContain(
			"<style>:root{--default-font-family:'Space Grotesk', sans-serif}</style>"
		);
	});

	it('loads nothing when the address is empty, but still names the family', () => {
		const head = fontHead({ url: '', family: 'Georgia, serif' });
		expect(head).not.toContain('<link');
		expect(head).toBe('<style>:root{--default-font-family:Georgia, serif}</style>');
	});

	it('falls back to the typeface microfolio ships with when the config has no font block', () => {
		expect(fontHead(undefined)).toBe(fontHead(DEFAULT_FONT));
		expect(fontHead()).toContain('ibm-plex-sans');
	});

	it('keeps markup out of the style block', () => {
		expect(fontHead({ url: '', family: 'Georgia</style><script>x</script>' })).not.toContain(
			'<script'
		);
	});
});
