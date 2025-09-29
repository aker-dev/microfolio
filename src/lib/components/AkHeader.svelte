<script>
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { siteConfig } from '$lib/config.js';
	import { _ } from 'svelte-i18n';
	import IconMenu from '~icons/carbon/menu';
	import IconCloseLarge from '~icons/carbon/close-large';

	// Current page URL - reactive to page changes
	let currentPage = $derived($page.url.pathname);

	// Mobile menu state
	let mobileMenuOpen = $state(false);

	// Toggle mobile menu
	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	// Close mobile menu when clicking outside or on link
	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	// Close mobile menu when clicking outside
	$effect(() => {
		if (mobileMenuOpen) {
			const handleClickOutside = (event) => {
				const header = event.target.closest('header');
				if (!header) {
					mobileMenuOpen = false;
				}
			};

			document.addEventListener('click', handleClickOutside);

			return () => {
				document.removeEventListener('click', handleClickOutside);
			};
		}
	});

	// Log page changes
	$effect(() => {
		console.log('Current page:', currentPage);
	});

</script>

<header class="bg-background sticky top-0 z-5000 mb-8">
	<div
		class="border-primary mx-auto flex h-32 max-w-7xl items-end justify-between border-b border-solid px-4 md:h-32"
	>
		<section class="h-15 flex-1">
			<a href="{base}/">
				<div class="text-2xl font-medium">{siteConfig.title}</div>
				<div class="text-sm">{siteConfig.description}</div>
			</a>
		</section>

		<!-- Desktop Navigation -->
		<nav class="hidden md:block">
			<ul class="flex h-8 gap-4">
				{#each siteConfig.navigation as item}
					<li
						class="hover:border-primary px-2 hover:font-medium {currentPage === base + item.href ||
						currentPage === base + item.href + '/+page' ||
						currentPage.startsWith(base + item.href + '/')
							? 'border-primary border-b-2 font-medium'
							: ''}"
					>
						<a href="{base}{item.href}">{$_(item.name)}</a>
					</li>
				{/each}
			</ul>
		</nav>

		<!-- Mobile Menu Button -->
		<button
			class="bg-box text-primary border-primary z-100 mb-3 cursor-pointer rounded-full border-1 p-2 md:hidden"
			onclick={toggleMobileMenu}
			aria-label={$_('ui.toggle_mobile_menu')}
		>
			{#if mobileMenuOpen}
				<IconCloseLarge class="pointer-events-none size-6 hover:scale-110" />
			{:else}
				<IconMenu class="pointer-events-none size-6 hover:scale-110" />
			{/if}
		</button>
	</div>

	<!-- Mobile Menu -->
	{#if mobileMenuOpen}
		<div class="border-primary bg-box border-t border-solid md:hidden">
			<nav class="mx-auto max-w-7xl px-4 py-4">
				<ul class="flex flex-col gap-4">
					{#each siteConfig.navigation as item}
						<li>
							<a
								href="{base}{item.href}"
								class="block px-2 py-2 text-lg hover:font-medium hover:underline {currentPage ===
									base + item.href ||
								currentPage === base + item.href + '/+page' ||
								currentPage.startsWith(base + item.href + '/')
									? 'font-medium underline'
									: ''}"
								onclick={closeMobileMenu}
							>
								{$_(item.name)}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		</div>
	{/if}
</header>
