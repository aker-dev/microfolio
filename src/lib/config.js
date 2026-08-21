export const siteConfig = {
	// --- Your site -------------------------------------------------------------
	title: 'microfolio',
	description: 'static portfolio generator',
	author: 'AKER',

	// Where this site is published, in full and without a trailing slash. It is
	// the single place the address is written: the base path is taken from it, and
	// so is every absolute URL — the ones shared links and search engines need,
	// which cannot be relative.
	//
	//   https://example.com            → base '', pages at the root
	//   https://you.github.io/folio    → base '/folio'
	//
	// A custom domain on GitHub Pages is set in the repository settings and at
	// your registrar, not here and not in a CNAME file: published through a
	// Actions workflow, as this project is, GitHub ignores any CNAME in the build.
	url: 'https://aker-dev.github.io/microfolio',

	// Interface language: 'en' or 'fr' (see src/lib/i18n.js to add one)
	locale: 'en',

	// --- Navigation and links --------------------------------------------------
	// The menu, in order. Labels are translation keys from src/lib/locales/.
	navigation: [
		{ name: 'nav.home', href: '/' },
		{ name: 'nav.about', href: '/about' },
		{ name: 'nav.projects', href: '/projects' },
		{ name: 'nav.list', href: '/list' },
		{ name: 'nav.map', href: '/map' }
		// ...
	],

	// Shown as icons in the footer. Remove the ones you don't use.
	socialLinks: {
		github: 'https://github.com/aker-dev/microfolio',
		linkedin: 'https://www.linkedin.com/company/aker-network/',
		instagram: 'https://www.instagram.com/aker.pro/'
	},

	// --- Sharing and images ----------------------------------------------------
	// Sharing image for pages that are not a project — the home page above all,
	// which has no image of its own. A file in static/, 1200x630, or empty for
	// none. Projects use their own thumbnail and need nothing here.
	ogImage: '/og.jpg',

	images: {
		// Generates the WebP thumbnails, and the sharing images, as part of the
		// build. Turn it off only if you produce them another way: without it a
		// build publishes whatever happens to be lying around.
		optimizeOnBuild: true
	},

	// --- Lightbox --------------------------------------------------------------
	lightbox: {
		// Delay in milliseconds before the controls fade out while the visitor is
		// idle. Any mouse move, key press or touch brings them back. 0 keeps them
		// on screen permanently.
		hideControlsDelay: 3000,
		// The details panel always shows an image's title, caption and credit.
		// true adds what else the file carries — camera and exposure, date and
		// location, keywords. false keeps the panel to the editorial three.
		showExtendedMetadata: true
	}
};
