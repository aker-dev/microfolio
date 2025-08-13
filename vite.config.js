import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
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
	],
	server: {
		fs: {
			allow: ['..']
		}
	}
});
