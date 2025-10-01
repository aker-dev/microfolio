export const siteConfig = {
	title: 'microfolio',
	description: 'static portfolio generator',
	author: 'AKER',
	version: '0.5.0-beta.2',

	// Internationalization - manual configuration
	locale: 'en', // 'en', 'fr', 'es', 'it', 'de', 'ja', 'ar'

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
