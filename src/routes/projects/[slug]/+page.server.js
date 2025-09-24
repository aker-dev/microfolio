import { readFile, readdir, access, existsSync } from 'fs/promises';
import { existsSync as existsSyncSync } from 'fs';
import { join } from 'path';
import { parse } from 'yaml';
import { marked } from 'marked';
import { error } from '@sveltejs/kit';
import { extractImageMetadata, formatCreditLine } from '$lib/utils/imageMetadata.js';

// Get base path from environment - same logic as svelte.config.js
const basePath =
	process.env.CUSTOM_DOMAIN === 'true'
		? ''
		: process.env.NODE_ENV === 'production'
			? '/microfolio'
			: '';

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
		const resources = await getProjectResources(projectPath, slug);

		// Load thumbnail metadata
		const thumbnailMetadata = await loadThumbnailMetadata(projectPath, slug);

		return {
			project: {
				slug,
				...metadata,
				content: htmlContent,
				resources,
				thumbnailMetadata
			}
		};
	} catch (err) {
		console.error(`Error loading project ${slug}:`, err);
		throw error(404, `Project not found`);
	}
}

async function getProjectResources(projectPath, slug) {
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
			const imageList = imageFiles
				.filter((file) => /\.(jpg|jpeg|png)$/i.test(file))
				.map((file) => {
					// Check if WebP version exists
					const webpPath = join(imagesPath, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
					const hasWebP = existsSyncSync(webpPath);

					return {
						name: file,
						path: `${basePath}/content/projects/${slug}/images/${file}`,
						hasWebP
					};
				});

			// Load metadata for each image
			for (const image of imageList) {
				try {
					// Use local file path for metadata extraction
					const localImagePath = join(imagesPath, image.name);
					const metadata = await extractImageMetadata(localImagePath);

					// Add formatted credit line to metadata
					if (metadata) {
						metadata.creditLine = formatCreditLine(metadata);
					}

					image.metadata = metadata;
				} catch (error) {
					console.warn('Failed to load metadata for image:', image.name, error);
					image.metadata = null;
				}
			}

			resources.images = imageList;
		} catch {
			// Images folder doesn't exist, skip
		}

		// Check for videos folder
		const videosPath = join(projectPath, 'videos');
		try {
			const videoFiles = await readdir(videosPath);
			resources.videos = videoFiles
				.filter((file) => /\.(mp4|webm|mov)$/i.test(file))
				.map((file) => ({
					name: file,
					path: `${basePath}/content/projects/${slug}/videos/${file}`
				}));
		} catch {
			// Videos folder doesn't exist, skip
		}

		// Check for documents folder
		const documentsPath = join(projectPath, 'documents');
		try {
			const documentFiles = await readdir(documentsPath);
			resources.documents = documentFiles
				.filter((file) => /\.(pdf|doc|docx|ppt|pptx)$/i.test(file))
				.map((file) => ({
					name: file,
					path: `${basePath}/content/projects/${slug}/documents/${file}`
				}));
		} catch {
			// Documents folder doesn't exist, skip
		}
	} catch (error) {
		console.warn('Error reading project resources:', error);
	}

	return resources;
}

async function loadThumbnailMetadata(projectPath, slug) {
	const localThumbnailPath = join(projectPath, 'thumbnail.jpg');

	try {
		// Check if thumbnail exists
		await access(localThumbnailPath);

		// Load metadata using local file path
		const metadata = await extractImageMetadata(localThumbnailPath);

		// Add formatted credit line to metadata
		if (metadata) {
			metadata.creditLine = formatCreditLine(metadata);
		}

		return metadata;
	} catch (error) {
		console.warn('Failed to load thumbnail metadata:', localThumbnailPath, error);
		return null;
	}
}
