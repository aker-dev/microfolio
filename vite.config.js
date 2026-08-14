import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import Icons from 'unplugin-icons/vite';

export default defineConfig(({ mode }) => ({
	plugins: [
		tailwindcss(),
		sveltekit(),
		Icons({
			compiler: 'svelte'
		}),
		// Only run vite-plugin-static-copy during build, not in dev mode
		// This prevents file locking issues on Windows
		...(mode !== 'development'
			? [
					viteStaticCopy({
						targets: [
							{
								src: 'content',
								dest: '.',
								ignore: ['**/.DS_Store']
							},
							...(process.env.CUSTOM_DOMAIN
								? [
										{
											src: 'static/CNAME',
											dest: '.',
											ignore: ['**/.DS_Store']
										}
									]
								: [])
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
