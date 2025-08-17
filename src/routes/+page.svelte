<script>
	import AkProjectCard from '$lib/components/AkProjectCard.svelte';
	let { data } = $props();
	let page = $derived(data.page);
	let featuredProjects = $derived(data.featuredProjects);
</script>

<svelte:head>
	<title>{page.title}</title>
	<meta name="description" content={page.description} />
</svelte:head>

<header class="mb-8">
	<h2 class="mb-4 text-4xl font-bold text-primary">
		{page.title}
	</h2>
	{#if page.description}
		<p class="text-xl">
			{page.description}
		</p>
	{/if}
</header>

<article class="prose prose-neutral max-w-none bg-box p-6 text-primary">
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
