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
		// Plan IGN in its grey style, served by the Géoplateforme: French public
		// data, no API key, and already entirely neutral — which is why the map no
		// longer needs a desaturating filter to sit inside this site.
		style: 'https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/gris.json',

		// Plan IGN only covers the whole world down to zoom 6. Past it there is
		// detail across France and empty tiles everywhere else — Rome returns 42
		// bytes at zoom 7. Capping here keeps the map populated wherever a project
		// happens to be, at the cost of never reaching street scale.
		maxZoom: 6,

		// Written out because the IGN carries none: neither the style, nor its
		// TileJSON, nor metadata.json holds an `attribution` field, so MapLibre has
		// nothing to display and the credit would simply go missing.
		attribution: '© IGN — Géoplateforme'
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
