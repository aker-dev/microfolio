<script>
	import { browser } from '$app/environment';
	import IconInstagram from '~icons/akar-icons/instagram-fill';
	import IconLinkedin from '~icons/akar-icons/linkedin-fill';
	import IconGithub from '~icons/akar-icons/github-fill';
	import IconSun from '~icons/carbon/sun';
	import IconMoon from '~icons/carbon/asleep';
	import { siteConfig } from '$lib/config.js';
	import { _ } from 'svelte-i18n';
	import { version } from '$lib/version.js';

	let isDark = $state(false);

	if (browser) {
		const stored = localStorage.getItem('theme');
		isDark = stored
			? stored === 'dark'
			: window.matchMedia('(prefers-color-scheme: dark)').matches;
	}

	function toggleTheme() {
		isDark = !isDark;
		document.documentElement.classList.remove('dark', 'light');
		document.documentElement.classList.add(isDark ? 'dark' : 'light');
		localStorage.setItem('theme', isDark ? 'dark' : 'light');
	}
</script>

<footer>
	<div
		class="border-primary mx-auto grid max-w-7xl grid-cols-1 items-center gap-4 border-t-2 border-solid px-4 py-4 md:grid-cols-3 md:py-3"
	>
		<div class="flex justify-center md:justify-start">
			<button
				onclick={toggleTheme}
				aria-label={$_('ui.toggle_theme')}
				class="border-primary bg-box text-primary hover:bg-primary hover:text-box cursor-pointer rounded-full border p-2 transition-colors"
			>
				{#if isDark}
					<IconSun class="size-4" />
				{:else}
					<IconMoon class="size-4" />
				{/if}
			</button>
		</div>

		<p class="text-center text-sm">
			© {siteConfig.author}
			{new Date().getFullYear()} — {$_('ui.generated_with')}
			<a
				href="https://github.com/aker-dev/microfolio"
				target="_blank"
				class="font-bold hover:underline">microfolio {version}</a
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
