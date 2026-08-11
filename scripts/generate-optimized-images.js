#!/usr/bin/env node

import sharp from 'sharp';
import { readdir, access, stat } from 'fs/promises';
import { join, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const contentDir = join(projectRoot, 'content/projects');

// Unified size configuration - one size fits all
const OPTIMIZED_SIZE = { width: 600, maxHeight: 800 };

/**
 * Check if a file exists
 */
async function fileExists(filePath) {
	try {
		await access(filePath);
		return true;
	} catch {
		return false;
	}
}

/**
 * Check if an image needs to be regenerated
 */
async function needsRegeneration(sourcePath, targetPath) {
	if (!(await fileExists(targetPath))) {
		return true;
	}

	const sourceStats = await stat(sourcePath);
	const targetStats = await stat(targetPath);

	return sourceStats.mtime > targetStats.mtime;
}

/**
 * Generate an optimized WebP thumbnail
 */
async function generateOptimizedWebP(inputPath, outputPath, quality = 80) {
	try {
		await sharp(inputPath)
			.resize(OPTIMIZED_SIZE.width, OPTIMIZED_SIZE.maxHeight, {
				fit: 'inside',
				withoutEnlargement: true
			})
			.webp({
				quality,
				effort: 6
			})
			.toFile(outputPath);

		console.log(`✅ Generated: ${outputPath}`);
		return true;
	} catch (error) {
		console.error(`❌ Error generating ${outputPath}:`, error.message);
		return false;
	}
}

/**
 * Process project thumbnails (main project thumbnails for AkProjectCard)
 */
async function processProjectThumbnails() {
	console.log('🎯 Processing project thumbnails for AkProjectCard...');

	const projects = await readdir(contentDir);
	let processed = 0;
	let skipped = 0;

	for (const projectName of projects) {
		// Skip non-directories and hidden files
		if (projectName.startsWith('.') || projectName.endsWith('.zip')) {
			continue;
		}

		const projectPath = join(contentDir, projectName);
		const thumbnailPath = join(projectPath, 'thumbnail.jpg');

		// Check if the thumbnail exists
		if (!(await fileExists(thumbnailPath))) {
			console.log(`⚠️  No thumbnail found for project: ${projectName}`);
			continue;
		}

		// Output path with simple extension change
		const webpPath = join(projectPath, 'thumbnail.webp');

		// Check if we need to regenerate
		if (!(await needsRegeneration(thumbnailPath, webpPath))) {
			skipped++;
			continue;
		}

		console.log(`📸 Processing thumbnail for: ${projectName}`);

		// Generate WebP
		await generateOptimizedWebP(thumbnailPath, webpPath);

		processed++;
	}

	console.log(`✨ Processed ${processed} project thumbnails, skipped ${skipped}`);
}

/**
 * Process gallery thumbnails (thumbnails in project galleries)
 */
async function processGalleryThumbnails() {
	console.log('🖼️  Processing gallery thumbnails...');

	const projects = await readdir(contentDir);
	let processed = 0;
	let skipped = 0;

	for (const projectName of projects) {
		if (projectName.startsWith('.') || projectName.endsWith('.zip')) {
			continue;
		}

		const projectPath = join(contentDir, projectName);
		const imagesPath = join(projectPath, 'images');

		// Check if the images folder exists
		if (!(await fileExists(imagesPath))) {
			continue;
		}

		// List images in the gallery
		const images = await readdir(imagesPath);

		for (const imageName of images) {
			const imagePath = join(imagesPath, imageName);
			const ext = extname(imageName).toLowerCase();

			// Process only original image formats
			if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
				continue;
			}

			// Skip WebP files (already optimized)
			if (ext === '.webp') {
				continue;
			}

			const baseName = basename(imageName, ext);
			const webpPath = join(imagesPath, `${baseName}.webp`);

			// Check if we need to regenerate
			if (!(await needsRegeneration(imagePath, webpPath))) {
				skipped++;
				continue;
			}

			console.log(`📷 Processing gallery image: ${projectName}/${imageName}`);

			// Generate WebP
			await generateOptimizedWebP(imagePath, webpPath);

			processed++;
		}
	}

	console.log(`✨ Processed ${processed} gallery thumbnails, skipped ${skipped}`);
}

/**
 * Display final statistics
 */
async function showStats() {
	console.log('📊 Final statistics:');

	// Count optimized thumbnails
	let optimizedCount = 0;

	async function countFiles(dir) {
		try {
			const entries = await readdir(dir, { withFileTypes: true });

			for (const entry of entries) {
				if (entry.isDirectory()) {
					await countFiles(join(dir, entry.name));
				} else if (entry.name.endsWith('.webp')) {
					optimizedCount++;
				}
			}
		} catch {
			// Directory might not exist
		}
	}

	await countFiles(contentDir);

	console.log(`📈 Total optimized thumbnails: ${optimizedCount} WebP files`);
}

/**
 * Main function
 */
async function main() {
	console.log('🚀 Starting image optimization...');
	console.log(`📁 Content directory: ${contentDir}`);

	const startTime = Date.now();

	try {
		// Process project thumbnails for AkProjectCard
		await processProjectThumbnails();

		// Process gallery thumbnails
		await processGalleryThumbnails();

		// Display statistics
		await showStats();

		const endTime = Date.now();
		const duration = ((endTime - startTime) / 1000).toFixed(2);

		console.log(`✅ Image optimization completed in ${duration}s`);
	} catch (error) {
		console.error('❌ Error during image optimization:', error);
		process.exit(1);
	}
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
	main();
}

export { main as generateOptimizedImages };
