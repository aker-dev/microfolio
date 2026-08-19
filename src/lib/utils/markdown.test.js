import { describe, expect, it } from 'vitest';
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
