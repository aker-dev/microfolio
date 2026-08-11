import { readFile } from 'fs/promises';
import { parse } from 'yaml';
import { marked } from 'marked';

// Matches a leading YAML frontmatter block and captures it separately from the
// body. The lazy quantifier stops at the *first* closing delimiter, so a `---`
// horizontal rule further down the Markdown stays part of the body.
const FRONTMATTER = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

/**
 * Split a Markdown file into its raw frontmatter and its body.
 * `frontmatter` is null when the file has no frontmatter block at all.
 */
export function splitFrontmatter(raw) {
	const match = FRONTMATTER.exec(raw);

	if (!match) {
		return { frontmatter: null, body: raw.trim() };
	}

	return { frontmatter: match[1], body: match[2].trim() };
}

/**
 * Read a content page and return its frontmatter fields alongside the body
 * rendered to HTML. Used for the home page, the about page and each project.
 */
export async function loadMarkdownPage(absolutePath) {
	const raw = await readFile(absolutePath, 'utf-8');
	const { frontmatter, body } = splitFrontmatter(raw);
	const metadata = frontmatter ? (parse(frontmatter) ?? {}) : {};

	return { ...metadata, content: marked(body) };
}
