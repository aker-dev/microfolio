import prettier from 'eslint-config-prettier';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import svelteConfig from './svelte.config.js';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

/** @type {import('eslint').Linter.Config[]} */
export default [
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		},
		rules: {
			// Components destructure props such as `handler` purely to keep them out
			// of the `...props` they spread onto an element.
			'no-unused-vars': ['error', { ignoreRestSiblings: true }]
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.js'],
		languageOptions: { parserOptions: { svelteConfig } },
		rules: {
			// Navigation is driven by siteConfig.navigation, whose entries are plain
			// strings rather than route IDs, so internal links are built from `base`
			// instead of resolve(). External links come from siteConfig.socialLinks.
			'svelte/no-navigation-without-resolve': 'off'
		}
	}
];
