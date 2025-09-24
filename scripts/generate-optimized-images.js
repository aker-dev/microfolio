#!/usr/bin/env node

import sharp from 'sharp';
import { readdir, access, mkdir, stat } from 'fs/promises';
import { join, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const contentDir = join(projectRoot, 'content/projects');

// Size configuration
const THUMBNAIL_SIZE = { width: 300, height: 400 };
const GALLERY_THUMBNAIL_SIZE = { width: 300, height: 300 };

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
 * Create a directory if it doesn't exist
 */
async function ensureDir(dirPath) {
	try {
		await mkdir(dirPath, { recursive: true });
	} catch (error) {
		if (error.code !== 'EEXIST') {
			throw error;
		}
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
 * Generate an optimized AVIF image
 */
async function generateAVIF(inputPath, outputPath, size, quality = 80) {
	try {
		await sharp(inputPath)
			.resize(size.width, size.height, {
				fit: 'cover',
				position: 'center'
			})
			.avif({
				quality,
				effort: 6, // Maximum compression
				chromaSubsampling: '4:2:0'
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
 * Generate a WebP fallback image
 */
async function generateWebP(inputPath, outputPath, size, quality = 85) {
	try {
		await sharp(inputPath)
			.resize(size.width, size.height, {
				fit: 'cover',
				position: 'center'
			})
			.webp({
				quality,
				effort: 6
			})
			.toFile(outputPath);

		console.log(`✅ Generated WebP: ${outputPath}`);
		return true;
	} catch (error) {
		console.error(`❌ Error generating WebP ${outputPath}:`, error.message);
		return false;
	}
}

/**
 * Process main project thumbnails
 */
async function processProjectThumbnails() {
	console.log('🎯 Processing project thumbnails...');

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

		// Output paths in /content
		const avifPath = join(projectPath, 'thumbnail.avif');
		const webpPath = join(projectPath, 'thumbnail.webp');

		// Check if we need to regenerate
		const needsAvif = await needsRegeneration(thumbnailPath, avifPath);
		const needsWebp = await needsRegeneration(thumbnailPath, webpPath);

		if (!needsAvif && !needsWebp) {
			skipped++;
			continue;
		}

		console.log(`📸 Processing thumbnail for: ${projectName}`);

		// Generate AVIF
		if (needsAvif) {
			await generateAVIF(thumbnailPath, avifPath, THUMBNAIL_SIZE, 75);
		}

		// Generate WebP
		if (needsWebp) {
			await generateWebP(thumbnailPath, webpPath, THUMBNAIL_SIZE, 80);
		}

		processed++;
	}

	console.log(`✨ Processed ${processed} project thumbnails, skipped ${skipped}`);
}

/**
 * Process project gallery images
 */
async function processGalleryImages() {
	console.log('🖼️  Processing gallery images...');

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

		// Direct generation in /content/images

		// List images
		const images = await readdir(imagesPath);

		for (const imageName of images) {
			const imagePath = join(imagesPath, imageName);
			const ext = extname(imageName).toLowerCase();

			// Process only images
			if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
				continue;
			}

			const baseName = basename(imageName, ext);
			const avifPath = join(imagesPath, `${baseName}_thumb.avif`);
			const webpPath = join(imagesPath, `${baseName}_thumb.webp`);

			// Check if we need to regenerate
			const needsAvif = await needsRegeneration(imagePath, avifPath);
			const needsWebp = await needsRegeneration(imagePath, webpPath);

			if (!needsAvif && !needsWebp) {
				skipped++;
				continue;
			}

			console.log(`📷 Processing gallery image: ${projectName}/${imageName}`);

			// Generate AVIF
			if (needsAvif) {
				await generateAVIF(imagePath, avifPath, GALLERY_THUMBNAIL_SIZE, 70);
			}

			// Generate WebP
			if (needsWebp) {
				await generateWebP(imagePath, webpPath, GALLERY_THUMBNAIL_SIZE, 75);
			}

			processed++;
		}
	}

	console.log(`✨ Processed ${processed} gallery images, skipped ${skipped}`);
}

/**
 * Display final statistics
 */
async function showStats() {
	console.log('📊 Final statistics:');

	// Count generated files
	let avifCount = 0;
	let webpCount = 0;

	async function countFiles(dir) {
		try {
			const entries = await readdir(dir, { withFileTypes: true });

			for (const entry of entries) {
				if (entry.isDirectory()) {
					await countFiles(join(dir, entry.name));
				} else if (entry.name.endsWith('.avif')) {
					avifCount++;
				} else if (entry.name.endsWith('.webp')) {
					webpCount++;
				}
			}
		} catch (error) {
			// Directory might not exist
		}
	}

	await countFiles(contentDir);

	console.log(`📈 Total AVIF files: ${avifCount}`);
	console.log(`📈 Total WebP files: ${webpCount}`);
}

/**
 * Main function
 */
async function main() {
	console.log('🚀 Starting image optimization...');
	console.log(`📁 Content directory: ${contentDir}`);

	const startTime = Date.now();

	try {
		// Create build folder if it doesn't exist
		// Images are generated in /content, no need to create buildDir

		// Process project thumbnails
		await processProjectThumbnails();

		// Process gallery images
		await processGalleryImages();

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
