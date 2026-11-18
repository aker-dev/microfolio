import { siteConfig } from '$lib/config.js';
import { absoluteUrl } from '$lib/utils/seo.js';

/**
 * schema.org structured data, as JSON-LD: what lets a search engine read a
 * project as a work — who made it, when, where — rather than as a page of text.
 *
 * Built only from what the site already holds. Nothing here asks for a new
 * frontmatter key or a new config key, and a field the project leaves out is
 * left out of the data too, rather than written empty.
 */

/** The site itself, under one id that every project points back to. */
function website() {
	return {
		'@type': 'WebSite',
		'@id': `${absoluteUrl('/')}#website`,
		name: siteConfig.title,
		url: absoluteUrl('/')
	};
}

/** The home page's data: the site, which is what gives results their site name. */
export function websiteJsonLd() {
	return {
		'@context': 'https://schema.org',
		...website(),
		description: siteConfig.description || undefined,
		inLanguage: siteConfig.locale || undefined
	};
}

/**
 * A project as a `CreativeWork`.
 *
 * @param {object} project  the project as the page loads it, slug included
 * @param {string} [image]  sharing image path without the base, as AkSeo takes it
 */
export function projectJsonLd(project, image) {
	return {
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: project.title,
		description: project.description || undefined,
		url: absoluteUrl(`/projects/${project.slug}/`),
		image: image ? absoluteUrl(image) : undefined,
		dateCreated: isoDate(project.date),
		// The project's type is the closest thing to a genre: architecture, art…
		genre: project.type || undefined,
		keywords:
			Array.isArray(project.tags) && project.tags.length ? project.tags.join(', ') : undefined,
		creator: creators(project.authors),
		locationCreated: place(project.location, project.coordinates),
		isPartOf: website()
	};
}

/**
 * The script tag itself. JSON is not HTML-safe: a `</script>` inside a
 * description would close the tag early and let the rest run as markup, so
 * every `<` is written as its escape — which JSON reads back as the same `<`.
 */
export function jsonLdScript(data) {
	const json = JSON.stringify(data).replace(/</g, '\\u003c');
	return `<script type="application/ld+json">${json}</script>`;
}

// The date as written when it is already ISO 8601 — `2023`, `2023-06` and
// `2023-06-14` are all valid there, and expanding `2023-06` would invent a day.
// Anything else `new Date()` accepted, since the frontmatter check let it through.
function isoDate(date) {
	if (date instanceof Date) return date.toISOString().slice(0, 10);
	const text = String(date);
	if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(text)) return text;
	return new Date(text).toISOString().slice(0, 10);
}

// The frontmatter `role` becomes `jobTitle`: what the person was on this
// project — Artist, Kinetic Consultant. A bare string is accepted, as a name.
function creators(authors) {
	if (!Array.isArray(authors)) return undefined;
	const people = authors
		.map((author) => (typeof author === 'string' ? { name: author } : author))
		.filter((author) => typeof author?.name === 'string' && author.name.trim())
		.map(({ name, role }) => ({
			'@type': 'Person',
			name: name.trim(),
			jobTitle: typeof role === 'string' && role.trim() ? role.trim() : undefined
		}));
	return people.length ? people : undefined;
}

// Frontmatter coordinates are [latitude, longitude] — schema.org names both, so
// there is no order to swap here, unlike for MapLibre.
function place(location, coordinates) {
	const [latitude, longitude] = Array.isArray(coordinates) ? coordinates.map(Number) : [];
	const geo =
		Number.isFinite(latitude) && Number.isFinite(longitude)
			? { '@type': 'GeoCoordinates', latitude, longitude }
			: undefined;
	if (!location && !geo) return undefined;
	return { '@type': 'Place', name: location || undefined, geo };
}
