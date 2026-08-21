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

// Pasted video embeds are routed through the platforms' no-cookie modes, so a
// site that promises to set no cookies keeps the promise when its author
// pastes a YouTube or Vimeo snippet: youtube.com/embed becomes
// youtube-nocookie.com/embed, and Vimeo players get dnt=1 (Do Not Track)
// unless it is already there. Everything else in the HTML passes untouched.
function privacyFriendlyEmbeds(html) {
	return html
		.replace(/https:\/\/www\.youtube\.com\/embed\//g, 'https://www.youtube-nocookie.com/embed/')
		.replace(
			/https:\/\/player\.vimeo\.com\/video\/([^"'\s?]+)(\?[^"'\s]*)?/g,
			(match, id, query) => {
				if (query && /[?&](amp;)?dnt=/.test(query)) return match;
				const separator = !query ? '?' : query.includes('&amp;') ? '&amp;' : '&';
				return `https://player.vimeo.com/video/${id}${query ?? ''}${separator}dnt=1`;
			}
		);
}

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

// A video address alone on its line becomes the player — the way GitHub,
// WordPress or Obsidian treat a bare link. Only a paragraph holding nothing but
// the URL qualifies: a written link ([see the film](…)) or an address in the
// middle of a sentence stays a link. The players use the same no-cookie modes
// as the pasted embeds above.
const VIDEO_PROVIDERS = [
	{
		pattern:
			/^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/,
		title: 'YouTube video',
		src: (m) => `https://www.youtube-nocookie.com/embed/${m[1]}`
	},
	{
		// vimeo.com/ID, vimeo.com/ID/HASH (an unlisted video, whose hash the
		// player needs as h=), player.vimeo.com/video/ID
		pattern: /^https?:\/\/(?:www\.)?(?:player\.)?vimeo\.com\/(?:video\/)?(\d+)(?:\/([a-z0-9]+))?/,
		title: 'Vimeo video',
		src: (m) => `https://player.vimeo.com/video/${m[1]}?dnt=1${m[2] ? `&amp;h=${m[2]}` : ''}`
	}
];

function videoEmbedFor(url) {
	for (const { pattern, title, src } of VIDEO_PROVIDERS) {
		const match = pattern.exec(url);
		if (match) {
			return `<iframe src="${src(match)}" title="${title}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
		}
	}
	return null;
}

// The shape marked gives a bare URL paragraph: a single autolinked token whose
// text is its own address. A written link has a different text.
function bareUrlOf(token) {
	if (token.type !== 'paragraph' || token.tokens?.length !== 1) return null;
	const [only] = token.tokens;
	return only.type === 'link' && only.text === only.href ? only.href : null;
}

// Walk every token, including those nested in blockquotes, lists and tables.
// The callback may return a replacement token, which takes the original's place.
function walkTokens(tokens, fn) {
	for (let i = 0; i < tokens.length; i++) {
		const replacement = fn(tokens[i]);
		if (replacement) tokens[i] = replacement;
		const token = tokens[i];
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
		if (token.type === 'html') {
			token.text = privacyFriendlyEmbeds(token.text);
			token.raw = privacyFriendlyEmbeds(token.raw);
		}
		const url = bareUrlOf(token);
		const embed = url && videoEmbedFor(url);
		if (embed) {
			return { type: 'html', block: true, pre: false, raw: token.raw, text: embed };
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
