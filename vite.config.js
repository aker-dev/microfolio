import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ mode }) => ({
	plugins: [
		tailwindcss(),
		sveltekit(),
		// Only run vite-plugin-static-copy during build, not in dev mode
		// This prevents file locking issues on Windows
		...(mode !== 'development'
			? [
					// No CNAME here any more: published through an Actions workflow, as
					// this project is, GitHub Pages ignores any CNAME file in the build.
					// A custom domain is set in the repository settings and at the
					// registrar, and named once in siteConfig.url for the site's own use.
					viteStaticCopy({
						targets: [
							{
								src: 'content',
								dest: '.',
								ignore: ['**/.DS_Store']
							}
						]
					})
				]
			: [])
	],
	// Interstella 5555 for the dev server, Discovery for the preview: the film is
	// that album set to pictures, the same work in two forms, which is roughly
	// what these two servers are. Left without `strictPort`, so a busy port sends
	// Vite to the next one and it prints where it actually landed — the numbers
	// the documentation quotes are the intent, not a guarantee.
	server: {
		port: 5555,
		fs: {
			allow: ['..']
		}
	},
	preview: {
		port: 2001
	}
}));
