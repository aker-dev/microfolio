<script>
	import AkBadge from '$lib/components/AkBadge.svelte';
	import AkProjectCard from '$lib/components/AkProjectCard.svelte';
	import AkFilters from '$lib/components/AkFilters.svelte';
	import { siteConfig } from '$lib/config.js';

	let { data } = $props();
	let projects = $derived(data.projects);

	let selectedType = $state('all');
	let searchTerm = $state('');
	let filteredProjects = $state(data.projects);
</script>

<svelte:head>
	<title>{siteConfig.title} • Projects</title>
	<meta name="description" content="Projects list" />
</svelte:head>

<div class="space-y-8">
	<!-- Header -->
	<header>
		<h1 class="text-primary mb-2 text-3xl font-bold">Projects</h1>
		<p class="text-lg">Explore our diverse range of projects.</p>
	</header>
	<AkFilters {projects} bind:searchTerm bind:selectedType bind:filteredProjects />

	<!-- Mosaic Grid -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
		{#each filteredProjects as project}
			<AkProjectCard {project} />
		{/each}
	</div>

	<!-- Empty state -->
	{#if filteredProjects.length === 0}
		<div class="py-12 text-center">
			<p class="">No projects found matching your criteria.</p>
		</div>
	{/if}
</div>
