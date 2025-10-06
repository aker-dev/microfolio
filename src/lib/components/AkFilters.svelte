<script>
	import { _ } from 'svelte-i18n';
	let {
		projects,
		searchTerm = $bindable(''),
		selectedType = $bindable('all'),
		showResultsCount = true,
		filteredProjects = $bindable([])
	} = $props();

	let projectTypes = $derived(['all', ...new Set(projects.map((p) => p.type))]);

	$effect(() => {
		filteredProjects = projects
			.filter((project) => {
				const matchesType = selectedType === 'all' || project.type === selectedType;
				const matchesSearch =
					searchTerm === '' ||
					project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
					project.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
				return matchesType && matchesSearch;
			})
			.sort((a, b) => {
				// Sort by date only (newest first)
				return new Date(b.date) - new Date(a.date);
			});
	});
</script>

<div>
	<!-- Filters -->
	<div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
		<input
			type="text"
			placeholder={$_('ui.search_projects_placeholder')}
			bind:value={searchTerm}
			class="border-primary focus:bg-box rounded-lg border px-4 py-2 focus:outline-none"
		/>
		<div class="flex flex-wrap gap-2">
			{#each projectTypes as type}
				<button
					onclick={() => (selectedType = type)}
					class="rounded-full border px-3 py-1 text-sm capitalize {selectedType === type
						? 'border-primary bg-primary text-box'
						: 'border-primary bg-box text-primary hover:bg-primary hover:text-box cursor-pointer'}"
				>
					{type === 'all' ? $_('ui.all') : type}
				</button>
			{/each}
		</div>
	</div>

	<!-- Results count -->
	{#if showResultsCount}
		<p class="mt-2 text-sm">
			{filteredProjects.length} {filteredProjects.length === 1 ? $_('ui.project_singular') : $_('ui.project_plural')} {$_('ui.results_found')}
		</p>
	{/if}
</div>
