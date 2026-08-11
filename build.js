#!/usr/bin/env node

import dotenv from 'dotenv';
import { spawn } from 'child_process';

// Load environment variables from .env file
dotenv.config();

console.log('🏗️  Building microfolio...');

// Run vite build
const vite = spawn('npx', ['vite', 'build'], {
	stdio: 'inherit',
	env: process.env
});

vite.on('close', (code) => {
	if (code === 0) {
		console.log('✅ Build completed successfully!');
		console.log(
			'💡 Tip: Run `pnpm run optimize-images` before build to generate optimized thumbnails'
		);
	} else {
		console.error('❌ Build failed with code:', code);
	}
	process.exit(code);
});
