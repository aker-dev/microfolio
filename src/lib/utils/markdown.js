import { readFile } from 'fs/promises';
import { parse } from 'yaml';
import { marked } from 'marked';
import { getBasePath } from './paths.js';

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

// A URL with a scheme (or protocol-relative) is somebody else's address and is
// never rewritten.
const ABSOLUTE_URL = /^([a-z][a-z0-9+.-]*:|\/\/)/i;

// External links leave the reader's place in the portfolio; open them in a new
// tab. Internal links, anchors and mailto: keep the default behaviour.
marked.use({
	renderer: {
		link(token) {
			const text = this.parser.parseInline(token.tokens);
			const title = token.title ? ` title="${token.title}"` : '';
			const external = /^https?:\/\//i.test(token.href);
			const target = external ? ' target="_blank" rel="noopener noreferrer"' : '';
			return `<a href="${token.href}"${title}${target}>${text}</a>`;
		}
	}
});

// An author writing Markdown cannot know the base path (`/microfolio` on
// GitHub Pages, empty in dev), and the page's own URL is the wrong anchor for
// a relative src anyway — /about/ resolves `images/x.jpg` to /about/images/…,
// where nothing is served. So image addresses are resolved at render time:
// relative ones against the content folder the file lives in, root-relative
// ones against the base path.
function resolveAssetHref(href, assetBase) {
	if (!href || ABSOLUTE_URL.test(href) || href.startsWith('#')) return href;
	if (href.startsWith('/')) return `${getBasePath()}${href}`;
	return assetBase ? `${assetBase}/${href}` : href;
}

// Walk every token, including those nested in blockquotes, lists and tables.
function walkTokens(tokens, fn) {
	for (const token of tokens) {
		fn(token);
		if (token.tokens) walkTokens(token.tokens, fn);
		if (token.items) walkTokens(token.items, fn);
		if (token.header) for (const cell of token.header) walkTokens(cell.tokens, fn);
		if (token.rows)
			for (const row of token.rows) for (const cell of row) walkTokens(cell.tokens, fn);
	}
}

/**
 * Render the body of a Markdown file to HTML, dropping its frontmatter.
 * `assetBase` is the public URL of the folder the file's own assets live in
 * (base path included); image addresses in the body are resolved against it.
 */
export function renderMarkdownBody(raw, assetBase = '') {
	const tokens = marked.lexer(splitFrontmatter(raw).body);
	walkTokens(tokens, (token) => {
		if (token.type === 'image') {
			token.href = resolveAssetHref(token.href, assetBase);
		}
	});
	return marked.parser(tokens);
}

/**
 * Read a content page and return its frontmatter fields alongside the body
 * rendered to HTML. Used for the home page and the about page; projects go
 * through parseProjectFrontmatter() instead, which validates as it parses.
 */
export async function loadMarkdownPage(absolutePath, assetBase = '') {
	const raw = await readFile(absolutePath, 'utf-8');
	const { frontmatter } = splitFrontmatter(raw);
	const metadata = frontmatter ? (parse(frontmatter) ?? {}) : {};

	return { ...metadata, content: renderMarkdownBody(raw, assetBase) };
}
