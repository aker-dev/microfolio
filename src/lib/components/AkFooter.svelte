<script>
	import Icon from '@iconify/svelte';
	import { siteConfig } from '../config.js';
</script>

<footer>
	<div
		class="mr-auto ml-auto flex h-auto max-w-7xl flex-col items-center justify-between gap-4 border-t-2 border-solid border-black py-4 pr-4 pl-4 md:h-12 md:flex-row md:gap-0 md:py-0"
	>
		<p class="text-center text-sm md:text-left">
			© {siteConfig.author}
			{new Date().getFullYear()} — generated with
			<a
				href="https://github.com/aker-dev/microfolio"
				target="_blank"
				class="font-medium hover:underline">microfolio</a
			>
		</p>
		<nav>
			<ul class="flex justify-center gap-4 md:justify-end">
				<li>
					<a href={siteConfig.socialLinks.instagram} target="_blank" aria-label="Instagram">
						<Icon icon="akar-icons:instagram-fill" class="h-5 w-5" />
					</a>
				</li>
				<li>
					<a href={siteConfig.socialLinks.linkedin} target="_blank" aria-label="LinkedIn">
						<Icon icon="akar-icons:linkedin-fill" class="h-5 w-5" />
					</a>
				</li>
				<li>
					<a href={siteConfig.socialLinks.github} target="_blank" aria-label="GitHub">
						<Icon icon="akar-icons:github-fill" class="h-5 w-5" />
					</a>
				</li>
			</ul>
		</nav>
	</div>
</footer>
