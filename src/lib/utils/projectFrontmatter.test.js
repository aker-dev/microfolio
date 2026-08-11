import { describe, expect, it } from 'vitest';
import { parseProjectFrontmatter } from './projectFrontmatter.js';

const valid = ['---', "title: 'A project'", "date: '2024-01-15'", '---', '', 'Body.'].join('\n');

function reasonFor(raw) {
	const { problem } = parseProjectFrontmatter(raw, 'a-project');
	return problem?.reason;
}

describe('parseProjectFrontmatter', () => {
	it('accepts a well formed project', () => {
		const { metadata, problem } = parseProjectFrontmatter(valid, 'a-project');

		expect(problem).toBeUndefined();
		expect(metadata.title).toBe('A project');
	});

	it('names the project in every problem it reports', () => {
		const { problem } = parseProjectFrontmatter('No frontmatter here.', 'a-project');

		expect(problem.slug).toBe('a-project');
	});

	it('rejects a file with no frontmatter block', () => {
		expect(reasonFor('Just a body.\n')).toMatch(/no YAML frontmatter/);
	});

	it('rejects an empty frontmatter block', () => {
		expect(reasonFor('---\n\n---\n\nBody.\n')).toMatch(/empty/);
	});

	it('reports invalid YAML rather than throwing', () => {
		expect(reasonFor("---\ntitle: 'unterminated\ndate: [1, 2\n---\n\nBody.\n")).toMatch(
			/invalid YAML/
		);
	});

	it.each([
		['title', "---\ndate: '2024-01-15'\n---\n\nBody.\n"],
		['date', "---\ntitle: 'A project'\n---\n\nBody.\n"]
	])('rejects a project with no %s', (field, raw) => {
		expect(reasonFor(raw)).toBe(`missing required field: ${field}`);
	});

	it('treats a blank title as missing', () => {
		expect(reasonFor("---\ntitle: '   '\ndate: '2024-01-15'\n---\n\nBody.\n")).toMatch(/title/);
	});

	it('rejects a date the cards could not format', () => {
		// new Date(...).toISOString() throws RangeError on these, which used to
		// fail the whole build instead of one project
		expect(reasonFor("---\ntitle: 'A project'\ndate: '2023-13-45'\n---\n\nBody.\n")).toMatch(
			/invalid date/
		);
		expect(reasonFor("---\ntitle: 'A project'\ndate: 'someday'\n---\n\nBody.\n")).toMatch(
			/invalid date/
		);
	});

	it('accepts an unquoted date', () => {
		// yaml v2 follows the YAML 1.2 core schema, which has no timestamp type,
		// so an unquoted date reaches us as a string just like a quoted one
		const raw = '---\ntitle: A project\ndate: 2024-01-15\n---\n\nBody.\n';
		const { metadata, problem } = parseProjectFrontmatter(raw, 'a-project');

		expect(problem).toBeUndefined();
		expect(metadata.date).toBe('2024-01-15');
	});

	it('leaves optional fields alone when they are absent', () => {
		const { metadata } = parseProjectFrontmatter(valid, 'a-project');

		expect(metadata.tags).toBeUndefined();
		expect(metadata.authors).toBeUndefined();
	});

	it('keeps a horizontal rule in the body out of the frontmatter', () => {
		const raw = "---\ntitle: 'A project'\ndate: '2024-01-15'\n---\n\nBefore.\n\n---\n\nAfter.\n";
		const { metadata, problem } = parseProjectFrontmatter(raw, 'a-project');

		expect(problem).toBeUndefined();
		expect(metadata.title).toBe('A project');
	});
});
