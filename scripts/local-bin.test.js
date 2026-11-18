import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { localBin, localBinCommand } from './local-bin.js';

describe('localBin', () => {
	it("resolves vite's own script, which its exports map does not publish", () => {
		const bin = localBin('vite', 'vite');
		expect(bin).toMatch(/vite\.js$/);
		expect(existsSync(bin)).toBe(true);
	});

	it('names the package when it declares no such binary', () => {
		expect(() => localBin('vite', 'nope')).toThrow(/vite declares no nope binary/);
	});
});

describe('localBinCommand', () => {
	it('runs the script with this Node, both paths quoted, never through pnpm', () => {
		const command = localBinCommand('vite', 'vite', ['preview', '--port', 2001]);
		expect(command).toBe(`"${process.execPath}" "${localBin('vite', 'vite')}" preview --port 2001`);
	});
});
