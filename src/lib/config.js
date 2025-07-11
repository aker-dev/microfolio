export const siteConfig = {
	title: 'µFolio',
	description: 'static site generator',
	author: 'AKER',

	// Navigation
	navigation: [
		{ name: 'Home', href: '/' },
		{ name: 'Projects', href: '/projects' }
		// ...
	],

	// Project types
	projectTypes: [
		{ value: 'architecture', label: 'Architecture' },
		{ value: 'design', label: 'Design' }
		// ...
	],

	// Map configuration
	mapConfig: {
		center: [46.603354, 1.888334],
		zoom: 6
		// ...
	}
};
