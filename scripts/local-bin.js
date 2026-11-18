// A dependency's own executable, run by the Node already running — never
// through a shim or through pnpm.
//
// The shims fail on Windows: npx is npx.cmd there, and Node refuses to spawn a
// .cmd without a shell, which is how `pnpm build` died on `spawn npx ENOENT`.
// pnpm fails as a parent: pnpm 12 starts a script's process in a process group
// of its own when it has no terminal, so a test runner that stops its server by
// killing the group it spawned kills pnpm and leaves vite running — holding the
// pipe the runner waits on, which hung `pnpm test:smoke` for good after its
// tests had passed. pnpm 11 kept vite in the group.

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);

/** Absolute path to a dependency's own executable .js, resolved through its package.json. */
export function localBin(pkg, binName) {
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

/**
 * The same thing as one shell command line, for a runner that takes a string
 * (Playwright's webServer). Both paths are quoted: Node commonly lives under
 * `C:\Program Files`, and double quotes mean the same to sh and to cmd.exe.
 */
export function localBinCommand(pkg, binName, args) {
	return [process.execPath, localBin(pkg, binName)]
		.map((path) => `"${path}"`)
		.concat(args)
		.join(' ');
}
