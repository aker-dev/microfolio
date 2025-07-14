<script>
	import { page } from '$app/stores';
	import { siteConfig } from '../config.js';

	// Current page URL - reactive to page changes
	let currentPage = $derived($page.url.pathname);

	// Log page changes
	$effect(() => {
		console.log('Current page:', currentPage);
	});
</script>

<header class="sticky top-0 z-100 mb-8 bg-neutral-100">
	<div
		class="mr-auto ml-auto flex h-32 max-w-7xl items-end justify-between border-b border-solid border-black pr-4 pl-4"
	>
		<section class="h-15">
			<a href="/">
				<h1 class="text-2xl font-medium">{siteConfig.title}</h1>
				<h2 class="text-sm">{siteConfig.description}</h2>
			</a>
		</section>
		<nav>
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
	</div>
</header>
