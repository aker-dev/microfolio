<script>
	import AkProjectCard from '$lib/components/AkProjectCard.svelte';
	import { siteConfig } from '$lib/config.js';
	let { data } = $props();
	let page = $derived(data.page);
	let featuredProjects = $derived(data.featuredProjects);
</script>

<svelte:head>
	<title>{siteConfig.title} • {page.title}</title>
	<meta name="description" content={page.description} />
</svelte:head>

<header class="mb-8">
	<h2 class="text-primary mb-4 text-4xl font-bold">
		{page.title}
	</h2>
	{#if page.description}
		<p class="text-xl">
			{page.description}
		</p>
	{/if}
</header>

<article class="prose prose-neutral bg-box text-primary max-w-none p-6">
	{@html page.content}
</article>
<!-- Featured Projects Section -->
{#if featuredProjects && featuredProjects.length > 0}
	<div class="mt-8 mb-8 space-y-8">
		<!-- Header -->
		<h2 class="text-3xl font-bold">Featured Projects</h2>

		<!-- Mosaic Grid -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
			{#each featuredProjects as project}
				<AkProjectCard {project} />
			{/each}
		</div>
	</div>
{/if}
