<script>
	import { TableHandler } from '@vincjo/datatables';
	import RowsPerPage from '$lib/components/RowsPerPage.svelte';
	import RowCount from '$lib/components/RowCount.svelte';
	import IconChevronUp from '~icons/carbon/chevron-up';
	import IconChevronDown from '~icons/carbon/chevron-down';
	import { _ } from 'svelte-i18n';
	import { untrack } from 'svelte';

	let {
		projects,
		searchTerm = $bindable(''),
		selectedType = $bindable('all'),
		showRowsPerPage = false,
		showResultsCount = true,
		showSort = false,
		filteredProjects = $bindable([]),
		handler = $bindable(),
		rowsPerPage = projects.length,
		sortBy = $bindable('date'),
		sortOrder = $bindable('desc')
	} = $props();

	let search = $state();
	let typeFilter = $state();
	let featuredFilter = $state();
	let sort = $state();
	let isInitialized = $state(false);

	let projectTypes = $derived(['all', 'featured', ...new Set(projects.map((p) => p.type))]);

	// Initialize handler when projects are available (only once)
	$effect(() => {
		if (projects && projects.length > 0 && !isInitialized) {
			handler = new TableHandler(projects, { rowsPerPage });
			search = handler.createSearch();
			typeFilter = handler.createFilter('type');
			featuredFilter = handler.createFilter('featured', (value) => value === true);
			sort = handler.createSort('date');
			// Set initial sort (date descending by default)
			sort.set(); // First click sets ascending
			sort.set(); // Second click sets descending
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

		// Handle featured filter
		if (type === 'featured') {
			if (featuredFilter) {
				featuredFilter.value = true;
				featuredFilter.set();
			}
			// Clear type filter
			if (typeFilter) {
				typeFilter.value = '';
				typeFilter.set();
			}
		} else {
			// Clear featured filter
			if (featuredFilter) {
				featuredFilter.value = '';
				featuredFilter.set();
			}
			// Apply type filter
			if (typeFilter) {
				if (type === 'all') {
					typeFilter.value = '';
				} else {
					typeFilter.value = type;
				}
				typeFilter.set();
			}
		}
	}

	// Handle sort change
	function handleSortChange(e) {
		const newSortBy = e.target.value;
		sortBy = newSortBy;
		// Create new sort instance for the new field
		if (handler) {
			sort = handler.createSort(sortBy);
			// Apply current sort order
			if (sortOrder === 'desc') {
				sort.set(); // asc
				sort.set(); // desc
			} else {
				sort.set(); // asc
			}
		}
	}

	// Toggle sort order
	function toggleSortOrder() {
		sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		if (sort) {
			sort.set();
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
					{#if type === 'all'}
						{$_('ui.all')}
					{:else if type === 'featured'}
						{$_('ui.featured')}
					{:else}
						{type}
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<!-- RowsPerPage, Sort, and Count -->
	{#if handler && (showRowsPerPage || showSort || showResultsCount)}
		<div class="flex flex-wrap items-center gap-4">
			{#if showRowsPerPage}
				<RowsPerPage {handler} />
			{/if}
			{#if showSort}
				<div class="flex items-center gap-2">
					<span class="text-sm">{$_('ui.sort.sort_by')}</span>
					<select
						bind:value={sortBy}
						onchange={handleSortChange}
						class="border-primary bg-box rounded border px-2 py-1 text-sm focus:outline-none"
					>
						<option value="date">{$_('ui.sort.date')}</option>
						<option value="title">{$_('ui.sort.title')}</option>
						<option value="type">{$_('ui.sort.type')}</option>
						<option value="location">{$_('ui.sort.location')}</option>
					</select>
					<button
						onclick={toggleSortOrder}
						class="border-primary bg-box text-primary hover:bg-primary hover:text-box cursor-pointer rounded-full border p-2 transition-colors"
						aria-label={$_('ui.sort.toggle_order')}
						title={sortOrder === 'asc' ? $_('ui.sort.ascending') : $_('ui.sort.descending')}
					>
						{#if sortOrder === 'asc'}
							<IconChevronUp class="pointer-events-none size-4" />
						{:else}
							<IconChevronDown class="pointer-events-none size-4" />
						{/if}
					</button>
				</div>
			{/if}
			{#if showResultsCount}
				<RowCount {handler} />
			{/if}
		</div>
	{/if}
</div>
