// The tracked example project — the one a fresh clone contains, the one the
// getting-started guide tells people to copy, and the page five of the twelve
// documentation screenshots are taken on. It follows the same model as the
// thirty zipped demo projects (seeded plates, real PDF) but is written into
// content/projects/example-project/ directly, never into the zip, and its
// images get a full EXIF/IPTC treatment via exiftool: the lightbox metadata
// panel is demoed on this project, so its plates carry everything the panel
// can show — headline, credit, camera, exposure, GPS, city.
//
// Its body doubles as the typography stress test: both list kinds, a
// blockquote, an h3 under an h2, a horizontal rule, bold and italic.

export const exampleProject = {
	slug: 'example-project',
	title: 'Lichtspiel Pavilion',
	date: '2025-12-08',
	location: 'Rodez, France',
	coordinates: [44.3506, 2.575],
	description:
		'A walk-in homage to the Light-Space Modulator: three rotating aluminium screens, four projectors and one December week of Aveyron fog, staged for the winter light festival of Rodez',
	type: 'art',
	tags: ['light', 'installation', 'performance'],
	authors: [
		{ name: 'Theo Marchand', role: 'Artist' },
		{ name: 'Vera Lindqvist', role: 'Kinetic Consultant' }
	],
	extras: {
		owner: 'Ville de Rodez',
		status: 'delivered',
		surface_area: '240 m²',
		cost: '310 000 €'
	},
	featured: true,
	body: `## The machine that paints with light

In 1930, after eight years of tinkering, the Bauhaus stage workshop's restless
polymath finished a machine whose only job was to move light around a room. The
_Light-Space Modulator_ was never meant to be looked at — it was meant to be
looked **through**: the sculpture is the shadows, reflections and sweeps it
throws on the walls.

The Lichtspiel Pavilion scales that idea to a public square. Three perforated
aluminium screens, each four metres tall, rotate at different speeds inside a
scaffold cube. Four projectors cross-fire through them. The artwork is not the
cube — it is the 240 square metres of moving light around it, and the fog of a
Rodez December — the plateau earns it — turns the beams themselves into visible volumes.

> Light is the material. The machine is only the brush.
>
> — programme note, opening night

## Choreography for three screens

The screens run a 22-minute cycle, composed rather than programmed:

1. **Overture** — one screen turning, one projector, hard white light. The
   square learns the geometry.
2. **Interference** — all three screens, speeds in a 3:4:5 ratio, so the
   pattern only repeats once per cycle. Colour arrives, primaries first.
3. **Fog solo** — projectors dim to blue, and for four minutes the piece
   belongs to the weather.
4. **Coda** — everything slows to a stop; the last minute is a single static
   shadow, held like a breath.

### What the fog changed

The piece was composed in a rendering engine with clean air. Rodez in December
has other ideas, and they were better:

- beams read as _solids_, so the choreography plays in three dimensions
- attendance peaked on the foggiest night — 8,400 people by the city's count
- the blue "fog solo" section was written on site, two nights before opening

---

The pavilion ran for the four nights of the festival and is built to tour:
screens, drives and projectors pack into two standard crates, and the scaffold
cube is hired locally at each venue. Winter cities with a fog habit are top of
the wish list.`,
	// exiftool arguments shared by every image; per-plate fields come from
	// plateExif(). Fictional but plausible documentation-photo metadata.
	exifCommon: {
		Artist: 'Theo Marchand',
		Copyright: '© 2025 Theo Marchand',
		'IPTC:Credit': 'Studio Marchand',
		'IPTC:Source': 'microfolio demo content',
		'IPTC:By-line': 'Theo Marchand',
		'IPTC:CopyrightNotice': '© 2025 Theo Marchand',
		'IPTC:City': 'Rodez',
		'IPTC:Country-PrimaryLocationName': 'France',
		'IPTC:Sub-location': 'Place de la Cité',
		Make: 'Fujifilm',
		Model: 'X-T5',
		LensModel: 'XF 23mm F1.4 R LM WR',
		FocalLength: '23',
		GPSLatitude: '44.3506',
		GPSLatitudeRef: 'N',
		GPSLongitude: '2.5750',
		GPSLongitudeRef: 'E'
	},
	plateExif: [
		{
			// thumbnail.jpg
			'IPTC:Headline': 'Lichtspiel Pavilion — the cube at dusk',
			ImageDescription: 'The pavilion at dusk, screens at rest before the first cycle',
			FNumber: '2.8',
			ExposureTime: '1/60',
			ISO: '800',
			DateTimeOriginal: '2025:12:05 17:48:00'
		},
		{
			// images/plate-01.jpg
			'IPTC:Headline': 'Plate I — Overture',
			ImageDescription: 'Overture: one screen turning under hard white light',
			'IPTC:Keywords': ['light', 'installation', 'kinetic'],
			FNumber: '1.4',
			ExposureTime: '1/125',
			ISO: '1600',
			DateTimeOriginal: '2025:12:05 20:12:00'
		},
		{
			// images/plate-02.jpg
			'IPTC:Headline': 'Plate II — Interference',
			ImageDescription: 'Interference: three screens in a 3:4:5 speed ratio',
			'IPTC:Keywords': ['light', 'installation', 'kinetic'],
			FNumber: '2',
			ExposureTime: '1/60',
			ISO: '3200',
			DateTimeOriginal: '2025:12:06 21:40:00'
		},
		{
			// images/plate-03.jpg
			'IPTC:Headline': 'Plate III — Fog solo',
			ImageDescription: 'Fog solo: the beams made solid by the December air',
			'IPTC:Keywords': ['light', 'fog', 'night'],
			FNumber: '1.4',
			ExposureTime: '1/30',
			ISO: '6400',
			DateTimeOriginal: '2025:12:07 22:05:00'
		}
	]
};
