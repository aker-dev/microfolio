<script>
	import { page } from '$app/stores';
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

	// Log page changes
	$effect(() => {
		console.log('Current page:', currentPage);
	});
</script>

<header class="sticky top-0 z-100 mb-8 bg-neutral-100">
	<div
		class="mr-auto ml-auto flex h-32 max-w-7xl items-end justify-between border-b border-solid border-black pr-4 pl-4 md:h-32"
	>
		<section class="h-15 flex-1">
			<a href="/">
				<h1 class="text-xl font-medium md:text-2xl">{siteConfig.title}</h1>
				<h2 class="text-xs md:text-sm">{siteConfig.description}</h2>
			</a>
		</section>

		<!-- Desktop Navigation -->
		<nav class="hidden md:block">
			<ul class="flex h-8 gap-4">
				{#each siteConfig.navigation as item}
					<li
						class="px-2 hover:border-black hover:font-medium {currentPage === item.href ||
						currentPage === item.href + '/+page' ||
						currentPage.startsWith(item.href + '/')
							? 'border-b-2 border-black font-medium'
							: ''}"
					>
						<a href={item.href}>{item.name}</a>
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
			<Icon icon="heroicons:bars-3" class="h-6 w-6" />
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
								href={item.href}
								class="block px-2 py-2 text-lg hover:font-medium hover:underline {currentPage ===
									item.href ||
								currentPage === item.href + '/+page' ||
								currentPage.startsWith(item.href + '/')
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
