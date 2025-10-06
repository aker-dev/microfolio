<script>
	import { TableHandler } from '@vincjo/datatables';
	import RowsPerPage from '$lib/components/RowsPerPage.svelte';
	import RowCount from '$lib/components/RowCount.svelte';
	import { _ } from 'svelte-i18n';
	import { untrack } from 'svelte';

	let {
		projects,
		searchTerm = $bindable(''),
		selectedType = $bindable('all'),
		showRowsPerPage = false,
		showResultsCount = true,
		filteredProjects = $bindable([]),
		handler = $bindable(),
		rowsPerPage = projects.length
	} = $props();

	let search = $state();
	let typeFilter = $state();
	let isInitialized = $state(false);

	let projectTypes = $derived(['all', ...new Set(projects.map((p) => p.type))]);

	// Initialize handler when projects are available (only once)
	$effect(() => {
		if (projects && projects.length > 0 && !isInitialized) {
			handler = new TableHandler(projects, { rowsPerPage });
			search = handler.createSearch();
			typeFilter = handler.createFilter('type');
			isInitialized = true;
		}
	});

	// Sync searchTerm with handler search
	function handleSearchInput() {
		if (search) {
			search.value = searchTerm;
			search.set();
		}
	}

	// Handle type filter change
	function handleTypeChange(type) {
		selectedType = type;
		if (typeFilter) {
			if (type === 'all') {
				typeFilter.value = '';
			} else {
				typeFilter.value = type;
			}
			typeFilter.set();
		}
	}

	// Update filteredProjects from handler (read-only effect)
	$effect(() => {
		if (handler && handler.rows) {
			untrack(() => {
				filteredProjects = handler.rows;
			});
		}
	});
</script>

<div class="space-y-4">
	<!-- Search and Type Filters -->
	<div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
		<input
			type="text"
			placeholder={$_('ui.search_projects_placeholder')}
			bind:value={searchTerm}
			oninput={handleSearchInput}
			class="border-primary focus:bg-box rounded-lg border px-4 py-2 focus:outline-none"
		/>
		<div class="flex flex-wrap gap-2">
			{#each projectTypes as type}
				<button
					onclick={() => handleTypeChange(type)}
					class="rounded-full border px-3 py-1 text-sm capitalize {selectedType === type
						? 'border-primary bg-primary text-box'
						: 'border-primary bg-box text-primary hover:bg-primary hover:text-box cursor-pointer'}"
				>
					{type === 'all' ? $_('ui.all') : type}
				</button>
			{/each}
		</div>
	</div>

	<!-- RowsPerPage and Count -->
	{#if handler && (showRowsPerPage || showResultsCount)}
		<div class="flex items-center gap-4">
			{#if showRowsPerPage}
				<RowsPerPage {handler} />
			{/if}
			{#if showResultsCount}
				<RowCount {handler} />
			{/if}
		</div>
	{/if}
</div>
