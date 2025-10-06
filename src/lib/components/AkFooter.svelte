<script>
	import IconInstagram from '~icons/akar-icons/instagram-fill';
	import IconLinkedin from '~icons/akar-icons/linkedin-fill';
	import IconGithub from '~icons/akar-icons/github-fill';
	import { siteConfig } from '$lib/config.js';
	import { _ } from 'svelte-i18n';
</script>

<footer>
	<div
		class="border-primary mx-auto flex h-auto max-w-7xl flex-col items-center justify-between gap-4 border-t-2 border-solid px-4 py-4 md:h-12 md:flex-row md:gap-0 md:py-0"
	>
		<p class="text-center text-sm md:text-start">
			© {siteConfig.author}
			{new Date().getFullYear()} — {$_('ui.generated_with')}
			<a
				href="https://github.com/aker-dev/microfolio"
				target="_blank"
				class="font-medium hover:underline">microfolio {siteConfig.version}</a
			>
		</p>
		<nav>
			<ul class="flex justify-center gap-4 md:justify-end">
				{#if siteConfig.socialLinks.instagram}
					<li>
						<a
							href={siteConfig.socialLinks.instagram}
							target="_blank"
							aria-label={$_('ui.social.instagram')}
						>
							<IconInstagram class="pointer-events-none h-5 w-5" />
						</a>
					</li>
				{/if}
				{#if siteConfig.socialLinks.linkedin}
					<li>
						<a
							href={siteConfig.socialLinks.linkedin}
							target="_blank"
							aria-label={$_('ui.social.linkedin')}
						>
							<IconLinkedin class="pointer-events-none h-5 w-5" />
						</a>
					</li>
				{/if}
				{#if siteConfig.socialLinks.github}
					<li>
						<a
							href={siteConfig.socialLinks.github}
							target="_blank"
							aria-label={$_('ui.social.github')}
						>
							<IconGithub class="pointer-events-none h-5 w-5" />
						</a>
					</li>
				{/if}
			</ul>
		</nav>
	</div>
</footer>
