<script>
	import { TableHandler } from '@vincjo/datatables';
	import RowsPerPage from '$lib/components/RowsPerPage.svelte';
	import RowCount from '$lib/components/RowCount.svelte';
	import IconChevronUp from '~icons/carbon/chevron-up';
	import IconChevronDown from '~icons/carbon/chevron-down';
	import IconFilter from '~icons/carbon/filter';
	import { _ } from 'svelte-i18n';
	import { onMount, untrack } from 'svelte';
	import { goto } from '$app/navigation';

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

	// Built here rather than inside an $effect: an effect never runs on the server,
	// so the table only came into existence at hydration and /list prerendered a
	// "Loading projects" placeholder instead of its rows.
	// Deliberately reads the initial values: the table is built once from the data
	// the page was loaded with, as it was before when an `isInitialized` flag
	// guarded the same construction.
	// svelte-ignore state_referenced_locally
	const table = new TableHandler(projects, { rowsPerPage });
	const search = table.createSearch();
	const typeFilter = table.createFilter('type');
	const featuredFilter = table.createFilter('featured', (value) => value === true);
	const tagFilter = table.createFilter(
		(row) => row.tags,
		(entry, value) => {
			if (!entry || !Array.isArray(entry)) return false;
			const selected = JSON.parse(value);
			return selected.some((tag) => entry.includes(tag));
		}
	);

	// Hand both to the parent straight away so its markup renders server-side too
	handler = table;
	filteredProjects = table.rows;

	let sort = $state();
	let isUrlInitialized = $state(false);

	// onMount does not run on the server, so this stays false through prerendering —
	// exactly the window where the controls exist but have no listeners yet, and a
	// click on them would be silently lost.
	let hydrated = $state(false);
	onMount(() => {
		hydrated = true;
	});

	let projectTypesWithCounts = $derived.by(() => {
		// Local accumulator, converted to an array before it leaves this block:
		// it never needs to be reactive on its own.
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const typeCounts = new Map();
		for (const p of projects) {
			typeCounts.set(p.type, (typeCounts.get(p.type) || 0) + 1);
		}
		const featuredCount = projects.filter((p) => p.featured).length;
		const dynamicTypes = [...typeCounts.entries()]
			.sort((a, b) => b[1] - a[1])
			.map(([type, count]) => ({ type, count }));
		return [
			{ type: 'all', count: projects.length },
			{ type: 'featured', count: featuredCount },
			...dynamicTypes
		];
	});
	let projectTypes = $derived(projectTypesWithCounts.map((t) => t.type));

	let typeFilteredProjects = $derived.by(() => {
		if (selectedType === 'all') return projects;
		if (selectedType === 'featured') return projects.filter((p) => p.featured);
		return projects.filter((p) => p.type === selectedType);
	});

	let allTagsWithCounts = $derived.by(() => {
		// Same as above: a throwaway tally, not reactive state.
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const tagCounts = new Map();
		for (const p of typeFilteredProjects) {
			for (const tag of p.tags || []) {
				tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
			}
		}
		return [...tagCounts.entries()]
			.sort((a, b) => b[1] - a[1])
			.map(([tag, count]) => ({ tag, count }));
	});
	let allTags = $derived(allTagsWithCounts.map((t) => t.tag));

	// Only consulted below md, where the panel is collapsed by default
	let filtersOpen = $state(false);
	let activeFilterCount = $derived(
		(searchTerm ? 1 : 0) + (selectedType !== 'all' ? 1 : 0) + selectedTags.length
	);

	let tagsExpanded = $state(false);
	const TAG_DISPLAY_LIMIT = 10;
	let visibleTagsWithCounts = $derived(
		tagsExpanded ? allTagsWithCounts : allTagsWithCounts.slice(0, TAG_DISPLAY_LIMIT)
	);
	let hiddenTagCount = $derived(Math.max(0, allTags.length - TAG_DISPLAY_LIMIT));

	function getAvailableTags(type) {
		let subset;
		if (type === 'all') subset = projects;
		else if (type === 'featured') subset = projects.filter((p) => p.featured);
		else subset = projects.filter((p) => p.type === type);
		return [...new Set(subset.flatMap((p) => p.tags || []))];
	}

	// Restoring state from the query string is the only part that has to wait for
	// the browser, so it is all that remains in an effect.
	$effect(() => {
		if (!isUrlInitialized) {
			const params = new URLSearchParams(window.location.search);

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

			// Rows per page
			const urlRows = params.get('rows');
			if (urlRows) {
				const rowsNum = Number(urlRows);
				if ([5, 10, 20, 50, 100].includes(rowsNum)) {
					handler.setRowsPerPage(rowsNum);
				}
			}

			// Page
			const urlPage = params.get('page');
			if (urlPage) {
				const pageNum = Number(urlPage);
				if (pageNum > 1) handler.setPage(pageNum);
			}

			isUrlInitialized = true;
		}
	});

	// Sync filter state to URL query params
	$effect(() => {
		if (!isUrlInitialized || typeof window === 'undefined') return;

		// Built, stringified and discarded within this effect.
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const params = new URLSearchParams();
		if (searchTerm) params.set('search', searchTerm);
		if (selectedType !== 'all') params.set('type', selectedType);
		if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
		if (sortBy !== 'date') params.set('sort', sortBy);
		if (sortOrder !== 'desc') params.set('order', sortOrder);
		if (handler && handler.rowsPerPage !== rowsPerPage)
			params.set('rows', String(handler.rowsPerPage));
		if (handler && handler.currentPage > 1) params.set('page', String(handler.currentPage));

		const query = params.toString();
		const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;

		// Nothing to write? Then don't call goto(). SvelteKit resets the scroll
		// position two ticks *after* a navigation lands, and a goto() issued in
		// between — even one that changes nothing — aborts that pending reset.
		// This effect's first run after arriving from the menu is exactly that
		// case, and it is why /projects, /list and /map used to open scrolled
		// wherever the previous page was.
		if (newUrl === window.location.pathname + window.location.search) return;

		// Not window.history.replaceState: passing null as its state argument wipes
		// the navigation index SvelteKit keeps in history.state, and its popstate
		// handler then ignores the event entirely — the browser's back button would
		// change the URL without ever re-rendering the page.
		//
		// goto() rather than replaceState() from $app/navigation, because the latter
		// records page.url in the history entry instead of the URL it is given, so
		// going back would land on the unfiltered list. keepFocus matters: without it
		// the search field loses focus on every keystroke.
		goto(newUrl, { replaceState: true, noScroll: true, keepFocus: true });
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

		tagsExpanded = false;
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

<div class="ak-filters space-y-4">
	<!-- On a phone this block ran to 440px and pushed the projects off the first
	     screen entirely, so below md it collapses behind a button that says how
	     many filters are active. From md it is always open. -->
	<button
		type="button"
		disabled={!hydrated}
		onclick={() => (filtersOpen = !filtersOpen)}
		aria-expanded={filtersOpen}
		aria-controls="filter-panel"
		class="border-primary bg-box text-primary hover:bg-primary hover:text-box flex cursor-pointer items-center gap-2 rounded border px-3 py-2 text-sm md:hidden"
	>
		<IconFilter class="pointer-events-none size-4" />
		{$_('ui.filters')}
		{#if activeFilterCount > 0}
			<span class="font-bold">({activeFilterCount})</span>
		{/if}
	</button>

	<div id="filter-panel" class="space-y-4 {filtersOpen ? '' : 'hidden'} md:block">
		<!-- Search and Type Filters -->
		<div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
			<div class="relative">
				<input
					type="text"
					disabled={!hydrated}
					placeholder={$_('ui.search_projects_placeholder')}
					bind:value={searchTerm}
					oninput={handleSearchInput}
					class="border-primary focus:bg-box rounded-lg border px-4 py-2 pr-8 {searchTerm
						? 'bg-box'
						: ''}"
				/>
				{#if searchTerm}
					<button
						disabled={!hydrated}
						onclick={() => {
							searchTerm = '';
							handleSearchInput();
						}}
						class="text-primary hover:text-box hover:bg-primary absolute top-1/2 right-2 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full p-0.5 transition-colors"
						aria-label={$_('ui.clear_search')}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="size-4"
						>
							<path
								d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
							/>
						</svg>
					</button>
				{/if}
			</div>
			<div class="flex flex-wrap gap-2">
				{#each projectTypesWithCounts as { type, count } (type)}
					<button
						disabled={!hydrated}
						data-testid="type-filter"
						onclick={() => handleTypeChange(type)}
						class="cursor-pointer rounded-full border px-3 py-1 text-sm capitalize {selectedType ===
						type
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
						<span class="ml-1">({count})</span>
					</button>
				{/each}
			</div>
		</div>
		<!-- Tag Filters -->
		{#if allTags.length > 0}
			<div id="tag-filters" class="flex flex-wrap items-center gap-2">
				{#each visibleTagsWithCounts as { tag, count } (tag)}
					<button
						disabled={!hydrated}
						data-testid="tag-filter"
						onclick={() => handleTagToggle(tag)}
						class="cursor-pointer rounded border px-2 py-1 text-xs {selectedTags.includes(tag)
							? 'border-primary bg-primary text-box'
							: 'border-primary bg-box text-primary hover:bg-primary hover:text-box'}"
					>
						{tag}<span class="ml-1">({count})</span>
					</button>
				{/each}
				{#if hiddenTagCount > 0}
					<button
						disabled={!hydrated}
						onclick={() => (tagsExpanded = !tagsExpanded)}
						aria-expanded={tagsExpanded}
						aria-controls="tag-filters"
						class="border-primary bg-box text-primary hover:bg-primary hover:text-box cursor-pointer rounded border px-2 py-1 text-xs font-bold"
					>
						{#if tagsExpanded}
							{$_('ui.show_less_tags')}
						{:else}
							+ {hiddenTagCount} {$_('ui.show_more_tags')}
						{/if}
					</button>
				{/if}
				{#if selectedTags.length > 0}
					<button
						disabled={!hydrated}
						onclick={clearTags}
						class="border-primary bg-box text-primary hover:bg-primary hover:text-box cursor-pointer rounded border px-2 py-1 text-xs font-bold underline"
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
					<RowsPerPage {handler} disabled={!hydrated} />
				{/if}
				{#if showSort}
					<div class="flex items-center gap-2">
						<span class="text-sm">{$_('ui.sort.sort_by')}</span>
						<select
							disabled={!hydrated}
							aria-label={$_('ui.sort.sort_by')}
							bind:value={sortBy}
							onchange={handleSortChange}
							class="border-primary bg-box cursor-pointer rounded border px-2 py-1 text-sm"
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
</div>
