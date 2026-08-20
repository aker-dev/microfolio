// A real, one-page PDF for each demo project — the old zip shipped 264-byte
// stubs with no content stream, which every viewer opened to a blank page (or
// refused outright). This emits the file by hand rather than pulling in a PDF
// library for what is one page of rectangles and two lines of Helvetica: the
// base-14 fonts need no embedding, so a complete valid document fits in ~1 KB.

const PAGE_W = 595; // A5 landscape, in points
const PAGE_H = 420;

function hexToPdfColor(hex) {
	const n = parseInt(hex.slice(1), 16);
	const r = ((n >> 16) & 255) / 255;
	const g = ((n >> 8) & 255) / 255;
	const b = (n & 255) / 255;
	return `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)}`;
}

// Typographic characters that exist in WinAnsi but not in latin1 — everything
// else in the demo titles is plain latin1 and passes straight through.
const WINANSI = { '–': '\x96', '—': '\x97', '‘': '\x91', '’': '\x92', '“': '\x93', '”': '\x94' };

function escapePdfText(text) {
	// () and \ are the only characters needing escapes in a literal string. The
	// fonts declare WinAnsiEncoding and the buffer is written latin1, so the
	// accented characters in the demo titles survive without embedding anything.
	return text.replace(/[–—‘’“”]/g, (c) => WINANSI[c]).replace(/[\\()]/g, (c) => `\\${c}`);
}

/**
 * Build the PDF for one project as a Buffer.
 * `accents` are the project's three accent colours from compose.js — the
 * dossier carries the same palette as its plates.
 */
export function buildProjectPdf(title, subtitle, accents) {
	// The page ground is cream, so a cream accent would be an invisible band
	const bands = accents
		.filter((hex) => hex !== '#F2EDE4')
		.slice(0, 3)
		.map((hex, i) => `${hexToPdfColor(hex)} rg ${40 + i * 60} ${PAGE_H - 120} 50 50 re f`)
		.join('\n');
	const content = [
		`${hexToPdfColor('#F2EDE4')} rg 0 0 ${PAGE_W} ${PAGE_H} re f`,
		bands,
		`${hexToPdfColor('#1B1B1B')} rg`,
		`BT /F1 22 Tf 40 ${PAGE_H - 180} Td (${escapePdfText(title)}) Tj ET`,
		`BT /F2 12 Tf 40 ${PAGE_H - 205} Td (${escapePdfText(subtitle)}) Tj ET`,
		`BT /F2 9 Tf 40 36 Td (Demonstration document generated for the microfolio demo site.) Tj ET`
	].join('\n');

	const objects = [
		'<< /Type /Catalog /Pages 2 0 R >>',
		'<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
		`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
			'/Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>',
		`<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`,
		'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
		'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'
	];

	let body = '%PDF-1.4\n';
	const offsets = [];
	objects.forEach((obj, i) => {
		offsets.push(Buffer.byteLength(body));
		body += `${i + 1} 0 obj\n${obj}\nendobj\n`;
	});

	const xrefStart = Buffer.byteLength(body);
	let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
	for (const off of offsets) {
		xref += `${String(off).padStart(10, '0')} 00000 n \n`;
	}
	const trailer =
		`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n` + `startxref\n${xrefStart}\n%%EOF\n`;

	return Buffer.from(body + xref + trailer, 'latin1');
}
