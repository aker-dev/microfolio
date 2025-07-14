<script>
	import Icon from '@iconify/svelte';
	import { siteConfig } from '../config.js';
</script>

<footer>
	<div
		class="mr-auto ml-auto flex h-12 max-w-7xl items-center justify-between border-t-2 border-solid border-black pr-4 pl-4"
	>
		<p>
			© {siteConfig.author}
			{new Date().getFullYear()} — generated with
			<a
				href="https://github.com/aker-dev/microfolio"
				target="_blank"
				class="font-medium hover:underline">microfolio</a
			>
		</p>
		<nav>
			<ul class="flex justify-end gap-4">
				<li>
					<a href={siteConfig.socialLinks.instagram} target="_blank"
						><Icon icon="akar-icons:instagram-fill" /></a
					>
				</li>
				<li>
					<a href={siteConfig.socialLinks.linkedin} target="_blank"
						><Icon icon="akar-icons:linkedin-fill" /></a
					>
				</li>
				<li>
					<a href={siteConfig.socialLinks.github} target="_blank"
						><Icon icon="akar-icons:github-fill" /></a
					>
				</li>
			</ul>
		</nav>
	</div>
</footer>
