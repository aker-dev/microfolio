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
