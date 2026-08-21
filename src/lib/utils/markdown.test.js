import { describe, expect, it, vi } from 'vitest';

// The base path is the pathname of siteConfig.url, so this file pins the config
// rather than read the site's own: these tests also run on a fork whose url is
// its own domain, and they must stay green there.
vi.mock('../config.js', () => ({ siteConfig: { url: 'https://example.test/folio' } }));
import { renderMarkdownBody, splitFrontmatter } from './markdown.js';

describe('splitFrontmatter', () => {
	it('separates the frontmatter from the body', () => {
		const { frontmatter, body } = splitFrontmatter("---\ntitle: 'Hello'\n---\n\nSome text.\n");

		expect(frontmatter).toBe("title: 'Hello'");
		expect(body).toBe('Some text.');
	});

	it('keeps a horizontal rule in the body', () => {
		// The previous split('---') implementation cut the body here
		const raw = "---\ntitle: 'Hello'\n---\n\nBefore.\n\n---\n\nAfter.\n";
		const { frontmatter, body } = splitFrontmatter(raw);

		expect(frontmatter).toBe("title: 'Hello'");
		expect(body).toContain('Before.');
		expect(body).toContain('---');
		expect(body).toContain('After.');
	});

	it('reports no frontmatter when the file does not open with a delimiter', () => {
		const { frontmatter, body } = splitFrontmatter('Just a body.\n');

		expect(frontmatter).toBeNull();
		expect(body).toBe('Just a body.');
	});

	it('tolerates a byte order mark and CRLF line endings', () => {
		const { frontmatter, body } = splitFrontmatter(
			"﻿---\r\ntitle: 'Hello'\r\n---\r\n\r\nText.\r\n"
		);

		expect(frontmatter).toBe("title: 'Hello'");
		expect(body).toBe('Text.');
	});
});

describe('renderMarkdownBody', () => {
	it('renders the body and drops the frontmatter', () => {
		const html = renderMarkdownBody("---\ntitle: 'Hello'\n---\n\n## Heading\n");

		expect(html).toContain('<h2>Heading</h2>');
		expect(html).not.toContain('title:');
	});

	it('renders a horizontal rule that follows the frontmatter', () => {
		const html = renderMarkdownBody("---\ntitle: 'Hello'\n---\n\nBefore.\n\n---\n\nAfter.\n");

		expect(html).toContain('<hr>');
		expect(html).toContain('After.');
	});

	it('breaks a line that ends with a backslash, and only such a line', () => {
		// content/legal.md sets an address one line per fact and needs every one of them
		const html = renderMarkdownBody('One line\\\nNext line\n\nWrapped prose\ncarried on.\n');

		expect(html).toContain('One line<br>Next line');
		expect(html).toContain('Wrapped prose\ncarried on.');
	});
});

describe('image addresses in Markdown bodies', () => {
	// A Markdown author cannot know the base path, and the page URL is the
	// wrong anchor for a relative src (/about/ would resolve images/x.jpg to
	// /about/images/x.jpg, where nothing is served). renderMarkdownBody
	// resolves them against the assetBase its caller provides.

	it('resolves a relative image against the assetBase', () => {
		const html = renderMarkdownBody('![A plate](images/plate.jpg)', '/content');

		expect(html).toContain('src="/content/images/plate.jpg"');
	});

	it('rewrites images nested inside blockquotes and lists too', () => {
		const html = renderMarkdownBody('> ![Quoted](a.jpg)\n\n- ![Listed](b.jpg)\n', '/content');

		expect(html).toContain('src="/content/a.jpg"');
		expect(html).toContain('src="/content/b.jpg"');
	});

	it('prefixes a root-relative image with the base path in production', () => {
		const previous = process.env.NODE_ENV;
		process.env.NODE_ENV = 'production';
		try {
			const html = renderMarkdownBody('![Hero](/content/images/hero.jpg)', '/base/content');

			// The base path comes from siteConfig.url's pathname — /folio in the
			// config mocked above — and must land ahead of the author's path
			expect(html).toContain('src="/folio/content/images/hero.jpg"');
		} finally {
			process.env.NODE_ENV = previous;
		}
	});

	it('leaves absolute and anchor addresses alone', () => {
		const html = renderMarkdownBody(
			'![Remote](https://example.com/x.jpg)\n\n![Inline](data:image/gif;base64,R0lGOD)\n',
			'/content'
		);

		expect(html).toContain('src="https://example.com/x.jpg"');
		expect(html).toContain('src="data:image/gif;base64,R0lGOD"');
	});

	it('changes nothing when no assetBase is given', () => {
		const html = renderMarkdownBody('![A plate](images/plate.jpg)');

		expect(html).toContain('src="images/plate.jpg"');
	});
});

describe('links in Markdown bodies', () => {
	it('opens external links in a new tab', () => {
		const html = renderMarkdownBody('[AKER](https://aker.pro)');

		expect(html).toContain(
			'<a href="https://aker.pro" target="_blank" rel="noopener noreferrer">AKER</a>'
		);
	});

	it('leaves internal, anchor and mailto links in the same tab', () => {
		const html = renderMarkdownBody(
			'[projects](/projects/) and [write](mailto:hello@aker.pro) and [top](#top)'
		);

		expect(html).not.toContain('target="_blank"');
	});
});

describe('video embeds pasted into Markdown', () => {
	// The site promises to set no cookies; a pasted embed must not break that
	// promise behind the author's back, so the platforms' no-cookie modes are
	// applied at render time.

	it('routes a YouTube embed through youtube-nocookie.com', () => {
		const html = renderMarkdownBody(
			'<iframe width="560" height="315" src="https://www.youtube.com/embed/abc123" title="x"></iframe>'
		);

		expect(html).toContain('src="https://www.youtube-nocookie.com/embed/abc123"');
		expect(html).not.toContain('www.youtube.com');
	});

	it('leaves an embed that already uses youtube-nocookie.com alone', () => {
		const src = 'https://www.youtube-nocookie.com/embed/abc123';
		const html = renderMarkdownBody(`<iframe src="${src}"></iframe>`);

		expect(html).toContain(`src="${src}"`);
	});

	it('adds dnt=1 to a Vimeo player without a query string', () => {
		const html = renderMarkdownBody(
			'<iframe src="https://player.vimeo.com/video/76979871"></iframe>'
		);

		expect(html).toContain('src="https://player.vimeo.com/video/76979871?dnt=1"');
	});

	it('appends dnt=1 to a Vimeo player that already has a query string', () => {
		const html = renderMarkdownBody(
			'<iframe src="https://player.vimeo.com/video/76979871?badge=0&amp;autopause=0"></iframe>'
		);

		expect(html).toContain('video/76979871?badge=0&amp;autopause=0&amp;dnt=1"');
	});

	it('does not double a dnt parameter the author already set', () => {
		const src = 'https://player.vimeo.com/video/76979871?dnt=1';
		const html = renderMarkdownBody(`<iframe src="${src}"></iframe>`);

		expect(html).toContain(`src="${src}"`);
		expect(html.match(/dnt=1/g)).toHaveLength(1);
	});

	it('touches no other HTML', () => {
		const raw = '<iframe src="https://example.com/player?x=1"></iframe>';
		const html = renderMarkdownBody(raw);

		expect(html).toContain(raw);
	});
});

describe('a video address alone on its line', () => {
	// The simple way: paste the URL, nothing else on the line, get the player.

	it.each([
		['https://www.youtube.com/watch?v=HH7we9EaQok', 'www.youtube-nocookie.com/embed/HH7we9EaQok'],
		['https://youtu.be/HH7we9EaQok', 'www.youtube-nocookie.com/embed/HH7we9EaQok'],
		['https://www.youtube.com/shorts/HH7we9EaQok', 'www.youtube-nocookie.com/embed/HH7we9EaQok'],
		[
			'https://www.youtube.com/watch?v=HH7we9EaQok&t=42s',
			'www.youtube-nocookie.com/embed/HH7we9EaQok'
		],
		['https://vimeo.com/76979871', 'player.vimeo.com/video/76979871?dnt=1"'],
		[
			'https://vimeo.com/76979871/a1b2c3d4e5',
			'player.vimeo.com/video/76979871?dnt=1&amp;h=a1b2c3d4e5"'
		],
		['https://player.vimeo.com/video/76979871', 'player.vimeo.com/video/76979871?dnt=1"']
	])('turns %s into a player', (url, expectedSrc) => {
		const html = renderMarkdownBody(`Before.\n\n${url}\n\nAfter.`);

		expect(html).toContain(`<iframe src="https://${expectedSrc}`);
		expect(html).toContain('allowfullscreen');
		expect(html).not.toContain('<a href');
	});

	it('leaves a written link alone', () => {
		const html = renderMarkdownBody('[see the film](https://youtu.be/HH7we9EaQok)');

		expect(html).toContain('<a href="https://youtu.be/HH7we9EaQok"');
		expect(html).not.toContain('<iframe');
	});

	it('leaves an address inside a sentence alone', () => {
		const html = renderMarkdownBody('Watch it at https://youtu.be/HH7we9EaQok tonight.');

		expect(html).toContain('<a href="https://youtu.be/HH7we9EaQok"');
		expect(html).not.toContain('<iframe');
	});

	it('leaves a bare address that is not a video alone', () => {
		const html = renderMarkdownBody('https://aker.pro');

		expect(html).toContain('<a href="https://aker.pro"');
		expect(html).not.toContain('<iframe');
	});

	it('gives two addresses on two lines two players', () => {
		const html = renderMarkdownBody('https://youtu.be/HH7we9EaQok\n\nhttps://vimeo.com/76979871');

		expect(html.match(/<iframe/g)).toHaveLength(2);
	});
});
