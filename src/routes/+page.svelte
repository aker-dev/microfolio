<script>
	import AkProjectCard from '$lib/components/AkProjectCard.svelte';
	import { siteConfig } from '$lib/config.js';
	import { _ } from 'svelte-i18n';
	let { data } = $props();
	let page = $derived(data.page);
	let featuredProjects = $derived(data.featuredProjects);
</script>

<svelte:head>
	<title>{siteConfig.title} • {page.title}</title>
	<meta name="description" content={page.description} />
</svelte:head>

<header class="mb-8">
	<h1 class="text-primary mb-2 text-3xl font-bold">
		{page.title}
	</h1>
	{#if page.description}
		<p class="text-lg">
			{page.description}
		</p>
	{/if}
</header>

<article class="prose prose-neutral text-primary">
	{@html page.content}
</article>
<!-- Featured Projects Section -->
{#if featuredProjects && featuredProjects.length > 0}
	<div class="mt-8">
		<!-- Header -->
		<h2 class="mb-6 text-2xl font-bold">{$_('ui.featured_projects')}</h2>

		<!-- Mosaic Grid -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
			{#each featuredProjects as project}
				<AkProjectCard {project} />
			{/each}
		</div>
	</div>
{/if}
