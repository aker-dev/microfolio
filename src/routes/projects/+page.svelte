<script>
	import AkBadge from '$lib/components/AkBadge.svelte';
	import AkProjectCard from '$lib/components/AkProjectCard.svelte';
	let { data } = $props();
	let projects = $derived(data.projects);

	// Filter state
	let selectedType = $state('all');
	let searchTerm = $state('');

	// Get unique project types
	let projectTypes = $derived(['all', ...new Set(projects.map((p) => p.type))]);

	// Filtered projects
	let filteredProjects = $derived(
		projects.filter((project) => {
			const matchesType = selectedType === 'all' || project.type === selectedType;
			const matchesSearch =
				searchTerm === '' ||
				project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
				project.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
			return matchesType && matchesSearch;
		})
	);
</script>

<div class="space-y-8">
	<div class="flex flex-col space-y-4">
		<h1 class="text-4xl font-bold">Projects</h1>
		<p class="text-lg">Explore our collection of creative works</p>

		<!-- Filters -->
		<div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
			<div class="flex flex-wrap gap-2">
				{#each projectTypes as type}
					<button
						onclick={() => (selectedType = type)}
						class="rounded-full border px-3 py-1 text-sm capitalize {selectedType === type
							? 'border-black bg-black text-white'
							: 'cursor-pointer border-black bg-white text-black hover:bg-black hover:text-white'}"
					>
						{type}
					</button>
				{/each}
			</div>

			<input
				type="text"
				placeholder="Search projects..."
				bind:value={searchTerm}
				class="rounded-lg border border-black px-4 py-2 focus:bg-white focus:outline-none"
			/>
		</div>

		<!-- Results count -->
		<p class="text-sm">
			{filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
		</p>
	</div>

	<!-- Mosaic Grid -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
