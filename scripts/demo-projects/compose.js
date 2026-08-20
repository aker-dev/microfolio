// Bauhaus-style plate compositions for the demo projects.
//
// Everything here is deterministic: the archetype and palette of a project come
// from its slug alone, and each gallery variant only reseeds the parameters. So
// regenerating the demo set on another machine produces the same SVG bytes —
// which is also why there is no <text> element anywhere: librsvg falls back to
// whatever fonts the machine has, and two machines would rasterize two
// different images from the same markup.

// The five colours the whole demo set is allowed to use.
const PALETTE = {
	red: '#BE2D26',
	yellow: '#E8B21D',
	blue: '#20518A',
	black: '#1B1B1B',
	cream: '#F2EDE4'
};

// FNV-1a, folded into a 32-bit seed for mulberry32.
function hashString(str) {
	let h = 0x811c9dc5;
	for (let i = 0; i < str.length; i++) {
		h ^= str.charCodeAt(i);
		h = Math.imul(h, 0x01000193);
	}
	return h >>> 0;
}

function mulberry32(seed) {
	let a = seed >>> 0;
	return function () {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function pick(rng, list) {
	return list[Math.floor(rng() * list.length)];
}

function shuffled(rng, list) {
	const copy = [...list];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

// A project's visual identity: background, three accents in a fixed order, and
// one archetype. Derived from the slug only, so the thumbnail and the three
// gallery plates of one project always belong together.
function identityFor(slug) {
	const rng = mulberry32(hashString(slug));
	const dark = rng() < 0.25;
	const background = dark ? PALETTE.black : PALETTE.cream;
	const accents = shuffled(rng, [
		PALETTE.red,
		PALETTE.yellow,
		PALETTE.blue,
		dark ? PALETTE.cream : PALETTE.black
	]);
	const archetype = pick(rng, Object.keys(ARCHETYPES));
	return { background, accents, archetype };
}

// --- Archetypes ---------------------------------------------------------------
// Each one draws into a width × height canvas and returns SVG fragments.
// `a` is the accent list (first entries dominate), `rng` the variant PRNG.

function diagonalBeam(rng, a, w, h) {
	const angle = 20 + rng() * 40;
	const beamW = h * (0.16 + rng() * 0.12);
	const cx = w * (0.55 + rng() * 0.25);
	const cy = h * (0.25 + rng() * 0.3);
	const r = h * (0.16 + rng() * 0.14);
	const shapes = [
		`<g transform="rotate(${angle.toFixed(1)} ${w / 2} ${h / 2})">` +
			`<rect x="${-w * 0.25}" y="${h / 2 - beamW / 2}" width="${w * 1.5}" height="${beamW}" fill="${a[0]}"/>` +
			`</g>`,
		`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${a[1]}"/>`,
		`<g transform="rotate(${angle.toFixed(1)} ${w / 2} ${h / 2})">` +
			`<rect x="${-w * 0.25}" y="${h / 2 + beamW * (0.9 + rng() * 0.6)}" width="${w * 1.5}" height="${beamW * 0.12}" fill="${a[2]}"/>` +
			`</g>`,
		`<circle cx="${w * (0.15 + rng() * 0.1)}" cy="${h * (0.72 + rng() * 0.15)}" r="${h * 0.045}" fill="${a[2]}"/>`
	];
	return shapes;
}

function overlapPrimitives(rng, a, w, h) {
	const cx = w * (0.38 + rng() * 0.24);
	const cy = h * (0.42 + rng() * 0.16);
	const r = h * (0.22 + rng() * 0.08);
	const s = r * 1.7;
	const tilt = -12 + rng() * 24;
	const tx = cx + r * (0.5 + rng() * 0.5);
	const ty = cy + r * (0.3 + rng() * 0.4);
	return [
		`<rect x="${cx - s * 0.15}" y="${cy - s * 0.75}" width="${s}" height="${s}" fill="${a[2]}" transform="rotate(${tilt.toFixed(1)} ${cx} ${cy})"/>`,
		`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${a[0]}" fill-opacity="0.92"/>`,
		`<path d="M ${tx} ${ty - s * 0.62} L ${tx + s * 0.55} ${ty + s * 0.33} L ${tx - s * 0.55} ${ty + s * 0.33} Z" fill="${a[1]}" fill-opacity="0.92"/>`
	];
}

function nestedSquares(rng, a, w, h) {
	// Albers homage: concentric squares sliding toward the bottom edge.
	const side = h * (0.62 + rng() * 0.15);
	const cx = w / 2 + (rng() - 0.5) * w * 0.2;
	const baseY = h * (0.82 + rng() * 0.08);
	const steps = 4 + Math.floor(rng() * 2);
	const colours = [a[0], a[1], a[2], a[0], a[1], a[2]];
	const shapes = [];
	for (let i = 0; i < steps; i++) {
		const s = side * (1 - i * (0.82 / steps));
		shapes.push(
			`<rect x="${cx - s / 2}" y="${baseY - s * (1 - i * 0.06)}" width="${s}" height="${s}" fill="${colours[i]}"/>`
		);
	}
	return shapes;
}

function quarterArcs(rng, a, w, h) {
	const cols = 3 + Math.floor(rng() * 2);
	const rows = Math.max(2, Math.round((cols * h) / w));
	const cw = w / cols;
	const ch = h / rows;
	const r = Math.min(cw, ch);
	// Quarter discs anchored at a cell corner, drawn as plain paths (librsvg has
	// no reliable clip-path support). For each corner: its position in the cell
	// and the two inward edge directions, ordered so sweep flag 1 always bows
	// through the cell.
	const corners = [
		{ px: 0, py: 0, u: [1, 0], v: [0, 1] },
		{ px: 1, py: 0, u: [0, 1], v: [-1, 0] },
		{ px: 1, py: 1, u: [-1, 0], v: [0, -1] },
		{ px: 0, py: 1, u: [0, -1], v: [1, 0] }
	];
	const shapes = [];
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			if (rng() < 0.22) continue; // breathing room
			const colour = pick(rng, a);
			const c = corners[Math.floor(rng() * 4)];
			const cx = (col + c.px) * cw;
			const cy = (row + c.py) * ch;
			shapes.push(
				`<path d="M ${cx} ${cy} L ${cx + c.u[0] * r} ${cy + c.u[1] * r} A ${r} ${r} 0 0 1 ${cx + c.v[0] * r} ${cy + c.v[1] * r} Z" fill="${colour}"/>`
			);
		}
	}
	return shapes;
}

function rayBurst(rng, a, w, h) {
	const ox = w * (0.25 + rng() * 0.5);
	const oy = h * (0.3 + rng() * 0.4);
	const rays = 9 + Math.floor(rng() * 6);
	const reach = Math.max(w, h) * 1.6;
	const shapes = [];
	for (let i = 0; i < rays; i++) {
		const a0 = (i / rays) * Math.PI * 2;
		const a1 = a0 + (Math.PI * 2) / rays / (2.2 + rng());
		const colour = i % 2 === 0 ? a[0] : a[1];
		shapes.push(
			`<path d="M ${ox} ${oy} L ${ox + Math.cos(a0) * reach} ${oy + Math.sin(a0) * reach} L ${ox + Math.cos(a1) * reach} ${oy + Math.sin(a1) * reach} Z" fill="${colour}"/>`
		);
	}
	shapes.push(`<circle cx="${ox}" cy="${oy}" r="${h * (0.06 + rng() * 0.05)}" fill="${a[2]}"/>`);
	return shapes;
}

function modularGrid(rng, a, w, h) {
	// Weaving-workshop rhythm: columns of stacked rectangles and half circles.
	const cols = 4 + Math.floor(rng() * 3);
	const cw = w / cols;
	const shapes = [];
	for (let col = 0; col < cols; col++) {
		let y = 0;
		while (y < h) {
			const bh = h * (0.12 + rng() * 0.22);
			const colour = pick(rng, a);
			if (rng() < 0.3) {
				shapes.push(
					`<path d="M ${col * cw} ${y + bh} A ${cw / 2} ${bh} 0 0 1 ${(col + 1) * cw} ${y + bh} Z" fill="${colour}"/>`
				);
			} else if (rng() < 0.85) {
				shapes.push(
					`<rect x="${col * cw}" y="${y}" width="${cw}" height="${bh}" fill="${colour}"/>`
				);
			}
			y += bh;
		}
	}
	return shapes;
}

function stackedSemis(rng, a, w, h) {
	const n = 4 + Math.floor(rng() * 3);
	const cx = w * (0.35 + rng() * 0.3);
	const baseR = h * (0.42 + rng() * 0.1);
	const shapes = [];
	for (let i = 0; i < n; i++) {
		const r = baseR * (1 - i / n);
		const colour = [a[0], a[1], a[2]][i % 3];
		shapes.push(
			`<path d="M ${cx - r} ${h * 0.85} A ${r} ${r} 0 0 1 ${cx + r} ${h * 0.85} Z" fill="${colour}"/>`
		);
	}
	shapes.push(
		`<rect x="${w * (0.78 + rng() * 0.06)}" y="0" width="${w * 0.035}" height="${h}" fill="${a[0]}"/>`
	);
	return shapes;
}

function ruledCircle(rng, a, w, h) {
	// Moholy-style tension between one big circle and a few thin rules.
	const cx = w * (0.55 + rng() * 0.25);
	const cy = h * (0.35 + rng() * 0.3);
	const r = h * (0.24 + rng() * 0.14);
	const ruleY = h * (0.6 + rng() * 0.25);
	const ruleX = w * (0.15 + rng() * 0.2);
	return [
		`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${a[0]}"/>`,
		`<circle cx="${cx - r * 0.55}" cy="${cy + r * 0.4}" r="${r * 0.28}" fill="${a[1]}"/>`,
		`<rect x="0" y="${ruleY}" width="${w}" height="${h * 0.012}" fill="${a[2]}"/>`,
		`<rect x="${ruleX}" y="0" width="${h * 0.012}" height="${h}" fill="${a[2]}"/>`,
		`<rect x="${ruleX - h * 0.05}" y="${ruleY - h * 0.05}" width="${h * 0.1}" height="${h * 0.1}" fill="${a[1]}"/>`
	];
}

const ARCHETYPES = {
	beam: diagonalBeam,
	overlap: overlapPrimitives,
	nested: nestedSquares,
	arcs: quarterArcs,
	rays: rayBurst,
	grid: modularGrid,
	semis: stackedSemis,
	ruled: ruledCircle
};

/**
 * Render one plate of a project as an SVG string.
 * `variant` 0 is the thumbnail; 1-3 are the gallery plates.
 */
export function renderComposition(slug, variant, width, height) {
	const { background, accents, archetype } = identityFor(slug);
	const rng = mulberry32(hashString(`${slug}#${variant}`));
	const shapes = ARCHETYPES[archetype](rng, accents, width, height);
	return (
		`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
		`<rect width="${width}" height="${height}" fill="${background}"/>` +
		shapes.join('') +
		`</svg>`
	);
}

export { PALETTE, identityFor };
