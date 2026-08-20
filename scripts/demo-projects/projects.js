// The thirty demo projects, written by hand. This file is deliberately the
// slow part of the generator: the old set collapsed into wallpaper because one
// description string and one body template were stamped a hundred times. Every
// entry here has its own prose; the fictional studios and people recur across
// projects so the author filter and credit lines read like a real scene.
//
// Rules the generator relies on:
// - every project carries the `bauhaus` tag: the e2e pagination specs filter on
//   one tag and need 21+ matches (see e2e/navigation.spec.js)
// - eleven entries are featured — with example-project that makes twelve, which
//   fills the homepage grid at both md (3-col) and lg (4-col) breakpoints
// - `extras` holds the optional metadata block (owner/status/surface_area/cost)
//   and is only present on some entries, mirroring how real portfolios use it

export const projects = [
	{
		slug: 'ilm-park-reading-pavilion',
		title: 'Reading Pavilion on the Ilm',
		date: '2024-04-12',
		location: 'Weimar, Germany',
		coordinates: [50.9755, 11.3312],
		description:
			'A timber pavilion in the Ilm park that lends books and shade in equal measure, a short walk from where the school that started everything held its first classes',
		type: 'architecture',
		tags: ['bauhaus', 'architecture', 'timber', 'public-space'],
		authors: [
			{ name: 'Emil Kessler', role: 'Partner, Studio Vierkant' },
			{ name: 'Marta Duran', role: 'Project Architect' }
		],
		featured: true,
		body: `## A shelf in the landscape

The brief asked for a summer reading room the city could unlock in April and forget about until October. We answered with a single gesture: one long shelf, folded three times, that becomes in turn a bench, a roof and a wall of books.

The pavilion sits on six screw piles and touches the park nowhere else. Every joint is dry — bolted larch, no glue, no concrete — so the building can leave the meadow as quietly as it arrived.

## Reading as a public act

Libraries indoors ask for silence. Outdoors, the contract loosens: children negotiate picture books, someone reads match reports aloud, a student sleeps under an open dictionary. The folded shelf shapes three rooms with three volumes of privacy, and the city's librarians restock it with a bicycle trailer.

- 1,400 books on loan, no card required
- 62 linear metres of shelf, of which 19 are bench
- zero fixings into the ground plane

The city asked us what happens when books get wet. They dry, mostly.`
	},
	{
		slug: 'dessau-tram-shelters',
		title: 'Tram Shelter System for Dessau',
		date: '2022-09-08',
		location: 'Dessau, Germany',
		coordinates: [51.8367, 12.2455],
		description:
			'One steel module, four configurations, nineteen tram stops — a shelter family for the city that taught the world to build in series',
		type: 'architecture',
		tags: ['bauhaus', 'architecture', 'infrastructure', 'prefabrication'],
		authors: [
			{ name: 'Emil Kessler', role: 'Partner, Studio Vierkant' },
			{ name: 'Ruth Anders', role: 'Structural Engineer' }
		],
		featured: false,
		extras: {
			owner: 'Dessauer Verkehrsgesellschaft',
			status: 'delivered',
			surface_area: '19 × 14 m²',
			cost: '840 000 €'
		},
		body: `## Serial production, seriously

Dessau is where industrial series stopped being a compromise and became a language. Designing street furniture here comes with homework. Our shelter is one folded steel portal, produced flat, galvanised, and bolted together on site in a morning.

### Four answers from one part

The same portal assembles into four configurations — single, double, corner and island — which between them cover all nineteen stops on the upgraded line. Roof, bench, timetable panel and lighting all hang off the same two rails, so the transit authority stocks exactly one spare of everything.

### What the pigeons taught us

The prototype spent a winter outside the depot. The revised roof pitch sheds snow onto the track side, the bench gained six degrees of backrest, and every horizontal surface above eye level is now sixty degrees from level. Design review by weather is slower than a crit, but harder to argue with.`
	},
	{
		slug: 'white-city-rooftop-studios',
		title: 'White City Rooftop Studios',
		date: '2023-06-21',
		location: 'Tel Aviv, Israel',
		coordinates: [32.074, 34.7749],
		description:
			'Eleven artist studios landed on the flat roofs of three protected modernist blocks, visible from the street only as a rhythm of north-facing sawteeth',
		type: 'architecture',
		tags: ['bauhaus', 'architecture', 'adaptive-reuse', 'heritage'],
		authors: [
			{ name: 'Ayala Ron', role: 'Architect' },
			{ name: 'Marta Duran', role: 'Consulting Architect, Studio Vierkant' }
		],
		featured: true,
		extras: {
			owner: 'Gropius House Cooperative',
			status: 'delivered',
			surface_area: '640 m²',
			cost: '2 100 000 €'
		},
		body: `## Building on the White City

Four thousand modernist buildings make Tel Aviv's White City the largest ensemble of its kind anywhere, and its flat roofs the city's largest reserve of buildable land. The conservation plan allows light rooftop additions; it does not say they must be timid.

The studios are steel-framed sawteeth, glazed to the north, closed to the south, set back from the parapet by the width of a laundry line. From the street you see a serration of white against the sky — a second horizon rather than a second building.

## Eleven rooms, one contract

The cooperative that owns the three blocks leases the studios at cost to working artists for five-year terms. In return, the ground-floor lobbies host two open-studio weekends a year. The buildings got new cores, new waterproofing and seismic bracing out of the deal; the artists got the best light in the city.

---

Conservation authorities asked for reversibility. Every studio can be unbolted and craned off in a day, leaving four pad footings and a better roof than we found.`
	},
	{
		slug: 'toerten-community-hall',
		title: 'Törten Community Hall',
		date: '2019-11-05',
		location: 'Dessau-Törten, Germany',
		coordinates: [51.813, 12.231],
		description:
			'A brick hall for the 1928 Törten estate that borrows its neighbours: their module, their window rhythm, and their conviction that ordinary life deserves composed space',
		type: 'architecture',
		tags: ['bauhaus', 'architecture', 'brick', 'community'],
		authors: [
			{ name: 'Emil Kessler', role: 'Partner, Studio Vierkant' },
			{ name: 'Ruth Anders', role: 'Structural Engineer' }
		],
		featured: false,
		body: `## A hall the estate never got

The Törten estate was built as a housing experiment with everything a household needs — except anywhere for three hundred households to meet. Ninety years later the residents' association bought the corner plot the plan had always left blank.

The hall is one room, ten metres by twenty, in load-bearing brick laid to the same 1.25-metre module as the houses around it. The roof is a folded concrete plate that lets the room span without columns; its folds carry the acoustic absorption, so the ceiling does the work the walls are too honest to hide.

## Programme by committee, happily

The association runs the calendar, and the calendar runs the building: gymnastics before school, a repair café on Saturdays, table tennis in winter, and weddings whenever. The kitchen hatch and the storage wall came directly from two years of residents' meetings. The colour scheme — three doors, three primaries — was the only decision nobody disputed.`
	},
	{
		slug: 'lakeshore-bathhouse',
		title: 'Lakeshore Bathhouse',
		date: '2021-07-16',
		location: 'Chicago, United States',
		coordinates: [41.9484, -87.6553],
		description:
			'A public bathhouse on the Lake Michigan shore: two black steel pavilions, one cold plunge, and a colonnade that frames the lake like a found painting',
		type: 'architecture',
		tags: ['bauhaus', 'architecture', 'public-space', 'steel'],
		authors: [
			{ name: 'Marta Duran', role: 'Project Architect' },
			{ name: 'Ruth Anders', role: 'Structural Engineer' }
		],
		featured: true,
		body: `## Less lake, more precisely

Chicago's shoreline has no shortage of lake. What it rations is the moment of transition — the threshold where a city person becomes a swimmer. The bathhouse is that threshold built at civic scale: changing rooms, showers, a sauna and a cold plunge, arranged as two pavilions holding a courtyard open to the water.

The steel frame is welded, painted black, and left to state its dimensions plainly. Between the pavilions runs a colonnade of eleven bays; each bay frames the horizon at a slightly different height, so walking its length tilts the lake like a slow hand on a picture rail.

## Winter is the season

The commission assumed a summer building. Attendance data argues otherwise: the sauna and plunge run October through April at capacity, and the courtyard's windbreak geometry came from a winter's worth of anemometer readings, not from the rendering. Cold water, it turns out, is a public amenity.`
	},
	{
		slug: 'hillside-library-ulm',
		title: 'Hillside Library',
		date: '2020-03-09',
		location: 'Ulm, Germany',
		coordinates: [48.3984, 9.9916],
		description:
			'A small public library terraced into the Kuhberg slope below the old design school, its reading rooms stepping downhill one shelf-height at a time',
		type: 'architecture',
		tags: ['bauhaus', 'architecture', 'concrete', 'landscape'],
		authors: [{ name: 'Emil Kessler', role: 'Partner, Studio Vierkant' }],
		featured: false,
		body: `## Downhill by shelf-heights

The site drops eleven metres from street to meadow. Rather than fight the slope with a big retaining move, the library steps down it in increments of exactly one bookshelf — 2.1 metres — so that section and furniture become the same drawing.

Each terrace is one reading room, one concrete tray, one long rooflight. The stair between terraces doubles as the browsing aisle, which means every route through the building passes every subject. Serendipity, load-bearing.

## An Ulm debt

The Hochschule für Gestaltung up the hill closed in 1968, but its habit of reducing a problem to its structure never left the city. The library's palette is the school's: raw concrete, black steel, beech. The librarians asked for one exception — a red children's room — and were right.`
	},
	{
		slug: 'vieux-port-kindergarten',
		title: 'Rooftop Kindergarten above the Vieux-Port',
		date: '2025-02-14',
		location: 'Marseille, France',
		coordinates: [43.2951, 5.374],
		description:
			'A kindergarten on the roof of a 1950s cooperative block: a shaded playground at parapet level, four classrooms under sawtooth vaults, and the harbour as a teaching aid',
		type: 'architecture',
		tags: ['bauhaus', 'architecture', 'education', 'rooftop'],
		authors: [
			{ name: 'Marta Duran', role: 'Project Architect' },
			{ name: 'Salim Bouzid', role: 'Site Architect' }
		],
		featured: false,
		extras: {
			owner: 'Ville de Marseille',
			status: 'ongoing',
			surface_area: '520 m²',
			cost: '1 750 000 €'
		},
		body: `## The roof as a commons

The modernists promised roofs that would earn their keep — gymnasiums, running tracks, kindergartens in the sky. Most of those promises stayed on paper. This one is being built: four classrooms and a shaded court on the roof of a housing cooperative a street back from the Vieux-Port.

The classrooms sit under shallow concrete sawtooths that scoop north light and shrug off the mistral. The court is planted with three pines in oversized terracotta pots, because a playground at parapet height needs shade it can move.

### Working over ninety households

Building on an occupied roof is a logistics project wearing an architecture project's clothes. Every element arrives by crane on Tuesday mornings, the only slot the co-op voted for. The concrete is precast, the facade is bolted aluminium, and the loudest week of the programme — cutting the new stair through — was scheduled for the school holidays. Handover is set for the autumn term.`
	},
	{
		slug: 'tugendhat-garden-room',
		title: 'Garden Room for a Glass Villa',
		date: '2018-05-24',
		location: 'Brno, Czech Republic',
		coordinates: [49.2074, 16.6161],
		description:
			'An orangery at the foot of a functionalist villa garden, built as a conversation with the house above: the same travertine floor, the opposite attitude to glass',
		type: 'architecture',
		tags: ['bauhaus', 'architecture', 'glass', 'heritage'],
		authors: [{ name: 'Ayala Ron', role: 'Architect' }],
		featured: false,
		body: `## Answering a masterpiece quietly

The villa on the hill is one of the sacred rooms of modern architecture, and its garden falls away in terraces the tour groups never reach. At the bottom terrace the foundation wanted a winter garden — somewhere to overwinter the citrus and hold small lectures without ticketing the house itself.

The room takes the villa's travertine floor and continues it, then inverts every other rule: where the house dissolves its corners with plate glass, the garden room is a solid masonry box with one enormous south window that pivots open like an instrument case. In summer the room is effectively a porch; in January it is a bright, humid, leaf-scented refuge two degrees above frost.

Lectures happen among the lemon trees, forty chairs maximum. The gardeners hold veto power over the calendar, which everyone agrees is the correct hierarchy.`
	},
	{
		slug: 'paulista-courtyard-canopy',
		title: 'Courtyard Canopy off Avenida Paulista',
		date: '2024-10-03',
		location: 'São Paulo, Brazil',
		coordinates: [-23.5614, -46.6559],
		description:
			'A concrete canopy over a mid-block courtyard, thick enough to carry a garden, thin enough at its edge to read as a drawn line against the towers',
		type: 'architecture',
		tags: ['bauhaus', 'architecture', 'concrete', 'public-space'],
		authors: [
			{ name: 'Salim Bouzid', role: 'Site Architect' },
			{ name: 'Ruth Anders', role: 'Structural Engineer' }
		],
		featured: false,
		extras: {
			owner: 'Instituto Paulista de Arte Moderna',
			status: 'delivered',
			surface_area: '380 m²',
			cost: 'R$ 4 200 000'
		},
		body: `## Shade is infrastructure

São Paulo's modernists understood that in this climate the primary public building is a roof. The institute's courtyard — a leftover between three lot lines — needed to work as lobby, stage and refuge, which is to say it needed shade with conviction.

The canopy is a single concrete plate on four columns, 45 centimetres deep at the columns and 9 at the free edge. The depth it keeps is honest: the plate carries half a metre of soil and a garden of philodendrons whose roots do the cooling the air conditioning no longer has to.

## Under it

Programming under the canopy is deliberately loose. Wednesday is the book market, Friday evenings are film screenings against the blank neighbouring wall, and the rest of the week it is the neighbourhood's best waiting room. The institute counts users with a clicker at the gate: two thousand on a quiet week.`
	},
	{
		slug: 'paper-partition-house',
		title: 'Paper Partition House',
		date: '2023-01-30',
		location: 'Tokyo, Japan',
		coordinates: [35.6762, 139.6503],
		description:
			'A house for a family of five on a seven-metre lot, its rooms drawn and redrawn weekly by paper honeycomb partitions light enough for a child to move',
		type: 'architecture',
		tags: ['bauhaus', 'architecture', 'housing', 'flexibility'],
		authors: [{ name: 'Kenji Morita', role: 'Architect' }],
		featured: false,
		body: `## A plan that refuses to be final

The clients asked for four bedrooms on a lot where three would be generous. The house answers with one room, seven by eleven metres, two storeys tall at the street and one at the garden — and a set of nine paper honeycomb partitions, each 40 millimetres thick and light enough for the eight-year-old to relocate.

The partitions run on ceiling tracks laid out on a tatami-derived grid. Bedrooms exist at night; by ten the next morning the same floor area has usually become one long workroom. The family's floor plan is best described as a weekly average.

### Serviced edges, free middle

Everything that needs a pipe or a wire — kitchen, baths, stairs, storage — is pressed into a thick wall along the north lot line. The middle of the house owns nothing and can therefore become anything. Furniture is the only permanent architecture: one ten-metre table, built where the room was widest, around which the partitions now negotiate.`
	},
	{
		slug: 'aspen-mountain-studio',
		title: 'Mountain Studio for a Painter',
		date: '2022-02-11',
		location: 'Aspen, United States',
		coordinates: [39.1911, -106.8175],
		description:
			'A painting studio at 2,600 metres for an artist who works large: one north rooflight the size of the floor, and a winch door that turns the gable into an easel',
		type: 'architecture',
		tags: ['bauhaus', 'architecture', 'studio', 'timber'],
		authors: [
			{ name: 'Marta Duran', role: 'Project Architect' },
			{ name: 'Kenji Morita', role: 'Consulting Architect' }
		],
		featured: true,
		body: `## North light, thin air

Aspen owes its modern shape to a Bauhaus émigré who spent three decades designing the town's posters, ski lodges and earthworks. The studio sits on a spruce-edged clearing above the town, and its brief was one sentence: north light for canvases up to five metres.

The answer is a timber shed whose entire roof plane is the window. A north-sloping rooflight, triple glazed against the altitude, washes the workwall with shadowless light from nine to five regardless of what the sky is doing. The stove, the sink and the daybed crowd the south wall under the low eave, leaving the tall side of the section entirely to work.

## The gable is a door

Five-metre canvases do not use doors politely. The east gable unlatches and winches outward into a horizontal canopy, opening a full-height slot through which paintings leave flat, crated and level. Twice a year, on delivery days, the studio effectively exhibits its own interior to the meadow.`
	},
	{
		slug: 'universal-grotesk-revival',
		title: 'Universal Grotesk Revival',
		date: '2025-09-01',
		location: 'Berlin, Germany',
		coordinates: [52.52, 13.405],
		description:
			'A four-year revival of a 1920s single-case experimental alphabet, extended from 26 surviving letterforms to a working family of 14 styles with full European language support',
		type: 'design',
		tags: ['bauhaus', 'design', 'typography', 'revival'],
		authors: [
			{ name: 'Clara Voss', role: 'Type Designer' },
			{ name: 'Lotte Brandt', role: 'Research' }
		],
		featured: true,
		body: `## One case, one century later

In 1925 an experimental alphabet argued that two alphabets — capital and small — were one too many. The surviving drawings total twenty-six letterforms, four digits and a question mark. This revival takes the argument seriously enough to finish it.

The geometry looks compass-drawn and is not: the original circles were corrected by eye everywhere the eye demanded it, and the revival's first year went into learning which corrections were principle and which were 1925. Optical compensation is the tradition being revived, not the grid.

## From artefact to instrument

A working family needs what the drawings never had: weights, a text cut with taller proportions, currency symbols, diacritics for forty languages, and the unglamorous kerning of quotation marks. The family now runs from Hair to Poster in fourteen styles.

- 1,120 glyphs per style
- Latin extended, Greek, and Cyrillic
- variable axes for weight and optical size

The specimen site sets the whole of a 1929 lecture on typography in the single case the lecture called for. The argument reads better than it did in 1925 — which is what a revival is for.`
	},
	{
		slug: 'festival-of-form-wayfinding',
		title: 'Wayfinding for the Festival of Form',
		date: '2024-08-19',
		location: 'Dessau, Germany',
		coordinates: [51.8397, 12.2473],
		description:
			'Signage for a ten-day design festival spread across a small city: 240 painted plywood signs, three shapes, three colours, and no arrows anywhere',
		type: 'design',
		tags: ['bauhaus', 'design', 'wayfinding', 'festival'],
		authors: [
			{ name: 'Clara Voss', role: 'Design Lead' },
			{ name: 'Taller Meridiano', role: 'Environmental Graphics' }
		],
		featured: true,
		body: `## Navigation without arrows

The festival's venues were scattered across a city most visitors had never walked. The conventional answer is arrows; the trouble with arrows is that they point somewhere for everyone, which in a city of corners means they mostly point wrong.

The system uses geometry instead. Each of the three festival routes owns a shape and a colour — red square, yellow circle, blue triangle — and the signs simply repeat the shape at every decision point, rotated to lean down the correct street. You follow a shape the way you follow a person: by keeping it in sight.

## Plywood, paint, weekend labour

All 240 signs were cut from standard plywood sheets in one workshop week and painted by volunteers on trestles in the Stadtpark. The paint scheme survived ten days of weather; the signs were auctioned afterward and now lean, apparently, in 240 hallways. The whole system cost less than the festival's coffee budget, a statistic we quote at every kickoff meeting since.`
	},
	{
		slug: 'primary-chess-set',
		title: 'Primary Chess Set',
		date: '2021-12-06',
		location: 'Weimar, Germany',
		coordinates: [50.9795, 11.3235],
		description:
			'A chess set in which every piece is the diagram of its own move — turned beech, three colours, and a hundred-year-old argument continued in the same workshop town',
		type: 'design',
		tags: ['bauhaus', 'design', 'product', 'wood'],
		authors: [{ name: 'Atelier Primær', role: 'Product Design' }],
		featured: true,
		body: `## Form follows move

The 1924 original replaced kings and knights with geometry: each piece shaped by how it moves. Our set keeps the thesis and re-derives every form from scratch, on the grounds that an argument this good deserves to be had twice.

The bishop is a diagonal wedge, the rook a plain cube, the knight an L of two glued blocks, the queen a sphere on a cylinder — omnidirectional, dominant. The pawn is the smallest turnable cylinder that still feels like a decision when you push it. Beech throughout; the third colour marks the four centre squares, the only squares the rules themselves privilege.

## Learning chess by looking

1. Set the board with the pieces facing a beginner.
2. Explain nothing.
3. Time how long before they infer the bishop.

Median across our test group of forty: under three minutes. The set ships flat in a birch box whose lid is the board, and the box lid's grid is silkscreened fractionally off-centre — our one concession to the fact that perfect symmetry photographs worse than it plays.`
	},
	{
		slug: 'counterweight-lamp',
		title: 'Counterweight Table Lamp',
		date: '2020-06-17',
		location: 'Stuttgart, Germany',
		coordinates: [48.7758, 9.1829],
		description:
			'A table lamp balanced by a sliding steel counterweight instead of springs or knobs: set the height with one finger, and the mechanism is the entire ornament',
		type: 'design',
		tags: ['bauhaus', 'design', 'product', 'lighting'],
		authors: [
			{ name: 'Atelier Primær', role: 'Product Design' },
			{ name: 'Lotte Brandt', role: 'Metalwork' }
		],
		featured: false,
		body: `## No springs, no knobs

Adjustable lamps mostly hide their physics — springs inside joints, friction inside knobs, all of it wearing out in private. This lamp does the opposite: a steel counterweight rides the stem in plain view, and where the weight sits is exactly where the shade floats. One finger raises the light; the mechanism is the explanation.

The stem is drawn steel tube, the foot a cast iron disc, the shade a spun aluminium hemisphere on a ball joint. Nothing is decorated and nothing is concealed, which after a hundred prototypes we can report is the more demanding of the two disciplines.

## Serviceable forever, or thereabouts

The lamp dismantles with one hex key into eleven parts, every one of them flat-stocked or catalogue-standard. The counterweight doubles as the packaging's ballast, the cardboard box converts into the shipping-damage test rig (drop it; the lamp should not care), and the care manual is one paragraph long. Warranty claims to date: a chewed cable. Dog.`
	},
	{
		slug: 'jacquard-punch-card-textiles',
		title: 'Punch-Card Textiles',
		date: '2023-04-27',
		location: 'Zurich, Switzerland',
		coordinates: [47.3769, 8.5417],
		description:
			'A weaving collection whose patterns are the punch cards that produce them — the loom instructions woven as the motif, on a restored 1912 Jacquard head',
		type: 'design',
		tags: ['bauhaus', 'design', 'textile', 'weaving'],
		authors: [
			{ name: 'Ines Vogel', role: 'Textile Designer' },
			{ name: 'Mira Halas', role: 'Loom Programmer' }
		],
		featured: false,
		body: `## The pattern is the program

A Jacquard loom reads punch cards; the cards are a picture of the cloth to come. This collection closes the loop: the motif woven into each textile is the card sequence that wove it, scaled so one punched hole becomes one square of the pattern. The cloth is its own source code, printed in the only language it has.

The weaving workshop tradition we lean on treated the loom as the era's most sophisticated machine and its discipline as composition, not decoration. Working on a restored 1912 Jacquard head makes the lineage literal: our design software's final output is a stack of cardboard cards, punched on the original perforator.

## Six cloths

The collection runs six pieces, from a cotton double-weave in cream and black to a wool rug where the card motif enlarges to architectural scale. Each is woven in an edition of twelve. The museum that houses the loom takes the first of every edition, along with the cards — filed, correctly, as both tooling and drawing.`
	},
	{
		slug: 'single-line-metro-map',
		title: 'The Metro as a Single Line',
		date: '2022-11-22',
		location: 'Mexico City, Mexico',
		coordinates: [19.4326, -99.1332],
		description:
			'A commissioned study redrawing a twelve-line metro network as one continuous line that never crosses itself — useless for engineers, unreasonably good at teaching the city its own shape',
		type: 'design',
		tags: ['bauhaus', 'design', 'cartography', 'identity'],
		authors: [{ name: 'Taller Meridiano', role: 'Design Studio' }],
		featured: true,
		body: `## An impossible brief, kept

The transit authority asked for a poster celebrating fifty years of the metro. We countered with a constraint instead of a concept: redraw all twelve lines as one unbroken line that visits every station once and never crosses itself. If the network is really one system, let it be drawn as one gesture.

Topology had opinions. Making the line work meant bending the city — the east side compresses, the airport swings north, and two transfer stations trade places. Every distortion is documented in the margin like a chess annotation, because a map that lies should at least keep honest books.

## What a wrong map is for

Riders do not navigate with it; that is what the real map is for. What the single line does is give the network a silhouette — an outline people recognise the way they recognise the city's skyline. The poster hangs in 195 stations, the line animates as the system's loading indicator, and schoolchildren trace it in one pencil stroke, which is the entire thesis stated in a classroom.`
	},
	{
		slug: 'circle-triangle-square-posters',
		title: 'Circle, Triangle, Square — Poster Year',
		date: '2019-03-15',
		location: 'Vienna, Austria',
		coordinates: [48.2082, 16.3738],
		description:
			'Fifty-two weekly posters for a concert hall, each built from the same three shapes and three colours — a year-long test of how much variety a closed system really holds',
		type: 'design',
		tags: ['bauhaus', 'design', 'poster', 'print'],
		authors: [{ name: 'Clara Voss', role: 'Graphic Designer' }],
		featured: false,
		body: `## A closed system, opened weekly

The 1923 questionnaire that matched circle to blue, triangle to yellow and square to red was bad science and excellent provocation. This commission took the provocation at its word: one year of concert posters, three shapes, three colours, and nothing else in the toolbox — no photography, no illustration, no second typeface.

Week by week, the constraint stopped feeling like a cage. A percussion night is forty small squares in a strict grid; a requiem is one blue circle sinking below the sheet edge; the new-music festival is the only poster where the triangle outnumbers everything. By June the shapes were vocabulary; by December they were slang.

## The archive as the artwork

Any single poster is modest. The wall of fifty-two is the actual piece — proof, pinned up in order, that a closed system generates rather than repeats. The concert hall now sells the complete year as a boxed set, and the questionnaire's answer sheet is reprinted on the lid, wrong as ever.`
	},
	{
		slug: 'span-shelving',
		title: 'Span Shelving System',
		date: '2021-05-04',
		location: 'Copenhagen, Denmark',
		coordinates: [55.6761, 12.5683],
		description:
			'A shelving system with no uprights: anodised aluminium shelves that clamp directly to any two walls, turning the room itself into the structure',
		type: 'design',
		tags: ['bauhaus', 'design', 'furniture', 'aluminium'],
		authors: [{ name: 'Atelier Primær', role: 'Product Design' }],
		featured: false,
		body: `## Furniture minus half of itself

Every shelving system reinvents the same redundancy: a frame, standing in front of a wall, which is already a frame. Span deletes the redundancy. The shelf is a folded aluminium extrusion with a clamping jaw at each end; it grips opposing walls — corridor, alcove, window reveal — and carries books on the strength of the room.

The engineering lives in the jaw: a cam lever presses a gasketed pad against each wall with 4 kN of force, no drilling, no fixings, no trace at removal. Rated span is 2.4 metres at 60 kilograms; the test rig held a colleague.

## Rooms it turns out we had

Span's real discovery was architectural. Corridors, stair landings, the dead zone over a radiator — every dwelling holds shelf-shaped rooms that freestanding furniture cannot reach. The system ships as single shelves in four lengths and three colours (cream, black, signal red), and the installation manual is printed on the packing sleeve in eleven drawings and zero words.`
	},
	{
		slug: 'brass-tea-service',
		title: 'Brass Tea Service',
		date: '2018-10-09',
		location: 'Berlin, Germany',
		coordinates: [52.5163, 13.3777],
		description:
			'A hand-raised tea service in brass and ebony — hemisphere, cylinder, disc — made in homage to the metal workshop that put geometry on the tea table a century ago',
		type: 'design',
		tags: ['bauhaus', 'design', 'metalwork', 'craft'],
		authors: [{ name: 'Lotte Brandt', role: 'Silversmith' }],
		featured: false,
		body: `## After the metal workshop

The famous 1924 tea infuser was barely eight centimetres tall and remains the heaviest small object in design history: a hemisphere on crossed runners, made by a workshop that believed geometry belonged in daily use, made by hand until industry caught up. This service is a hundred-year echo — raised by hand in Berlin, five pieces, no two runs identical.

The vocabulary is strict: hemispherical bodies, cylindrical handles wrapped in ebony, flat disc lids with a half-sphere for a knop. The teapot's spout is the one drawn curve in the set, and it took more attempts than everything else combined. Geometry is cheap in a sketch and expensive in brass.

## Use, not vitrine

A service this deliberate risks retirement into a display cabinet. The antidote is designed in: the brass is left unlacquered so daily handling polishes the high points and shadows the hollows, and the pot pours properly — tested through four hundred cups. Patina is the maintenance schedule. Each set is stamped with its firing date and nothing else.`
	},
	{
		slug: 'twelve-column-annual-report',
		title: 'Annual Report on Twelve Columns',
		date: '2020-09-25',
		location: 'Basel, Switzerland',
		coordinates: [47.5596, 7.5886],
		description:
			"A cultural foundation's annual report set on a strict twelve-column grid that carries text, tables and finances alike — typography doing the work of illustration",
		type: 'design',
		tags: ['bauhaus', 'design', 'editorial', 'typography'],
		authors: [
			{ name: 'Clara Voss', role: 'Graphic Designer' },
			{ name: 'Ines Vogel', role: 'Production' }
		],
		featured: false,
		body: `## One grid for prose and money

Annual reports usually run two designs in one cover: an illustrated front half and a financial back half nobody styles. This report refuses the split. A twelve-column grid carries everything — essays on six columns, captions on two, and the accounts on column settings chosen so that a balance sheet and a photo caption are visibly citizens of the same page.

The typographic palette is one family in three optical sizes, black on unbleached stock, with the foundation's red reserved for one job only: totals. Restraint is easy to declare and hard to invoice, so the grid documentation became part of the deliverable — the foundation's future designers inherit the reasoning, not just the artefact.

### The columns, by the numbers

| Element        | Columns | Note                       |
| -------------- | ------- | -------------------------- |
| Essays         | 6       | ragged right               |
| Interviews     | 4 + 2   | questions in the margin    |
| Balance sheet  | 9       | tabular figures            |
| Notes & colophon | 3     | smallest optical size      |

The auditors asked why the accounts looked better than the essays. Correct question, wrong direction: the essays looked, at last, as ordered as the accounts.`
	},
	{
		slug: 'neon-numeral-clock',
		title: 'Station Clock with Neon Numerals',
		date: '2024-01-18',
		location: 'Brussels, Belgium',
		coordinates: [50.8467, 4.3499],
		description:
			'A public clock for a tram terminus that abandons hands: the hour glows as a two-metre neon numeral, the minutes as a climbing edge of light around the frame',
		type: 'design',
		tags: ['bauhaus', 'design', 'public-space', 'lighting'],
		authors: [
			{ name: 'Atelier Primær', role: 'Product Design' },
			{ name: 'Vera Lindqvist', role: 'Light Consultant' }
		],
		featured: false,
		body: `## Time you can read across a square

A clock face with hands is an instrument for the person standing under it. A tram terminus needs the opposite: time legible at 200 metres through sleet, by someone deciding whether to run. The clock shows the hour as a single two-metre numeral bent in neon, and the minutes as a bar of light climbing the frame's edge — at quarter past, the frame is a quarter lit.

The numerals swap on the hour with a three-second crossfade that has become, unexpectedly, a small public event. On New Year's Eve the crowd counts it down.

## Neon, on purpose

LED could imitate the look at half the power, and the first study specified it. Full-scale mockups ended the debate: neon's continuous stroke reads as a drawn line where the LED segments read as a display. The tubes are bent by one of Belgium's last neon workshops, the transformers are serviceable from a hatch, and the whole sign draws less than the terminus's coffee machine. Craft won on legibility, and it photographs like a promise kept.`
	},
	{
		slug: 'suspended-balance-studies',
		title: 'Suspended Balance Studies',
		date: '2023-09-12',
		location: 'Rotterdam, Netherlands',
		coordinates: [51.9225, 4.4792],
		description:
			'Nine hanging constructions of steel rod, painted discs and counterweights, holding their equilibrium in a former turbine hall and redrawing it with every draught',
		type: 'art',
		tags: ['bauhaus', 'art', 'kinetic', 'sculpture'],
		authors: [{ name: 'Vera Lindqvist', role: 'Artist' }],
		featured: true,
		body: `## Equilibrium as a subject

The preliminary course a century ago set students a deceptively simple exercise: build a construction that holds its balance, and show how. These nine pieces take the exercise at gallery scale. Each is a hanging system of steel rod, painted aluminium discs and lead counterweights, trimmed until it floats level — then left alone to answer the room.

The turbine hall's air is never still. Doors, bodies, the afternoon sun on the west glazing: every disturbance travels the wires and settles into a new attitude, always balanced, never twice the same. The work is not the object but the recovery.

## Tuning, not sculpting

Studio time was spent less like a sculptor's and more like a piano tuner's: shortening a rod by four millimetres, adding a five-gram washer, listening with a spirit level. The install took nine days, eight of which were trimming. Visitors are permitted — encouraged, by a sign the guards have learned to tolerate — to breathe on the smallest piece.`
	},
	{
		slug: 'primary-colours-underpass',
		title: 'Primary Colours for a Grey Underpass',
		date: '2025-05-30',
		location: 'Budapest, Hungary',
		coordinates: [47.4979, 19.0402],
		description:
			'A 120-metre pedestrian underpass repainted as a walkable colour theory lesson: red compressing, yellow accelerating, blue arriving — maintenance schedule included',
		type: 'art',
		tags: ['bauhaus', 'art', 'public-space', 'colour'],
		authors: [
			{ name: 'Mira Halas', role: 'Artist' },
			{ name: 'Taller Meridiano', role: 'Environmental Graphics' }
		],
		featured: true,
		extras: {
			owner: 'Budapest Közút',
			status: 'delivered',
			surface_area: '1 450 m²',
			cost: '38 000 000 Ft'
		},
		body: `## A corridor as a colour course

The underpass under the ring road moved eleven thousand people a day through 120 metres of sodium-lit grey. The commission asked for "art"; the site asked for colour theory. The walk is now a sequence: a red zone that visually compresses the wide entry hall, a long yellow run whose diagonal stripes accelerate the monotonous middle, and a blue vault at the far stair that reads as arrival — depth, calm, sky.

The theory is old classroom material: colours advance and recede, warm hurries, cool settles. What the classroom never had is a control group of eleven thousand commuters. Pedestrian counts show fewer stalls at the entry pinch; the transit authority's surveys stopped listing the underpass among "avoided at night" locations within a season.

## Paint is a schedule

Public colour fails by fading, not by vandalism. The palette is specified in mineral silicate paint with published repaint intervals, the city crew got a colour book with mixing codes, and the budget line everyone fought for was not the mural — it was the maintenance contract. Colour that stays is the artwork; colour that fades is a complaint.`
	},
	{
		slug: 'photogram-garden',
		title: 'Photogram Garden',
		date: '2021-09-02',
		location: 'Montpellier, France',
		coordinates: [43.6119, 3.8772],
		description:
			'An outdoor installation of two hundred cyanotype panels exposed in place through a summer in France’s oldest botanical garden, recording the shadows of the garden that surrounds them',
		type: 'art',
		tags: ['bauhaus', 'art', 'photography', 'landscape'],
		authors: [
			{ name: 'Theo Marchand', role: 'Artist' },
			{ name: 'Ines Vogel', role: 'Fabrication' }
		],
		featured: false,
		body: `## Photography without a camera, weather permitting

A photogram is the oldest photographic act: lay an object on sensitised paper, let light do the drawing. The garden version scales the act to a park. Two hundred cyanotype-coated aluminium panels were installed among the beds in June — under fennel, beneath the lime tree, along the pond edge — and left exposed until September.

Each panel is a long-exposure portrait of its own location: the hard shadow of an iron railing crossed by three months of swaying grasses, gusts recorded as blur, still afternoons as edges. The prussian blue develops in place, fixed by the first autumn rain the way the process was fixed in a darkroom sink.

## The archive of one summer

Re-hung in a grid for the winter exhibition, the panels become a map of the garden drawn by the garden. Botanists identified forty species from silhouette alone; one visitor located the exact bench she read on in July by the shadow of her bicycle. The panels will not be re-coated — the piece is that summer, in an edition of one.`
	},
	{
		slug: 'triadic-costume-reissue',
		title: 'Triadic Costumes, Reissued',
		date: '2022-06-08',
		location: 'Stuttgart, Germany',
		coordinates: [48.7784, 9.18],
		description:
			'Six costumes from the 1922 Triadic Ballet rebuilt with a dance company for performing bodies, in materials that can survive a touring season',
		type: 'art',
		tags: ['bauhaus', 'art', 'performance', 'costume'],
		authors: [
			{ name: 'Vera Lindqvist', role: 'Artist' },
			{ name: 'Ines Vogel', role: 'Costume Fabrication' }
		],
		featured: true,
		body: `## Dancing the diagram

The Triadic Ballet turned dancers into geometry a century ago: spiral wire skirts, sphere hands, a costume history has filed somewhere between sculpture and prank. Museum replicas exist, built to stand in vitrines. This reissue was built to sweat — six costumes remade with a Stuttgart company for an evening-length revival, then a touring season.

Every form was re-engineered from the body outward. The spiral skirt is now aircraft-grade aluminium tube on a padded harness, the spheres are vacuum-formed and split for airflow, and each costume packs into one flight case. Weight came down by two-thirds; the silhouette conceded nothing visible past the third row.

## What the constraint choreographs

Rehearsals confirmed the old suspicion that the costumes are the choreographer. A dancer in a sphere-skirt cannot improvise past its radius; the costume's geometry writes the movement vocabulary, which is the piece's whole argument about bodies and form. The company's notation now includes a column the 1922 originals implied but never wrote down: what the costume permits.`
	},
	{
		slug: 'refraction-curtain',
		title: 'Refraction Curtain',
		date: '2019-08-21',
		location: 'New York, United States',
		coordinates: [40.7614, -73.9776],
		description:
			"A lobby-scale curtain of 3,000 cast glass prisms that takes one office atrium's worth of daylight and spends it as moving spectra on the floor",
		type: 'art',
		tags: ['bauhaus', 'art', 'glass', 'light'],
		authors: [{ name: 'Theo Marchand', role: 'Artist' }],
		featured: false,
		body: `## Spending daylight

The glass workshop of the old school treated coloured light as material, cutting and layering it like joinery. The curtain works the same trade with clear glass only: three thousand cast prisms, each the size of a matchbox, hung on stainless cable across a forty-foot atrium wall. Colour is not applied; it is extracted — the prisms unpack the lobby's south light into spectra that travel the terrazzo floor as the sun moves.

The piece keeps office hours. Winter mornings throw long violet bands past the security desk; June noon pools the colour tight against the wall. Overcast days are the piece's rest state: a grey shimmer, glass being honest about the weather.

## Three thousand, not one

A single prism is a physics demonstration. The multiplication is what makes weather indoors — no two prisms aligned identically, so the spectra arrive layered, interfering, slightly wrong in the way water reflections are slightly wrong. Casting tolerances were loosened, not tightened, after the first mockup: precision made it look like a chandelier. Error made it look like light.`
	},
	{
		slug: 'sound-of-shapes',
		title: 'The Sound of Shapes',
		date: '2024-05-07',
		location: 'Montreal, Canada',
		coordinates: [45.5019, -73.5674],
		description:
			'An audiovisual room where drawing is scoring: visitors draw circles, triangles and squares on a shared surface and hear the wall orchestra play their composition',
		type: 'art',
		tags: ['bauhaus', 'art', 'interactive', 'sound'],
		authors: [
			{ name: 'Theo Marchand', role: 'Artist' },
			{ name: 'Mira Halas', role: 'Sound Design' }
		],
		featured: false,
		body: `## Synesthesia, playable

A century of art theory has insisted that shapes sound: the circle hums, the triangle strikes, the square keeps time. The room stops insisting and lets people check. A shared drawing surface faces a wall of forty small speakers; whatever is drawn becomes a score, read left to right on a loop, shapes voiced by position and size.

Circles are sine tones, warm and long. Triangles attack — struck metal, decay by altitude. Squares are rhythm, subdividing the loop. A page of careful geometry plays as chamber music; a child's scribble plays as exactly what it is. Erasing is composing too, and the eraser is oversized on purpose.

## What the room learned

Twenty minutes is the median stay, absurd for a one-room piece. Strangers collaborate without negotiating — someone lays a square tempo, someone else floats circles over it, and the room fills with an authorless composition every evening at closing. The installation logs nothing and keeps no recordings: the scores exist only while drawn, which visitors, told this, invariably draw one more.`
	},
	{
		slug: 'alphabet-facade',
		title: 'Alphabet Facade',
		date: '2020-12-01',
		location: 'Lisbon, Portugal',
		coordinates: [38.7223, -9.1393],
		description:
			"A print archive's blank street wall rebuilt as a ceramic alphabet — 5,000 azulejo tiles carrying a single letterform study, legible as text from nowhere and as typography from everywhere",
		type: 'art',
		tags: ['bauhaus', 'art', 'typography', 'ceramics'],
		authors: [
			{ name: 'Jonas Ferro', role: 'Artist' },
			{ name: 'Clara Voss', role: 'Letterform Consultant' }
		],
		featured: false,
		body: `## A wall that studies one letter

The print archive's north wall ran sixty metres without a window — the largest blank page in the neighbourhood. It now carries a single letterform study, tiled: the letter R, drawn 340 ways across five thousand azulejos, from strict compass-and-rule constructions to the loosest brush cursive, ordered so the wall drifts from geometry to gesture as the street slopes downhill.

Lisbon's facades have spoken in tile for three centuries; the piece only changes the subject. Each azulejo was silkscreened in cobalt on cream at a workshop across the river, using the archive's own specimen books as source — three of the 340 forms are traced from pages printed before the wall's own building existed.

## Reading distance

From across the avenue the wall is texture, a woven blue-grey. At the bus stop it resolves into alphabet. With your nose at the grout you find the tilemakers' registration marks, left visible by agreement — the piece is about how letters are made, and so is honest about how tiles are. Schoolchildren are sent to find the one R that is printed upside down. There are two.`
	},
	{
		slug: 'fourteen-metronomes',
		title: 'Fourteen Metronomes',
		date: '2026-03-13',
		location: 'Rodez, France',
		coordinates: [44.3506, 2.575],
		description:
			'A gallery piece of fourteen mechanical metronomes on a resonant oak table, wound daily, drifting in and out of phase — order and entropy performing in shifts',
		type: 'art',
		tags: ['bauhaus', 'art', 'kinetic', 'sound'],
		authors: [{ name: 'Vera Lindqvist', role: 'Artist' }],
		featured: false,
		body: `## Wound at ten, chaos by noon

Every morning a gallery attendant winds fourteen mechanical metronomes, sets them all to 92 beats per minute, and starts them within a single sweep of the hand. For a few minutes they tick as one — a machine consensus. Then the tolerances speak: springs age differently, pivots wear differently, and by noon the room is a rainstorm of unsynchronised clicks.

And then, some afternoons, the table intervenes. The metronomes stand on one long oak slab, and through it each escapement nudges the others. Clusters lock into step for a minute, dissolve, reform elsewhere down the table. Physicists call it coupled oscillation; visitors call it the metronomes deciding.

## A daily performance without a performer

The piece has no motor, no sensor, no loop — only clockwork, wood and the day's slow argument between order and drift. Closing time is whenever the last metronome runs down, which the gallery has learned not to schedule. The attendants keep a log of the day's final ticker; after four months, one instrument leads by a margin no one can explain and no one will service away.`
	}
];
