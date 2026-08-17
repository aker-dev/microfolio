#!/usr/bin/env node

import dotenv from 'dotenv';
import { spawn } from 'child_process';
import { siteConfig } from './src/lib/config.js';

// Load environment variables from .env file
dotenv.config();

/** Runs a command to completion, resolving with its exit code. */
function run(command, args) {
	return new Promise((resolve) => {
		spawn(command, args, { stdio: 'inherit', env: process.env }).on('close', resolve);
	});
}

console.log('🏗️  Building microfolio...');

// Before the build, not after: this used to be a printed suggestion that arrived
// once the site was already written, and nothing applied it — which is how the
// published demo came to serve every thumbnail at full size. The script is
// incremental, so it skips whatever is already up to date.
if (siteConfig.images?.optimizeOnBuild !== false) {
	const code = await run('node', ['scripts/generate-optimized-images.js']);
	if (code !== 0) {
		console.error('❌ Image optimization failed with code:', code);
		process.exit(code);
	}
}

const code = await run('npx', ['vite', 'build']);

if (code === 0) {
	console.log('✅ Build completed successfully!');
} else {
	console.error('❌ Build failed with code:', code);
}
process.exit(code);
