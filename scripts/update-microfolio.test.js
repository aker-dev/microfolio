import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { applyUpdate, decide, isProtected } from './update-microfolio.js';

const B = (text) => Buffer.from(text);

describe('decide', () => {
	it('leaves alone what upstream did not change, whatever happened to it here', () => {
		expect(decide(B('a'), B('a'), B('mine'))).toBe('unchanged');
		expect(decide(B('a'), B('a'), null)).toBe('unchanged');
		expect(decide(B('a'), null, null)).toBe('unchanged');
	});

	it('writes what changed upstream and was never edited here', () => {
		expect(decide(B('a'), B('b'), B('a'))).toBe('write');
		expect(decide(null, B('b'), null)).toBe('write');
	});

	it('is already done when the site carries the new version', () => {
		expect(decide(B('a'), B('b'), B('b'))).toBe('unchanged');
	});

	it('deletes what upstream dropped and was never edited here', () => {
		expect(decide(B('a'), null, B('a'))).toBe('delete');
	});

	it('respects a local deletion and a local edit of a dropped file', () => {
		expect(decide(B('a'), B('b'), null)).toBe('keep-deleted');
		expect(decide(B('a'), null, B('mine'))).toBe('keep-modified');
	});

	it('merges when both sides edited — including with no baseline', () => {
		expect(decide(B('a'), B('b'), B('c'))).toBe('merge');
		expect(decide(null, B('b'), B('c'))).toBe('merge');
	});
});

describe('isProtected', () => {
	it('covers the content, the config, the two images and env files', () => {
		for (const rel of [
			'content/index.md',
			'content/projects/my-project/index.md',
			'src/lib/config.js',
			'static/favicon.svg',
			'static/og.jpg',
			'.env',
			'.env.local'
		]) {
			expect(isProtected(rel), rel).toBe(true);
		}
	});

	it('leaves the engine to the update', () => {
		for (const rel of [
			'src/lib/config.test.js',
			'src/app.css',
			'src/lib/components/AkHeader.svelte',
			'static/robots.txt',
			'package.json',
			'.github/workflows/deploy.yml',
			'contents.md'
		]) {
			expect(isProtected(rel), rel).toBe(false);
		}
	});
});

describe('applyUpdate', () => {
	let tmp, root, baseline, target;

	async function tree(dir, files) {
		for (const [rel, body] of Object.entries(files)) {
			const file = join(dir, ...rel.split('/'));
			await mkdir(dirname(file), { recursive: true });
			await writeFile(file, body);
		}
	}
	const read = (rel) => readFile(join(root, ...rel.split('/')), 'utf8');
	const has = (rel) => existsSync(join(root, ...rel.split('/')));

	beforeEach(async () => {
		tmp = await mkdtemp(join(tmpdir(), 'microfolio-update-test-'));
		root = join(tmp, 'site');
		baseline = join(tmp, 'baseline');
		target = join(tmp, 'target');
		await Promise.all([root, baseline, target].map((dir) => mkdir(dir)));
	});

	afterEach(() => rm(tmp, { recursive: true, force: true }));

	it('updates, merges, keeps and reports, file by file', async () => {
		await tree(baseline, {
			'a.txt': '1',
			'b.txt': 'x',
			'c.txt': 'gone',
			'f.txt': 'a\n',
			'g.txt': 'g',
			'h.txt': 'h',
			'src/app.css': 'one\ntwo\nthree\nfour\nfive\n',
			'content/index.md': 'template',
			'src/lib/config.js': 'cfg v1'
		});
		await tree(target, {
			'a.txt': '2',
			'b.txt': 'x',
			'd.txt': 'new',
			'f.txt': 'b\n',
			'g.txt': 'g2',
			'src/app.css': 'one changed\ntwo\nthree\nfour\nfive\n',
			'content/index.md': 'template v2',
			'src/lib/config.js': 'cfg v2'
		});
		await tree(root, {
			'a.txt': '1',
			'b.txt': 'mine',
			'c.txt': 'gone',
			'f.txt': 'c\n',
			'h.txt': 'h, edited',
			'src/app.css': 'one\ntwo\nthree\nfour\nfive mine\n',
			'content/index.md': 'my home page',
			'src/lib/config.js': 'my cfg',
			'static/extra.txt': 'added by me'
		});

		const report = applyUpdate({ root, baselineDir: baseline, targetDir: target, workDir: tmp });

		expect(report).toEqual({
			written: ['a.txt', 'd.txt'],
			deleted: ['c.txt'],
			merged: ['src/app.css'],
			conflicts: ['f.txt'],
			keptDeleted: ['g.txt'],
			keptModified: ['h.txt']
		});
		expect(await read('a.txt')).toBe('2'); // untouched here, changed upstream
		expect(await read('b.txt')).toBe('mine'); // edited here, unchanged upstream
		expect(has('c.txt')).toBe(false); // dropped upstream
		expect(await read('d.txt')).toBe('new'); // new upstream
		expect(await read('src/app.css')).toBe('one changed\ntwo\nthree\nfour\nfive mine\n'); // both edits, far enough apart for git
		expect(await read('f.txt')).toBe('c\n'); // collision: mine stays…
		expect(await read('f.txt.upstream')).toBe('b\n'); // …and theirs sits next to it
		expect(has('g.txt')).toBe(false); // deleted here, stays deleted
		expect(await read('h.txt')).toBe('h, edited'); // edited here, dropped upstream: kept
		expect(await read('content/index.md')).toBe('my home page'); // protected
		expect(await read('src/lib/config.js')).toBe('my cfg'); // protected
		expect(await read('static/extra.txt')).toBe('added by me'); // in no release
	});

	it('writes nothing on a dry run but reports the same', async () => {
		await tree(baseline, { 'a.txt': '1', 'c.txt': 'gone' });
		await tree(target, { 'a.txt': '2', 'd.txt': 'new' });
		await tree(root, { 'a.txt': '1', 'c.txt': 'gone' });

		const report = applyUpdate({
			root,
			baselineDir: baseline,
			targetDir: target,
			dryRun: true,
			workDir: tmp
		});

		expect(report.written).toEqual(['a.txt', 'd.txt']);
		expect(report.deleted).toEqual(['c.txt']);
		expect(await read('a.txt')).toBe('1');
		expect(has('c.txt')).toBe(true);
		expect(has('d.txt')).toBe(false);
	});

	it('without a baseline, keeps every differing file and leaves an .upstream copy', async () => {
		await tree(target, { 'a.txt': '2', 'd.txt': 'new', 'same.txt': 's' });
		await tree(root, { 'a.txt': '1', 'same.txt': 's' });

		const report = applyUpdate({ root, baselineDir: null, targetDir: target, workDir: tmp });

		expect(report.written).toEqual(['d.txt']);
		expect(report.conflicts).toEqual(['a.txt']);
		expect(await read('a.txt')).toBe('1');
		expect(await read('a.txt.upstream')).toBe('2');
	});

	it('removes the directories a deletion leaves empty, and stops at the site', async () => {
		await tree(baseline, { 'old/deep/file.txt': 'x', 'keep/file.txt': 'k' });
		await tree(target, { 'keep/file.txt': 'k' });
		await tree(root, { 'old/deep/file.txt': 'x', 'keep/file.txt': 'k' });

		applyUpdate({ root, baselineDir: baseline, targetDir: target, workDir: tmp });

		expect(has('old')).toBe(false);
		expect(has('keep/file.txt')).toBe(true);
		expect(existsSync(root)).toBe(true);
	});
});
