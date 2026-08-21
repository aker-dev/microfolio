import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { installDemo, readZip, removeDemo, topLevelDirs } from './install-demo.js';

const DEMO_ZIP = fileURLToPath(
	new URL('../content/projects/example_projects.zip', import.meta.url)
);
// The docs tell a site that has no use for the demo to delete the zip, and its
// unit tests run on that site's CI too: the two tests that need the real
// archive wait rather than fail. The ones on storedZip() cover the rest.
const hasDemo = existsSync(DEMO_ZIP);

/** A zip of stored entries, enough to probe the reader without a zip tool around. */
function storedZip(files) {
	const parts = [];
	const central = [];
	let offset = 0;
	for (const [name, body] of Object.entries(files)) {
		const nameBuf = Buffer.from(name);
		const data = Buffer.from(body);
		const local = Buffer.alloc(30);
		local.writeUInt32LE(0x04034b50, 0);
		local.writeUInt16LE(20, 4);
		local.writeUInt32LE(data.length, 18);
		local.writeUInt32LE(data.length, 22);
		local.writeUInt16LE(nameBuf.length, 26);
		parts.push(local, nameBuf, data);

		const entry = Buffer.alloc(46);
		entry.writeUInt32LE(0x02014b50, 0);
		entry.writeUInt16LE(20, 6);
		entry.writeUInt32LE(data.length, 20);
		entry.writeUInt32LE(data.length, 24);
		entry.writeUInt16LE(nameBuf.length, 28);
		entry.writeUInt32LE(offset, 42);
		central.push(entry, nameBuf);
		offset += local.length + nameBuf.length + data.length;
	}
	const directory = Buffer.concat(central);
	const end = Buffer.alloc(22);
	end.writeUInt32LE(0x06054b50, 0);
	end.writeUInt16LE(central.length / 2, 8);
	end.writeUInt16LE(central.length / 2, 10);
	end.writeUInt32LE(directory.length, 12);
	end.writeUInt32LE(offset, 16);
	return Buffer.concat([...parts, directory, end]);
}

describe('readZip', () => {
	it.skipIf(!hasDemo)(
		'reads the demo archive: thirty projects, every entry the size it declares',
		() => {
			const entries = readZip(readFileSync(DEMO_ZIP));
			expect(topLevelDirs(entries)).toHaveLength(30);
			expect(entries.filter((e) => e.name.endsWith('/index.md'))).toHaveLength(30);
			for (const entry of entries.filter((e) => !e.isDirectory)) {
				expect(entry.read().length, entry.name).toBe(entry.size);
			}
		}
	);

	it('reads stored entries too, and keeps directories apart from files', () => {
		const entries = readZip(storedZip({ 'a/': '', 'a/hello.txt': 'hello', 'b/x.txt': 'x' }));
		expect(entries.map((e) => e.name)).toEqual(['a/', 'a/hello.txt', 'b/x.txt']);
		expect(entries[0].isDirectory).toBe(true);
		expect(entries[1].read().toString()).toBe('hello');
		expect(topLevelDirs(entries)).toEqual(['a', 'b']);
	});

	it('refuses an entry that would escape the target directory', () => {
		expect(() => readZip(storedZip({ '../outside.txt': 'x' }))).toThrow(/escape/);
		expect(() => readZip(storedZip({ '/etc/passwd': 'x' }))).toThrow(/escape/);
	});

	it('refuses what is not a zip', () => {
		expect(() =>
			readZip(Buffer.from('just some text, long enough to be searched through'))
		).toThrow(/not a zip/);
	});
});

describe('installDemo / removeDemo', () => {
	let tmp;
	beforeEach(async () => {
		tmp = await mkdtemp(join(tmpdir(), 'microfolio-demo-test-'));
	});
	afterEach(() => rm(tmp, { recursive: true, force: true }));

	it('puts the projects in, and takes out only what it put in', async () => {
		const zipPath = join(tmp, 'demo.zip');
		await writeFile(
			zipPath,
			storedZip({ 'one/index.md': '# one', 'one/images/a.jpg': 'jpg', 'two/index.md': '# two' })
		);
		await mkdir(join(tmp, 'mine'));
		await writeFile(join(tmp, 'mine', 'index.md'), '# my own project');

		const installed = installDemo({ zipPath, projectsDir: tmp });
		expect(installed).toEqual({ projects: ['one', 'two'], files: 3 });
		expect(existsSync(join(tmp, 'one', 'images', 'a.jpg'))).toBe(true);

		const removed = removeDemo({ zipPath, projectsDir: tmp });
		expect(removed).toEqual(['one', 'two']);
		expect(readdirSync(tmp).sort()).toEqual(['demo.zip', 'mine']);
		expect(removeDemo({ zipPath, projectsDir: tmp })).toEqual([]);
	});

	it.skipIf(!hasDemo)('installs the real demo', () => {
		const { projects, files } = installDemo({ zipPath: DEMO_ZIP, projectsDir: tmp });
		expect(projects).toHaveLength(30);
		expect(files).toBeGreaterThan(30);
		expect(existsSync(join(tmp, projects[0], 'thumbnail.jpg'))).toBe(true);
	});
});
