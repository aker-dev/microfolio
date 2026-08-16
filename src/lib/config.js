export const siteConfig = {
	title: 'microfolio',
	description: 'static portfolio generator',
	author: 'AKER',

	// Internationalization config
	locale: 'en', // 'en', 'fr'

	// Image lightbox
	lightbox: {
		// Delay in milliseconds before the controls fade out while the visitor is
		// idle. Any mouse move, key press or touch brings them back. 0 keeps them
		// on screen permanently.
		hideControlsDelay: 3000
	},

	// Map basemap
	map: {
		// OpenFreeMap: OpenStreetMap the world over, no API key, and its TileJSON
		// carries the attribution so MapLibre credits it without being told.
		//
		// Positron and Dark are the two neutral styles it publishes — measured, one
		// off-grey colour out of seventeen and none out of eleven. Bright and
		// Liberty are handsome but mostly coloured, and the map would then be the
		// only coloured surface in the site.
		styles: {
			light: 'https://tiles.openfreemap.org/styles/positron',
			dark: 'https://tiles.openfreemap.org/styles/dark'
		},

		// The tiles stop at zoom 14 and MapLibre overzooms past that
		maxZoom: 18,

		// How far fitting the markers may zoom in. Without it, filtering down to a
		// single project frames its roof.
		fitMaxZoom: 12
	},

	// Social links
	socialLinks: {
		github: 'https://github.com/yourusername',
		linkedin: 'https://linkedin.com/in/yourusername',
		instagram: 'https://instagram.com/yourusername'
	},

	// Navigation
	navigation: [
		{ name: 'nav.home', href: '/' },
		{ name: 'nav.about', href: '/about' },
		{ name: 'nav.projects', href: '/projects' },
		{ name: 'nav.list', href: '/list' },
		{ name: 'nav.map', href: '/map' }
		// ...
	]
};
