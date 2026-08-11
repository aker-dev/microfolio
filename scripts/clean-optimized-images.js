#!/usr/bin/env node

import { rm, readdir, access, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const contentDir = join(projectRoot, 'content/projects');

/**
 * Check if a file or directory exists
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
 * Count and remove optimized files in a directory
 */
async function cleanOptimizedImagesInDirectory(dirPath) {
	let removedCount = 0;

	try {
		const entries = await readdir(dirPath, { withFileTypes: true });

		for (const entry of entries) {
			const fullPath = join(dirPath, entry.name);

			if (entry.isDirectory()) {
				// Recursively clean subdirectories
				removedCount += await cleanOptimizedImagesInDirectory(fullPath);
			} else if (entry.isFile()) {
				// Remove WebP files
				if (entry.name.endsWith('.webp')) {
					try {
						await rm(fullPath);
						console.log(`🗑️  Removed: ${fullPath}`);
						removedCount++;
					} catch (error) {
						console.error(`❌ Error removing ${fullPath}:`, error.message);
					}
				}
			}
		}
	} catch (error) {
		// Directory might not exist, that's ok
		if (error.code !== 'ENOENT') {
			console.error(`❌ Error reading directory ${dirPath}:`, error.message);
		}
	}

	return removedCount;
}

/**
 * Display statistics before cleanup
 */
async function showStats() {
	console.log('📊 Scanning optimized images...');

	let avifCount = 0;
	let webpCount = 0;
	let totalSize = 0;

	async function countFiles(dir) {
		try {
			const entries = await readdir(dir, { withFileTypes: true });

			for (const entry of entries) {
				const fullPath = join(dir, entry.name);

				if (entry.isDirectory()) {
					await countFiles(fullPath);
				} else if (entry.isFile()) {
					if (entry.name.endsWith('.avif') || entry.name.endsWith('_thumb.avif')) {
						avifCount++;
						try {
							const stats = await stat(fullPath);
							totalSize += stats.size;
						} catch {
							// Unreadable file: leave it out of the size total
						}
					} else if (entry.name.endsWith('.webp') || entry.name.endsWith('_thumb.webp')) {
						webpCount++;
						try {
							const stats = await stat(fullPath);
							totalSize += stats.size;
						} catch {
							// Unreadable file: leave it out of the size total
						}
					}
				}
			}
		} catch {
			// Directory might not exist
		}
	}

	await countFiles(contentDir);

	const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

	console.log(`📈 Found:`);
	console.log(`   • ${avifCount} AVIF files`);
	console.log(`   • ${webpCount} WebP files`);
	console.log(`   • Total size: ${totalSizeMB} MB`);
	console.log('');

	return avifCount + webpCount;
}

/**
 * Main function
 */
async function main() {
	console.log('🧹 Starting optimized images cleanup...');
	console.log(`📁 Content directory: ${contentDir}`);
	console.log('');

	const startTime = Date.now();

	// Display statistics before deletion
	const totalFiles = await showStats();

	if (totalFiles === 0) {
		console.log('✨ No optimized images found to clean.');
		return;
	}

	try {
		let removedCount = 0;

		// Check if content directory exists
		if (!(await fileExists(contentDir))) {
			console.log('📝 Content directory does not exist, nothing to clean.');
			return;
		}

		console.log('🗑️  Removing optimized images...');

		// Clean optimized images
		removedCount = await cleanOptimizedImagesInDirectory(contentDir);

		const endTime = Date.now();
		const duration = ((endTime - startTime) / 1000).toFixed(2);

		console.log('');
		console.log(`✅ Cleanup completed in ${duration}s`);
		console.log(`📊 Removed ${removedCount} optimized image files`);

		if (removedCount > 0) {
			console.log('');
			console.log('💡 Tips:');
			console.log('   • Run `pnpm run optimize-images` to regenerate optimized images');
			console.log('   • Use `pnpm run build:full` to build with fresh optimized images');
		}
	} catch (error) {
		console.error('❌ Error during cleanup:', error);
		process.exit(1);
	}
}

// Run script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
	main();
}

export { main as cleanOptimizedImages };
