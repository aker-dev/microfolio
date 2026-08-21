#!/usr/bin/env node

// Updates a microfolio site to a newer release while keeping what is yours.
//
//   pnpm update-microfolio             to the latest release
//   pnpm update-microfolio 1.2.0       to that release (the leading v is optional)
//   pnpm update-microfolio --dry-run   only say what would change
//   pnpm update-microfolio --force     go ahead with uncommitted changes, or without git
//
// It downloads two releases from github.com/aker-dev/microfolio — the one this
// site runs (its package.json version) and the one asked for — and decides file
// by file, with three copies in hand:
//
//   - content/, src/lib/config.js, static/favicon.svg, static/og.jpg and .env
//     files are yours and are never touched (PROTECTED below). Files you added
//     are in neither release, so they are not looked at either
//   - a file the two releases agree on is left alone, whatever you did to it
//   - a file that changed upstream and that you never edited gets the new
//     version — or goes away, if the release dropped it
//   - a file changed on both sides goes through `git merge-file`; when the two
//     edits cannot be combined, yours stays and the new version is written next
//     to it as <file>.upstream, for you to look at
//
// It ends by listing what it did, what it left to you, and what changed in
// config.js upstream — that file is yours, so new settings are reported, not
// applied. Plain Node, no dependency on the site's node_modules: a copy of this
// file runs in a site that predates it.

import { execFileSync, spawnSync } from 'node:child_process';
import {
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	rmdirSync,
	statSync,
	unlinkSync,
	writeFileSync
} from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const REPO = 'aker-dev/microfolio';

/** What belongs to the site's owner. A trailing slash marks a directory; `.env` is a prefix. */
export const PROTECTED = [
	'content/',
	'src/lib/config.js',
	'static/favicon.svg',
	'static/og.jpg',
	'.env'
];

export function isProtected(rel) {
	return PROTECTED.some((p) => (p.endsWith('/') || p === '.env' ? rel.startsWith(p) : rel === p));
}

const same = (a, b) => (a === null ? b === null : b !== null && a.equals(b));

/**
 * What to do with one file, given its bytes in the release the site runs
 * (`old`), the release it is moving to (`neu`) and the site itself (`cur`) —
 * `null` where the file does not exist.
 */
export function decide(old, neu, cur) {
	if (same(old, neu) || same(cur, neu)) return 'unchanged';
	if (cur === null) return old === null ? 'write' : 'keep-deleted';
	if (same(cur, old)) return neu === null ? 'delete' : 'write';
	return neu === null ? 'keep-modified' : 'merge';
}

// --- Files -------------------------------------------------------------------

function listFiles(dir, prefix = '') {
	const out = [];
	for (const entry of readdirSync(join(dir, prefix), { withFileTypes: true })) {
		const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
		if (entry.isDirectory()) out.push(...listFiles(dir, rel));
		else if (entry.isFile()) out.push(rel);
	}
	return out;
}

const toPath = (dir, rel) => join(dir, ...rel.split('/'));

function readOrNull(dir, rel) {
	const file = toPath(dir, rel);
	return existsSync(file) && statSync(file).isFile() ? readFileSync(file) : null;
}

const isBinary = (buf) => buf.subarray(0, 8000).includes(0);

function writeUnder(root, rel, buf, mode) {
	const file = toPath(root, rel);
	mkdirSync(dirname(file), { recursive: true });
	writeFileSync(file, buf, mode === undefined ? {} : { mode });
}

/** Removes the file, and every directory that is left empty — never climbing past the site. */
function removeUnder(root, rel) {
	const file = toPath(root, rel);
	unlinkSync(file);
	for (let dir = dirname(file); dir !== root && readdirSync(dir).length === 0; dir = dirname(dir)) {
		rmdirSync(dir);
	}
}

// --- git ---------------------------------------------------------------------

const haveGit = () => spawnSync('git', ['--version']).status === 0;

/** Three-way merge through git; null when git is missing, a side is binary, or the edits collide. */
function merge(cur, old, neu, workDir) {
	const base = old ?? Buffer.alloc(0);
	if ([cur, base, neu].some(isBinary)) return null;
	const dir = join(workDir, 'merge');
	mkdirSync(dir, { recursive: true });
	writeFileSync(join(dir, 'cur'), cur);
	writeFileSync(join(dir, 'old'), base);
	writeFileSync(join(dir, 'neu'), neu);
	const result = spawnSync(
		'git',
		['merge-file', '-p', join(dir, 'cur'), join(dir, 'old'), join(dir, 'neu')],
		{ maxBuffer: 64 * 1024 * 1024 }
	);
	// The exit status is the number of conflicts; negative (reported as 255) on error
	return result.status === 0 ? result.stdout : null;
}

function gitState(root) {
	const run = (args) => spawnSync('git', args, { cwd: root, encoding: 'utf8' });
	if (run(['rev-parse', '--is-inside-work-tree']).status !== 0)
		return { repo: false, dirty: false };
	return { repo: true, dirty: run(['status', '--porcelain']).stdout.trim() !== '' };
}

/** The hunks of what changed upstream in config.js — the one file that is reported rather than applied. */
function configDiff(baselineDir, targetDir) {
	const old = baselineDir && readOrNull(baselineDir, 'src/lib/config.js');
	const neu = readOrNull(targetDir, 'src/lib/config.js');
	if (!old || !neu || old.equals(neu)) return null;
	const diff = spawnSync(
		'git',
		[
			'diff',
			'--no-index',
			'--no-color',
			'--',
			toPath(baselineDir, 'src/lib/config.js'),
			toPath(targetDir, 'src/lib/config.js')
		],
		{ encoding: 'utf8' }
	);
	const hunks = (diff.stdout ?? '')
		.split('\n')
		.filter((line) => !/^(diff --git|index |--- |\+\+\+ )/.test(line))
		.join('\n')
		.trim();
	return hunks || null;
}

// --- The update --------------------------------------------------------------

/**
 * Applies the release extracted in `targetDir` over the site at `root`, telling
 * the owner's edits from upstream's with the release extracted in `baselineDir`
 * (null when there is none: every difference is then the owner's). Returns what
 * it did, by relative path; on a dry run it only says what it would do.
 */
export function applyUpdate({ root, baselineDir, targetDir, dryRun = false, workDir }) {
	root = resolve(root);
	const canMerge = haveGit();
	const report = {
		written: [],
		deleted: [],
		merged: [],
		conflicts: [],
		keptDeleted: [],
		keptModified: []
	};

	const paths = new Set(listFiles(targetDir));
	if (baselineDir) for (const rel of listFiles(baselineDir)) paths.add(rel);

	for (const rel of [...paths].filter((p) => !isProtected(p)).sort()) {
		const old = baselineDir ? readOrNull(baselineDir, rel) : null;
		const neu = readOrNull(targetDir, rel);
		const cur = readOrNull(root, rel);

		switch (decide(old, neu, cur)) {
			case 'write':
				report.written.push(rel);
				if (!dryRun) writeUnder(root, rel, neu, statSync(toPath(targetDir, rel)).mode);
				break;
			case 'delete':
				report.deleted.push(rel);
				if (!dryRun) removeUnder(root, rel);
				break;
			case 'merge': {
				const merged = canMerge ? merge(cur, old, neu, workDir) : null;
				if (merged) {
					report.merged.push(rel);
					if (!dryRun) writeUnder(root, rel, merged);
				} else {
					report.conflicts.push(rel);
					if (!dryRun) writeUnder(root, `${rel}.upstream`, neu);
				}
				break;
			}
			case 'keep-deleted':
				report.keptDeleted.push(rel);
				break;
			case 'keep-modified':
				report.keptModified.push(rel);
				break;
		}
	}
	return report;
}

// --- Releases ----------------------------------------------------------------

async function download(url) {
	const res = await fetch(url, {
		headers: { 'user-agent': 'microfolio-update', accept: 'application/vnd.github+json' }
	});
	if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
	return res;
}

export async function latestVersion() {
	const res = await download(`https://api.github.com/repos/${REPO}/releases/latest`);
	return (await res.json()).tag_name.replace(/^v/, '');
}

/** Fetches release `version` and extracts it into `dir`; throws when there is no such release. */
async function fetchRelease(version, dir) {
	const res = await download(`https://github.com/${REPO}/archive/refs/tags/v${version}.tar.gz`);
	const tarball = `${dir}.tar.gz`;
	writeFileSync(tarball, Buffer.from(await res.arrayBuffer()));
	mkdirSync(dir, { recursive: true });
	execFileSync('tar', ['-xzf', tarball, '--strip-components=1', '-C', dir]);
	return dir;
}

function stampVersion(pkgPath, version) {
	const text = readFileSync(pkgPath, 'utf8');
	const next = text.replace(/"version":\s*"[^"]*"/, `"version": "${version}"`);
	if (next !== text) writeFileSync(pkgPath, next);
}

// --- Command line ------------------------------------------------------------

class UserError extends Error {}

function printReport(report, { target, dryRun, diff, noBaseline }) {
	const would = dryRun ? 'would be ' : '';
	const count = (list) => `${list.length} ${list.length === 1 ? 'file' : 'files'}`;
	const lines = [];
	if (report.written.length) lines.push(`  ${would}updated    ${count(report.written)}`);
	if (report.deleted.length) lines.push(`  ${would}removed    ${count(report.deleted)}`);
	if (report.merged.length) {
		lines.push(
			`  ${would}merged     ${count(report.merged)} — edited on both sides, combined cleanly:`
		);
		for (const rel of report.merged) lines.push(`               ${rel}`);
	}
	if (report.conflicts.length) {
		lines.push(
			`  conflicts  ${count(report.conflicts)} — yours ${would}kept, the new version next to it as .upstream:`
		);
		for (const rel of report.conflicts) lines.push(`               ${rel}`);
	}
	for (const rel of report.keptDeleted)
		lines.push(`  left alone ${rel} (deleted here, changed upstream)`);
	for (const rel of report.keptModified)
		lines.push(`  left alone ${rel} (edited here, dropped upstream)`);
	if (!lines.length) lines.push('  nothing to change');
	console.log(lines.join('\n'));

	if (noBaseline && report.conflicts.length) {
		console.log(
			'\n  Without the release this site runs to compare with, every file that differs is\n  treated as yours. Look at each .upstream copy before deleting it.'
		);
	}
	if (diff) {
		console.log(
			`\nsrc/lib/config.js is yours and was not touched. Upstream changed it like this:\n`
		);
		console.log(diff.replace(/^/gm, '  '));
	}
	if (dryRun) return;
	console.log(`
Next:
  pnpm install
  pnpm dev                                   look at the site
  git add -A && git commit -m "Update microfolio to ${target}"

What changed: https://github.com/${REPO}/blob/v${target}/CHANGELOG.md`);
}

async function main(args) {
	const dryRun = args.includes('--dry-run');
	const force = args.includes('--force');
	const asked = args.find((a) => !a.startsWith('-'));
	const root = process.cwd();
	const pkgPath = join(root, 'package.json');

	if (!existsSync(pkgPath) || !existsSync(join(root, 'src', 'lib', 'config.js'))) {
		throw new UserError(
			'Run this from the folder of your microfolio site — the one holding package.json and src/lib/config.js.'
		);
	}
	const current = JSON.parse(readFileSync(pkgPath, 'utf8')).version;

	if (!dryRun && !force) {
		const git = gitState(root);
		if (!git.repo) {
			throw new UserError(
				'This folder is not a git repository, so nothing could undo the update.\nMake a copy of the folder first, then run again with --force.'
			);
		}
		if (git.dirty) {
			throw new UserError(
				'There are uncommitted changes. Commit them (or `git stash -u` them) first, so that\n`git checkout . && git clean -fd` can undo the update if you do not like it — or run again with --force.'
			);
		}
	}

	const target = (asked ?? (await latestVersion())).replace(/^v/, '');
	if (target === current) {
		console.log(`This site already runs microfolio ${current}.`);
		return;
	}
	console.log(
		`microfolio ${current} → ${target}${dryRun ? '   (dry run: nothing is written)' : ''}\n`
	);

	const tmp = await mkdtemp(join(tmpdir(), 'microfolio-update-'));
	try {
		let targetDir;
		try {
			targetDir = await fetchRelease(target, join(tmp, 'target'));
		} catch (error) {
			throw new UserError(
				`Could not fetch release ${target}: ${error.message}\nThe releases: https://github.com/${REPO}/releases`
			);
		}
		let baselineDir = null;
		try {
			baselineDir = await fetchRelease(current, join(tmp, 'baseline'));
		} catch {
			console.log(`⚠️  No release ${current} on GitHub to compare this site with.\n`);
		}

		const report = applyUpdate({ root, baselineDir, targetDir, dryRun, workDir: tmp });
		if (!dryRun) stampVersion(pkgPath, target);
		printReport(report, {
			target,
			dryRun,
			diff: configDiff(baselineDir, targetDir),
			noBaseline: baselineDir === null
		});
	} finally {
		await rm(tmp, { recursive: true, force: true });
	}
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	main(process.argv.slice(2)).catch((error) => {
		console.error(`\n${error instanceof UserError ? error.message : error.stack}`);
		process.exit(1);
	});
}
