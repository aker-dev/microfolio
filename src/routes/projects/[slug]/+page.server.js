import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { parse } from 'yaml';
import { marked } from 'marked';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const { slug } = params;
	const projectPath = join(process.cwd(), 'content/projects', slug);
	const indexPath = join(projectPath, 'index.md');
	
	try {
		const content = await readFile(indexPath, 'utf-8');
		const [, frontmatter, ...markdownParts] = content.split('---');
		const markdownContent = markdownParts.join('---').trim();
		
		const metadata = parse(frontmatter);
		const htmlContent = marked(markdownContent);
		
		// Get project resources
		const resources = await getProjectResources(projectPath);
		
		return {
			project: {
				slug,
				...metadata,
				content: htmlContent,
				resources
			}
		};
	} catch (err) {
		console.error(`Error loading project ${slug}:`, err);
		throw error(404, `Project not found`);
	}
}

async function getProjectResources(projectPath) {
	const resources = {
		images: [],
		videos: [],
		documents: []
	};
	
	try {
		// Check for images folder
		const imagesPath = join(projectPath, 'images');
		try {
			const imageFiles = await readdir(imagesPath);
			resources.images = imageFiles
				.filter(file => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file))
				.map(file => ({
					name: file,
					path: `/content/projects/${projectPath.split('/').pop()}/images/${file}`
				}));
		} catch (e) {
			// Images folder doesn't exist, skip
		}
		
		// Check for videos folder
		const videosPath = join(projectPath, 'videos');
		try {
			const videoFiles = await readdir(videosPath);
			resources.videos = videoFiles
				.filter(file => /\.(mp4|webm|mov)$/i.test(file))
				.map(file => ({
					name: file,
					path: `/content/projects/${projectPath.split('/').pop()}/videos/${file}`
				}));
		} catch (e) {
			// Videos folder doesn't exist, skip
		}
		
		// Check for documents folder
		const documentsPath = join(projectPath, 'documents');
		try {
			const documentFiles = await readdir(documentsPath);
			resources.documents = documentFiles
				.filter(file => /\.(pdf|doc|docx|ppt|pptx)$/i.test(file))
				.map(file => ({
					name: file,
					path: `/content/projects/${projectPath.split('/').pop()}/documents/${file}`
				}));
		} catch (e) {
			// Documents folder doesn't exist, skip
		}
	} catch (error) {
		console.warn('Error reading project resources:', error);
	}
	
	return resources;
}