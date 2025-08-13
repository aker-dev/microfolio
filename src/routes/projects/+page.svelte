<script>
	import AkBadge from '$lib/components/AkBadge.svelte';
	import AkProjectCard from '$lib/components/AkProjectCard.svelte';
	import AkFilters from '$lib/components/AkFilters.svelte';
	
	let { data } = $props();
	let projects = $derived(data.projects);

	let selectedType = $state('all');
	let searchTerm = $state('');
	let filteredProjects = $state([]);
</script>

<svelte:head>
	<title>Projects</title>
	<meta name="description" content="Projects list" />
</svelte:head>

<div class="space-y-8">
	<!-- Header -->
	<h2 class="text-4xl font-bold">Projects</h2>

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
