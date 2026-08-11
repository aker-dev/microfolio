import { parse } from 'yaml';
import { splitFrontmatter } from './markdown.js';

// Without these two a project cannot be listed: the title is its only label,
// and every view sorts and displays projects by date.
const REQUIRED_FIELDS = ['title', 'date'];

function isBlank(value) {
	return (
		value === undefined || value === null || (typeof value === 'string' && value.trim() === '')
	);
}

/**
 * Validate the frontmatter of a project's index.md.
 *
 * Returns `{ metadata }` for a usable project, or `{ problem }` describing in
 * plain words what the author has to fix. Projects are written by hand, so a
 * single bad file must never take the whole build down.
 */
export function parseProjectFrontmatter(raw, slug) {
	const { frontmatter } = splitFrontmatter(raw);

	if (frontmatter === null) {
		return { problem: { slug, reason: 'no YAML frontmatter block at the top of index.md' } };
	}

	let metadata;
	try {
		metadata = parse(frontmatter);
	} catch (err) {
		return { problem: { slug, reason: `invalid YAML — ${err.message.split('\n')[0]}` } };
	}

	if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
		return { problem: { slug, reason: 'frontmatter is empty' } };
	}

	const missing = REQUIRED_FIELDS.filter((field) => isBlank(metadata[field]));
	if (missing.length > 0) {
		return { problem: { slug, reason: `missing required field: ${missing.join(', ')}` } };
	}

	// The cards render `new Date(date).toISOString()`, which throws on an
	// unparseable date and would fail the build rather than one project.
	if (Number.isNaN(new Date(metadata.date).getTime())) {
		return { problem: { slug, reason: `invalid date: ${JSON.stringify(metadata.date)}` } };
	}

	return { metadata };
}
