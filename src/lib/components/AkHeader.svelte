<script>
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { siteConfig } from '../config.js';
	import Icon from '@iconify/svelte';

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

<header class="sticky top-0 z-5000 mb-8 bg-neutral-100">
	<div
		class="mr-auto ml-auto flex h-32 max-w-7xl items-end justify-between border-b border-solid border-black pr-4 pl-4 md:h-32"
	>
		<section class="h-15 flex-1">
			<a href="{base}/">
				<h1 class="text-2xl font-medium">{siteConfig.title}</h1>
				<h2 class="text-sm">{siteConfig.description}</h2>
			</a>
		</section>

		<!-- Desktop Navigation -->
		<nav class="hidden md:block">
			<ul class="flex h-8 gap-4">
				{#each siteConfig.navigation as item}
					<li
						class="px-2 hover:border-black hover:font-medium {currentPage === base + item.href ||
						currentPage === base + item.href + '/+page' ||
						currentPage.startsWith(base + item.href + '/')
							? 'border-b-2 border-black font-medium'
							: ''}"
					>
						<a href="{base}{item.href}">{item.name}</a>
					</li>
				{/each}
			</ul>
		</nav>

		<!-- Mobile Menu Button -->
		<button
			class="h-15 cursor-pointer p-2 md:hidden"
			onclick={toggleMobileMenu}
			aria-label="Toggle mobile menu"
		>
			<Icon icon={mobileMenuOpen ? 'carbon:close-large' : 'carbon:menu'} class="h-6 w-6" />
		</button>
	</div>

	<!-- Mobile Menu -->
	{#if mobileMenuOpen}
		<div class="border-t border-solid border-black bg-white md:hidden">
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
								{item.name}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		</div>
	{/if}
</header>
