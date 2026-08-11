// Arabic, Hebrew, Persian, Urdu, etc.
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

/**
 * Text direction for a locale code. Used both when prerendering (hooks.server.js)
 * and on the client when the locale changes (+layout.svelte).
 */
export function getTextDirection(locale) {
	return RTL_LANGUAGES.includes(locale) ? 'rtl' : 'ltr';
}
