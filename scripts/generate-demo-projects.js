#!/usr/bin/env node

// Regenerates content/projects/example_projects.zip — the thirty-project demo
// set CI unzips before building the demo site. Maintainer tool: it shells out
// to `zip` (present on macOS and Linux) and is not part of any build.
//
//   pnpm generate-demo            rebuild the zip
//   pnpm generate-demo --install  also refresh the unzipped copies in
//                                 content/projects/ (removes the previous
//                                 generated set; example-project is never
//                                 part of the zip)
//   pnpm generate-demo --example  regenerate the tracked example-project in
//                                 place: same model as the zipped set, plus a
//                                 full EXIF/IPTC pass (needs exiftool) and a
//                                 short video of its plates (needs ffmpeg).
//                                 Run pnpm optimize-images afterwards for the
//                                 committed thumbnail.webp/og.jpg
//
// Everything is deterministic — compositions are seeded by slug, file mtimes
// are pinned, and the zip entries are sorted — so regenerating without editing
// the dataset produces a byte-identical archive and a quiet diff.

import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readdir, rm, utimes, writeFile, copyFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { projects } from './demo-projects/projects.js';
import { exampleProject } from './demo-projects/example-project.js';
import { renderComposition, identityFor } from './demo-projects/compose.js';
import { buildProjectPdf } from './demo-projects/pdf.js';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const projectsDir = join(rootDir, 'content', 'projects');
const zipPath = join(projectsDir, 'example_projects.zip');

// Pinned mtime for every generated file, so the zip only changes when content does
const STAMP = new Date('2026-01-01T00:00:00Z');

const THUMB = { width: 1200, height: 900 }; // cards are 4:3
const PLATE = { width: 1600, height: 1200 };

// --- Sanity checks the rest of the repo depends on ----------------------------
// (see e2e/navigation.spec.js and the homepage featured grid)

function assertDataset() {
	const problems = [];
	const slugs = new Set();
	for (const p of projects) {
		if (slugs.has(p.slug)) problems.push(`duplicate slug: ${p.slug}`);
		slugs.add(p.slug);
		if (p.tags.includes(p.type)) problems.push(`${p.slug}: tag '${p.type}' repeats the type`);
		if (Number.isNaN(new Date(p.date).getTime())) problems.push(`${p.slug}: bad date ${p.date}`);
	}
	// The e2e pagination specs filter on this tag with rows=5 and need a
	// second page to exist (see e2e/navigation.spec.js)
	const withTag = projects.filter((p) => p.tags.includes('public-space')).length;
	if (withTag < 6) {
		problems.push(
			`only ${withTag} projects share the 'public-space' tag — pagination specs need 6+`
		);
	}
	const featured = projects.filter((p) => p.featured).length;
	if (featured !== 11) {
		problems.push(`${featured} featured projects — 11 expected (12 with example-project)`);
	}
	if (problems.length > 0) {
		throw new Error(`dataset problems:\n  ${problems.join('\n  ')}`);
	}
}

// --- index.md ------------------------------------------------------------------

function yamlQuote(value) {
	return `'${String(value).replace(/'/g, "''")}'`;
}

function frontmatterFor(p) {
	const lines = [
		'---',
		`title: ${yamlQuote(p.title)}`,
		`date: ${yamlQuote(p.date)}`,
		`location: ${yamlQuote(p.location)}`,
		`coordinates: [${p.coordinates[0]}, ${p.coordinates[1]}]`,
		`description: ${yamlQuote(p.description)}`,
		`type: ${yamlQuote(p.type)}`,
		`tags: [${p.tags.map(yamlQuote).join(', ')}]`,
		'authors:'
	];
	for (const author of p.authors) {
		lines.push(`  - name: ${yamlQuote(author.name)}`);
		lines.push(`    role: ${yamlQuote(author.role)}`);
	}
	if (p.extras) {
		for (const [key, value] of Object.entries(p.extras)) {
			lines.push(`${key}: ${yamlQuote(value)}`);
		}
	}
	lines.push(`featured: ${p.featured}`);
	lines.push('---');
	return lines.join('\n');
}

// --- Plates --------------------------------------------------------------------

async function writePlate(path, p, variant, size) {
	const svg = renderComposition(p.slug, variant, size.width, size.height);
	const year = p.date.slice(0, 4);
	const plateName = variant === 0 ? 'cover plate' : `plate ${variant}`;
	await sharp(Buffer.from(svg))
		.jpeg({ quality: 82, mozjpeg: true })
		.withExif({
			IFD0: {
				ImageDescription: `${p.title} — ${plateName}`,
				Artist: p.authors[0].name,
				Copyright: `© ${year} ${p.authors[0].name}`
			}
		})
		.toFile(path);
}

// --- Assembly ------------------------------------------------------------------

async function generateProject(stagingDir, p) {
	const dir = join(stagingDir, p.slug);
	await mkdir(join(dir, 'images'), { recursive: true });
	await mkdir(join(dir, 'documents'), { recursive: true });

	await writeFile(join(dir, 'index.md'), `${frontmatterFor(p)}\n\n${p.body.trim()}\n`);
	await writePlate(join(dir, 'thumbnail.jpg'), p, 0, THUMB);
	for (const variant of [1, 2, 3]) {
		await writePlate(join(dir, 'images', `plate-0${variant}.jpg`), p, variant, PLATE);
	}

	const { accents } = identityFor(p.slug);
	const pdf = buildProjectPdf(p.title, `${p.location} — ${p.date.slice(0, 4)}`, accents);
	await writeFile(join(dir, 'documents', 'project-dossier.pdf'), pdf);
}

async function pinMtimes(dir) {
	for (const entry of await readdir(dir, { withFileTypes: true, recursive: true })) {
		await utimes(join(entry.parentPath, entry.name), STAMP, STAMP);
	}
	await utimes(dir, STAMP, STAMP);
}

function zipStaging(stagingDir, outPath) {
	// Sorted, files-only entry list piped to zip -@ keeps the archive
	// byte-stable across machines; -X drops the platform extra fields.
	const files = execFileSync('find', ['.', '-type', 'f'], { cwd: stagingDir, encoding: 'utf-8' })
		.split('\n')
		.filter(Boolean)
		.sort();
	execFileSync('zip', ['-X', '-q', outPath, '-@'], { cwd: stagingDir, input: files.join('\n') });
}

// Refresh the unzipped working copies: every directory in content/projects/
// that git ignores is a generated one (the tracked example-project is not),
// so it can be removed and replaced by the fresh set.
async function installLocally() {
	for (const entry of await readdir(projectsDir, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		const dir = join(projectsDir, entry.name);
		try {
			execFileSync('git', ['check-ignore', '-q', dir], { cwd: rootDir });
		} catch {
			continue; // tracked (example-project) or otherwise not ours to delete
		}
		await rm(dir, { recursive: true });
	}
	execFileSync('unzip', ['-oq', zipPath], { cwd: projectsDir });
	console.log(`✓ installed the set into ${projectsDir}`);
}

// --- The tracked example project ----------------------------------------------
// Same model as the zipped set, written straight into content/projects/. Its
// images then get the full metadata treatment: the lightbox panel is demoed on
// this project, and sharp can only write EXIF — headline, credit, city and GPS
// are IPTC/composite fields, hence exiftool.

function haveTool(tool) {
	try {
		execFileSync('which', [tool], { stdio: 'ignore' });
		return true;
	} catch {
		return false;
	}
}

function exiftoolArgs(fields) {
	return Object.entries(fields).flatMap(([key, value]) =>
		Array.isArray(value) ? value.map((v) => `-${key}=${v}`) : [`-${key}=${value}`]
	);
}

async function generateExampleProject() {
	const dir = join(projectsDir, exampleProject.slug);
	await generateProject(projectsDir, exampleProject);

	const images = [
		join(dir, 'thumbnail.jpg'),
		join(dir, 'images', 'plate-01.jpg'),
		join(dir, 'images', 'plate-02.jpg'),
		join(dir, 'images', 'plate-03.jpg')
	];

	if (haveTool('exiftool')) {
		images.forEach((image, i) => {
			execFileSync('exiftool', [
				'-overwrite_original',
				'-q',
				...exiftoolArgs(exampleProject.exifCommon),
				...exiftoolArgs(exampleProject.plateExif[i]),
				image
			]);
		});
	} else {
		console.warn('⚠ exiftool not found — the plates carry only the basic EXIF sharp writes');
	}

	if (haveTool('ffmpeg')) {
		await mkdir(join(dir, 'videos'), { recursive: true });
		// A slow crossfade through the three plates: a real, playable file for
		// the Videos section of the project page.
		execFileSync('ffmpeg', [
			'-y',
			'-loglevel',
			'error',
			...images.slice(1).flatMap((img) => ['-loop', '1', '-t', '4', '-i', img]),
			'-filter_complex',
			'[0][1]xfade=transition=fade:duration=1:offset=3[a];' +
				'[a][2]xfade=transition=fade:duration=1:offset=6[b];' +
				'[b]scale=1280:960,format=yuv420p[v]',
			'-map',
			'[v]',
			'-an',
			'-movflags',
			'+faststart',
			join(dir, 'videos', 'light-cycle.mp4')
		]);
	} else {
		console.warn('⚠ ffmpeg not found — skipped the example video');
	}

	console.log(`✓ regenerated ${dir}`);
	console.log('  now run: pnpm optimize-images  (refreshes thumbnail.webp and og.jpg)');
}

if (process.argv.includes('--example')) {
	await generateExampleProject();
	process.exit(0);
}

assertDataset();
const stagingDir = await mkdtemp(join(tmpdir(), 'microfolio-demo-'));
try {
	for (const p of projects) {
		await generateProject(stagingDir, p);
	}
	await pinMtimes(stagingDir);
	const stagedZip = join(tmpdir(), `microfolio-demo-${STAMP.getTime()}.zip`);
	await rm(stagedZip, { force: true });
	zipStaging(stagingDir, stagedZip);
	await copyFile(stagedZip, zipPath);
	await rm(stagedZip, { force: true });
	console.log(`✓ ${projects.length} projects → ${zipPath}`);
	if (process.argv.includes('--install')) {
		await installLocally();
	}
} finally {
	await rm(stagingDir, { recursive: true, force: true });
}
