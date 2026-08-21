#!/usr/bin/env node

// Puts the demo projects in, and takes them out again.
//
//   pnpm demo            unzips content/projects/example_projects.zip — the
//                        thirty projects of the demo site — into content/projects/
//   pnpm demo --remove   removes them again, by name, from the zip's own listing
//
// git ignores the demo by name, so it is something to look at locally, next to
// your own projects, and never reaches your repository. The deploy workflow
// runs the same command to build the demo site.
//
// The zip is read here rather than by `unzip`, which Windows does not ship:
// central directory, then each entry's local header, stored or deflated — all
// the archive `zip -X` writes needs. No encryption, no zip64.

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { inflateRawSync } from 'node:zlib';

const SIG = { local: 0x04034b50, central: 0x02014b50, end: 0x06054b50 };

/** Lists a zip's entries; each one reads its own bytes on demand. */
export function readZip(buffer) {
	// The end-of-central-directory record sits last, before a comment of up to 64 KB
	let end = -1;
	for (let i = buffer.length - 22; i >= Math.max(0, buffer.length - 22 - 65535); i--) {
		if (buffer.readUInt32LE(i) === SIG.end) {
			end = i;
			break;
		}
	}
	if (end === -1) throw new Error('not a zip file');

	const count = buffer.readUInt16LE(end + 10);
	let at = buffer.readUInt32LE(end + 16);
	const entries = [];
	for (let n = 0; n < count; n++) {
		if (buffer.readUInt32LE(at) !== SIG.central)
			throw new Error('damaged zip: bad central directory');
		const flags = buffer.readUInt16LE(at + 8);
		const method = buffer.readUInt16LE(at + 10);
		const compressedSize = buffer.readUInt32LE(at + 20);
		const size = buffer.readUInt32LE(at + 24);
		const nameLength = buffer.readUInt16LE(at + 28);
		const extraLength = buffer.readUInt16LE(at + 30);
		const commentLength = buffer.readUInt16LE(at + 32);
		const localOffset = buffer.readUInt32LE(at + 42);
		const name = buffer.toString('utf8', at + 46, at + 46 + nameLength);
		at += 46 + nameLength + extraLength + commentLength;

		if (flags & 1) throw new Error(`${name} is encrypted`);
		if (name.startsWith('/') || name.split('/').includes('..')) {
			throw new Error(`${name} would escape the target directory`);
		}
		entries.push({
			name,
			size,
			isDirectory: name.endsWith('/'),
			read() {
				if (buffer.readUInt32LE(localOffset) !== SIG.local)
					throw new Error(`damaged zip at ${name}`);
				const start =
					localOffset +
					30 +
					buffer.readUInt16LE(localOffset + 26) +
					buffer.readUInt16LE(localOffset + 28);
				const data = buffer.subarray(start, start + compressedSize);
				const bytes = method === 0 ? data : method === 8 ? inflateRawSync(data) : null;
				if (bytes === null) throw new Error(`${name}: unsupported compression method ${method}`);
				if (bytes.length !== size)
					throw new Error(`${name}: expected ${size} bytes, got ${bytes.length}`);
				return bytes;
			}
		});
	}
	return entries;
}

/** The top-level directories an archive holds — for the demo, one per project. */
export function topLevelDirs(entries) {
	return [...new Set(entries.map((e) => e.name.split('/')[0]).filter(Boolean))].sort();
}

/** Extracts the archive into `projectsDir`; returns the project directories and the file count. */
export function installDemo({ zipPath, projectsDir }) {
	const entries = readZip(readFileSync(zipPath));
	let files = 0;
	for (const entry of entries) {
		const target = join(projectsDir, ...entry.name.split('/'));
		if (entry.isDirectory) {
			mkdirSync(target, { recursive: true });
			continue;
		}
		mkdirSync(dirname(target), { recursive: true });
		writeFileSync(target, entry.read());
		files++;
	}
	return { projects: topLevelDirs(entries), files };
}

/** Removes from `projectsDir` the directories the archive lists — and nothing else. */
export function removeDemo({ zipPath, projectsDir }) {
	const removed = [];
	for (const name of topLevelDirs(readZip(readFileSync(zipPath)))) {
		const dir = join(projectsDir, name);
		if (!existsSync(dir)) continue;
		rmSync(dir, { recursive: true, force: true });
		removed.push(name);
	}
	return removed;
}

// --- Command line ------------------------------------------------------------

function main(args) {
	const root = process.cwd();
	const projectsDir = resolve(root, 'content', 'projects');
	const zipPath = join(projectsDir, 'example_projects.zip');
	if (!existsSync(zipPath)) {
		console.error(
			`No demo here: content/projects/example_projects.zip is missing.\nIt ships with microfolio — https://github.com/aker-dev/microfolio/tree/main/content/projects`
		);
		process.exit(1);
	}

	if (args.includes('--remove')) {
		const removed = removeDemo({ zipPath, projectsDir });
		console.log(
			removed.length
				? `✓ removed ${removed.length} demo projects from content/projects/`
				: 'Nothing to remove: the demo projects are not there.'
		);
		return;
	}

	const { projects, files } = installDemo({ zipPath, projectsDir });
	console.log(`✓ ${projects.length} demo projects (${files} files) in content/projects/
  pnpm dev             to look at them
  pnpm demo --remove   to take them out again

git ignores them by name: they stay on this machine and never reach your repository.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	main(process.argv.slice(2));
}
