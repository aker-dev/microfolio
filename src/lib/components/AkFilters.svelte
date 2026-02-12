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
		selectedTags = $bindable([]),
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
	let tagFilter = $state();
	let sort = $state();
	let isInitialized = $state(false);
	let isUrlInitialized = $state(false);

	let projectTypes = $derived(['all', 'featured', ...new Set(projects.map((p) => p.type))]);
	let typeFilteredProjects = $derived.by(() => {
		if (selectedType === 'all') return projects;
		if (selectedType === 'featured') return projects.filter((p) => p.featured);
		return projects.filter((p) => p.type === selectedType);
	});

	let allTags = $derived(
		[...new Set(typeFilteredProjects.flatMap((p) => p.tags || []))].sort()
	);

	function getAvailableTags(type) {
		let subset;
		if (type === 'all') subset = projects;
		else if (type === 'featured') subset = projects.filter((p) => p.featured);
		else subset = projects.filter((p) => p.type === type);
		return [...new Set(subset.flatMap((p) => p.tags || []))];
	}

	// Initialize handler when projects are available (only once)
	$effect(() => {
		if (projects && projects.length > 0 && !isInitialized) {
			handler = new TableHandler(projects, { rowsPerPage });
			search = handler.createSearch();
			typeFilter = handler.createFilter('type');
			featuredFilter = handler.createFilter('featured', (value) => value === true);
			tagFilter = handler.createFilter(
				(row) => row.tags,
				(entry, value) => {
					if (!entry || !Array.isArray(entry)) return false;
					const selected = JSON.parse(value);
					return selected.some((tag) => entry.includes(tag));
				}
			);

			// Read URL params to restore filter state
			const params =
				typeof window !== 'undefined'
					? new URLSearchParams(window.location.search)
					: new URLSearchParams();

			// Type
			const urlType = params.get('type');
			if (urlType && projectTypes.includes(urlType)) {
				handleTypeChange(urlType);
			}

			// Tags (comma-separated)
			const urlTags = params.get('tags');
			if (urlTags) {
				const available = getAvailableTags(selectedType);
				urlTags
					.split(',')
					.filter((t) => available.includes(t))
					.forEach((tag) => handleTagToggle(tag));
			}

			// Search
			const urlSearch = params.get('search');
			if (urlSearch) {
				searchTerm = urlSearch;
				handleSearchInput();
			}

			// Sort (with URL fallback to defaults: date/desc)
			const urlSort = params.get('sort') || 'date';
			const urlOrder = params.get('order') || 'desc';
			sortBy = urlSort;
			sortOrder = urlOrder;
			sort = handler.createSort(urlSort);
			if (urlOrder === 'desc') {
				sort.set(); // asc
				sort.set(); // desc
			} else {
				sort.set(); // asc
			}

			// Page
			const urlPage = params.get('page');
			if (urlPage) {
				const pageNum = Number(urlPage);
				if (pageNum > 1) handler.setPage(pageNum);
			}

			isInitialized = true;
			isUrlInitialized = true;
		}
	});

	// Sync filter state to URL query params
	$effect(() => {
		if (!isUrlInitialized || typeof window === 'undefined') return;

		const params = new URLSearchParams();
		if (searchTerm) params.set('search', searchTerm);
		if (selectedType !== 'all') params.set('type', selectedType);
		if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
		if (sortBy !== 'date') params.set('sort', sortBy);
		if (sortOrder !== 'desc') params.set('order', sortOrder);
		if (handler && handler.currentPage > 1) params.set('page', String(handler.currentPage));

		const query = params.toString();
		const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
		window.history.replaceState(null, '', newUrl);
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

		// Auto-clean tags that don't exist in the new category
		const available = getAvailableTags(type);
		const cleaned = selectedTags.filter((t) => available.includes(t));
		if (cleaned.length !== selectedTags.length) {
			selectedTags = cleaned;
			if (tagFilter) {
				tagFilter.value = selectedTags.length > 0 ? JSON.stringify(selectedTags) : '';
				tagFilter.set();
			}
		}
	}

	// Handle tag toggle
	function handleTagToggle(tag) {
		if (selectedTags.includes(tag)) {
			selectedTags = selectedTags.filter((t) => t !== tag);
		} else {
			selectedTags = [...selectedTags, tag];
		}
		if (tagFilter) {
			tagFilter.value = selectedTags.length > 0 ? JSON.stringify(selectedTags) : '';
			tagFilter.set();
		}
	}

	// Clear all selected tags
	function clearTags() {
		selectedTags = [];
		if (tagFilter) {
			tagFilter.value = '';
			tagFilter.set();
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
		<div class="relative">
			<input
				type="text"
				placeholder={$_('ui.search_projects_placeholder')}
				bind:value={searchTerm}
				oninput={handleSearchInput}
				class="border-primary focus:bg-box rounded-lg border px-4 py-2 pr-8 focus:outline-none {searchTerm ? 'bg-box' : ''}"
			/>
			{#if searchTerm}
				<button
					onclick={() => { searchTerm = ''; handleSearchInput(); }}
					class="text-primary hover:text-box hover:bg-primary absolute top-1/2 right-2 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full p-0.5 transition-colors"
					aria-label={$_('ui.clear_search')}
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
						<path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
					</svg>
				</button>
			{/if}
		</div>
		<div class="flex flex-wrap gap-2">
			{#each projectTypes as type}
				<button
					onclick={() => handleTypeChange(type)}
					class="cursor-pointer rounded-full border px-3 py-1 text-sm capitalize {selectedType === type
						? 'border-primary bg-primary text-box'
						: 'border-primary bg-box text-primary hover:bg-primary hover:text-box'}"
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
	<!-- Tag Filters -->
	{#if allTags.length > 0}
		<div class="flex flex-wrap items-center gap-2">
{#each allTags as tag}
				<button
					onclick={() => handleTagToggle(tag)}
					class="cursor-pointer rounded border px-2 py-1 text-xs {selectedTags.includes(tag)
						? 'border-primary bg-primary text-box'
						: 'border-primary bg-box text-primary hover:bg-primary hover:text-box'}"
				>
					{tag}
				</button>
			{/each}
			{#if selectedTags.length > 0}
				<button
					onclick={clearTags}
					class="border-primary bg-box text-primary hover:bg-primary hover:text-box cursor-pointer rounded border px-2 py-1 text-xs underline"
				>
					✕ {$_('ui.clear_tags').toLowerCase()}
				</button>
			{/if}
		</div>
	{/if}

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
						aria-label={$_('ui.sort.sort_by')}
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
