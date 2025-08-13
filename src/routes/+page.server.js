import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { parse } from 'yaml';
import { marked } from 'marked';
import { error } from '@sveltejs/kit';

// Get base path from environment
const basePath = process.env.NODE_ENV === 'production' ? '/microfolio' : '';

export async function load() {
	const indexPath = join(process.cwd(), 'content/index.md');
	const projectsPath = join(process.cwd(), 'content/projects');

	try {
		// Load page content
		const content = await readFile(indexPath, 'utf-8');
		const [, frontmatter, ...markdownParts] = content.split('---');
		const markdownContent = markdownParts.join('---').trim();

		const metadata = parse(frontmatter);
		const htmlContent = marked(markdownContent);

		// Load featured projects
		const projectFolders = await readdir(projectsPath);
		const projects = [];

		for (const folder of projectFolders) {
			// Skip hidden files and .DS_Store
			if (folder.startsWith('.')) continue;
			const projectPath = join(projectsPath, folder);
			const indexPath = join(projectPath, 'index.md');

			try {
				const projectContent = await readFile(indexPath, 'utf-8');
				const [, projectFrontmatter] = projectContent.split('---');
				const projectMetadata = parse(projectFrontmatter);

				projects.push({
					slug: folder,
					...projectMetadata,
					thumbnailPath: `${basePath}/content/projects/${folder}/thumbnail.jpg`
				});
			} catch (error) {
				console.warn(`Error reading project ${folder}:`, error);
			}
		}

		// Filter featured projects and sort by date (newest first)
		const featuredProjects = projects
			.filter((project) => project.featured === true)
			.sort((a, b) => new Date(b.date) - new Date(a.date));

		return {
			page: {
				...metadata,
				content: htmlContent
			},
			featuredProjects
		};
	} catch (err) {
		console.error('Error loading home page content:', err);
		throw error(404, 'Page content not found');
	}
}
