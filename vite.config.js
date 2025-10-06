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
	server: {
		fs: {
			allow: ['..']
		}
	}
}));
