/**
 * The current theme, and a way to follow it.
 *
 * The site records its theme in two places, and anything reading it from
 * JavaScript has to know about both: an explicit choice puts a `dark` or
 * `light` class on `:root` — written by the toggle in `AkFooter` and replayed
 * before first paint by the inline script in `app.html` — while with no choice
 * recorded the `prefers-color-scheme` media query decides on its own.
 *
 * CSS handles that pair without help. The map does not: it has to pick a
 * basemap style, which is a value, not a rule.
 */

const QUERY = '(prefers-color-scheme: dark)';

/** @returns {'light' | 'dark'} */
export function getTheme() {
	if (typeof document === 'undefined') return 'light';

	const root = document.documentElement;
	if (root.classList.contains('dark')) return 'dark';
	if (root.classList.contains('light')) return 'light';

	return window.matchMedia(QUERY).matches ? 'dark' : 'light';
}

/**
 * Calls back whenever the theme changes, and returns a function that stops
 * listening. The callback only fires on an actual change: the class attribute
 * is rewritten on every toggle, including when it lands on the value it already
 * held.
 *
 * @param {(theme: 'light' | 'dark') => void} callback
 * @returns {() => void}
 */
export function onThemeChange(callback) {
	if (typeof document === 'undefined') return () => {};

	let current = getTheme();

	const notify = () => {
		const next = getTheme();
		if (next === current) return;
		current = next;
		callback(next);
	};

	// The footer toggle swaps a class on :root...
	const observer = new MutationObserver(notify);
	observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

	// ...and with no explicit choice stored, the system preference is what moves.
	const media = window.matchMedia(QUERY);
	media.addEventListener('change', notify);

	return () => {
		observer.disconnect();
		media.removeEventListener('change', notify);
	};
}
