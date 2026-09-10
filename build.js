#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { siteConfig } from './src/lib/config.js';

const require = createRequire(import.meta.url);

// `pnpm deploy` used to be `NODE_ENV=production pnpm run build`, a prefix no
// Windows shell understands. Setting it here means one command works everywhere.
// vite build forces production on its own before it loads svelte.config.js; this
// is what makes getBasePath() agree with it in the image step above too.
if (process.argv.includes('--production')) {
	process.env.NODE_ENV = 'production';
}

// Everything is launched as `node <script>`, never through a shim. npx is
// npx.cmd on Windows and Node refuses to spawn a .cmd without a shell — which
// is how `pnpm build` there died on `spawn npx ENOENT`. `pnpm exec` rescues
// nothing: pnpm is a .cmd too. process.execPath is the Node already running.
function run(args) {
	return new Promise((resolve) => {
		const child = spawn(process.execPath, args, { stdio: 'inherit' });
		// Without this listener a failure to launch is an unhandled 'error' event,
		// which throws a raw stack trace — and 'close' never fires at all, so the
		// promise would hang rather than report. That was the Windows symptom.
		child.on('error', (error) => {
			console.error('❌ Could not launch', args[0], '—', error.message);
			resolve(1);
		});
		child.on('close', (code) => resolve(code ?? 1));
	});
}

/** Absolute path to a dependency's own executable .js, resolved through its package.json. */
function localBin(pkg, binName) {
	// package.json rather than the bin path directly: vite's `exports` map
	// publishes ./package.json but not ./bin/*, so resolving the bin throws
	// ERR_PACKAGE_PATH_NOT_EXPORTED.
	const pkgJsonPath = require.resolve(`${pkg}/package.json`);
	const { bin } = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
	const relative = typeof bin === 'string' ? bin : bin?.[binName];
	if (!relative) {
		throw new Error(`${pkg} declares no ${binName} binary — is it installed?`);
	}
	return join(dirname(pkgJsonPath), relative);
}

console.log('🏗️  Building microfolio...');

// Before the build, not after: this used to be a printed suggestion that arrived
// once the site was already written, and nothing applied it — which is how the
// published demo came to serve every thumbnail at full size. The script is
// incremental, so it skips whatever is already up to date.
if (siteConfig.images?.optimizeOnBuild !== false) {
	// Resolved against this file, not the working directory: the build no longer
	// depends on being started from the project root.
	const script = fileURLToPath(new URL('./scripts/generate-optimized-images.js', import.meta.url));
	const code = await run([script]);
	if (code !== 0) {
		console.error('❌ Image optimization failed with code:', code);
		process.exit(code);
	}
}

const code = await run([localBin('vite', 'vite'), 'build']);

if (code === 0) {
	console.log('✅ Build completed successfully!');
} else {
	console.error('❌ Build failed with code:', code);
}
process.exit(code ?? 1);
