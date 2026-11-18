import { describe, expect, it, vi } from 'vitest';

// Pinned rather than read from the site: these tests also run on a fork whose
// config is its own, and they must stay green there.
vi.mock('../config.js', () => ({
	siteConfig: {
		title: 'Folio',
		description: 'Work of a studio',
		url: 'https://example.test/folio',
		locale: 'fr'
	}
}));
import { jsonLdScript, projectJsonLd, websiteJsonLd } from './structuredData.js';

const lichtspiel = {
	slug: 'lichtspiel',
	title: 'Lichtspiel Pavilion',
	date: '2025-12-08',
	location: 'Rodez, France',
	coordinates: [44.3506, 2.575],
	description: 'Three rotating screens',
	type: 'art',
	tags: ['light', 'installation'],
	authors: [
		{ name: 'Theo Marchand', role: 'Artist' },
		{ name: 'Vera Lindqvist', role: 'Kinetic Consultant' }
	]
};

describe('websiteJsonLd', () => {
	it('names the site under the id every project points back to', () => {
		expect(websiteJsonLd()).toEqual({
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			'@id': 'https://example.test/folio/#website',
			name: 'Folio',
			url: 'https://example.test/folio/',
			description: 'Work of a studio',
			inLanguage: 'fr'
		});
	});
});

describe('projectJsonLd', () => {
	it('describes a complete project as a CreativeWork', () => {
		const data = projectJsonLd(lichtspiel, '/content/projects/lichtspiel/og.jpg');

		expect(data).toMatchObject({
			'@type': 'CreativeWork',
			name: 'Lichtspiel Pavilion',
			url: 'https://example.test/folio/projects/lichtspiel/',
			image: 'https://example.test/folio/content/projects/lichtspiel/og.jpg',
			dateCreated: '2025-12-08',
			genre: 'art',
			keywords: 'light, installation',
			creator: [
				{ '@type': 'Person', name: 'Theo Marchand', jobTitle: 'Artist' },
				{ '@type': 'Person', name: 'Vera Lindqvist', jobTitle: 'Kinetic Consultant' }
			],
			isPartOf: { '@id': 'https://example.test/folio/#website' }
		});
	});

	it('keeps latitude and longitude named, so there is no order to get wrong', () => {
		expect(projectJsonLd(lichtspiel).locationCreated).toEqual({
			'@type': 'Place',
			name: 'Rodez, France',
			geo: { '@type': 'GeoCoordinates', latitude: 44.3506, longitude: 2.575 }
		});
	});

	it('leaves out what the project leaves out, rather than writing it empty', () => {
		const json = JSON.parse(
			JSON.stringify(projectJsonLd({ slug: 'bare', title: 'Bare', date: '2024' }))
		);

		expect(json).toEqual({
			'@context': 'https://schema.org',
			'@type': 'CreativeWork',
			name: 'Bare',
			url: 'https://example.test/folio/projects/bare/',
			dateCreated: '2024',
			isPartOf: {
				'@type': 'WebSite',
				'@id': 'https://example.test/folio/#website',
				name: 'Folio',
				url: 'https://example.test/folio/'
			}
		});
	});

	it('does not invent a day for a date written to the month', () => {
		expect(projectJsonLd({ ...lichtspiel, date: '2025-06' }).dateCreated).toBe('2025-06');
	});

	it('normalises a date that new Date() reads but ISO 8601 does not', () => {
		expect(projectJsonLd({ ...lichtspiel, date: 'June 14, 2025 12:00 UTC' }).dateCreated).toBe(
			'2025-06-14'
		);
		expect(projectJsonLd({ ...lichtspiel, date: new Date('2025-06-14') }).dateCreated).toBe(
			'2025-06-14'
		);
	});

	it('takes a bare string as an author name, and skips an author with none', () => {
		const data = projectJsonLd({
			...lichtspiel,
			authors: ['Ada', { role: 'Intern' }, '  ', { name: 'Bo', role: '  ' }]
		});
		// Round-tripped, so an empty jobTitle would show rather than hide as undefined
		expect(JSON.parse(JSON.stringify(data.creator))).toEqual([
			{ '@type': 'Person', name: 'Ada' },
			{ '@type': 'Person', name: 'Bo' }
		]);
	});

	it('drops coordinates that are not two numbers', () => {
		const data = projectJsonLd({ ...lichtspiel, coordinates: ['north', 'east'] });
		expect(data.locationCreated).toEqual({ '@type': 'Place', name: 'Rodez, France' });
	});
});

describe('jsonLdScript', () => {
	it('cannot be closed early by the data it carries', () => {
		const script = jsonLdScript({ name: '</script><script>alert(1)</script>' });

		expect(script.match(/<\/script>/g)).toHaveLength(1);
		expect(script.endsWith('</script>')).toBe(true);
		const json = script.slice(script.indexOf('>') + 1, -'</script>'.length);
		expect(JSON.parse(json).name).toBe('</script><script>alert(1)</script>');
	});
});
