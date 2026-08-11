import { readdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { getBasePath } from '$lib/utils/paths.js';
import { parseProjectFrontmatter } from '$lib/utils/projectFrontmatter.js';

const basePath = getBasePath();

// loadProjects() runs once per route, so the same problems would otherwise be
// reported four times per build. Only report when the set of problems changes,
// which still surfaces new ones as content is edited in dev.
let lastReported = null;

function reportProblems(problems, loadedCount) {
	const signature = problems.map(({ slug, reason }) => `${slug}:${reason}`).join('|');
	if (signature === lastReported) return;
	lastReported = signature;

	if (problems.length === 0) return;

	console.warn(`\n⚠️  ${problems.length} project(s) skipped:`);
	for (const { slug, reason } of problems) {
		console.warn(`   • ${slug}/ — ${reason}`);
	}
	console.warn(`✓ ${loadedCount} projects loaded\n`);
}

export async function loadProjects() {
	const projectsPath = join(process.cwd(), 'content/projects');

	let entries;
	try {
		entries = await readdir(projectsPath, { withFileTypes: true });
	} catch (error) {
		console.error('Error loading projects:', error);
		return [];
	}

	const projects = [];
	const problems = [];

	for (const entry of entries) {
		// Skips .DS_Store, the bundled example_projects.zip and any stray file.
		// __MACOSX is the resource-fork folder macOS puts in archives, so it
		// appears whenever example_projects.zip is unpacked — reporting it as a
		// broken project would be alarming noise.
		if (!entry.isDirectory() || entry.name.startsWith('.') || entry.name === '__MACOSX') continue;

		const slug = entry.name;
		const projectPath = join(projectsPath, slug);

		let raw;
		try {
			raw = await readFile(join(projectPath, 'index.md'), 'utf-8');
		} catch {
			problems.push({ slug, reason: 'no index.md' });
			continue;
		}

		const { metadata, problem } = parseProjectFrontmatter(raw, slug);
		if (problem) {
			problems.push(problem);
			continue;
		}

		projects.push({
			slug,
			...metadata,
			thumbnailSrc: `${basePath}/content/projects/${slug}/thumbnail.jpg`,
			hasThumbnail: existsSync(join(projectPath, 'thumbnail.jpg')),
			hasWebP: existsSync(join(projectPath, 'thumbnail.webp'))
		});
	}

	// Newest first; parseProjectFrontmatter guarantees every date is parseable
	projects.sort((a, b) => new Date(b.date) - new Date(a.date));

	reportProblems(problems, projects.length);

	return projects;
}
