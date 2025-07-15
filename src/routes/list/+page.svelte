<script>
	import { base } from '$app/paths';
	import { DataHandler } from '@vincjo/datatables/legacy';
	import Datatable from '$lib/components/Datatable.svelte';
	import ThFilter from '$lib/components/ThFilter.svelte';
	import ThSort from '$lib/components/ThSort.svelte';
	import Search from '$lib/components/Search.svelte';
	import RowsPerPage from '$lib/components/RowsPerPage.svelte';
	import RowCount from '$lib/components/RowCount.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import AkBadge from '$lib/components/AkBadge.svelte';
	import Icon from '@iconify/svelte';

	let { data } = $props();
	let projects = $derived(data.projects);

	// Initialize DataHandler with reactive data
	let handler = $state();

	// Filter state
	let selectedType = $state('all');
	let searchTerm = $state('');

	// Get unique project types
	let projectTypes = $derived(['all', ...new Set(projects.map((p) => p.type))]);

	// Get rows from handler
	let rows = $derived(handler ? handler.getRows() : []);

	// Initialize handler when projects are available
	$effect(() => {
		if (projects && projects.length > 0) {
			handler = new DataHandler(projects, { rowsPerPage: 10 });
		}
	});

	// Apply filters to DataHandler when they change
	$effect(() => {
		if (!handler) return;
		// Apply type filter
		if (selectedType === 'all') {
			handler.clearFilters();
		} else {
			handler.filter(selectedType, 'type');
		}
	});

	$effect(() => {
		if (!handler) return;
		// Apply search filter
		if (searchTerm === '') {
			handler.clearSearch();
		} else {
			handler.search(searchTerm, ['title', 'description', 'tags', 'location']);
		}
	});

	// Format date function
	function formatDate(dateString) {
		if (!dateString) return '';
		return new Date(dateString).toISOString().slice(0, 7);
	}

	// Truncate text function
	function truncateText(text, maxLength = 60) {
		if (!text) return '';
		return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
	}

	// Get filtered count for display
	let filteredCount = $derived(() => {
		if (!handler) return 0;
		return handler.getFilteredRows().length;
	});
</script>

<svelte:head>
	<title>Projects List</title>
	<meta name="description" content="Searchable and sortable projects list" />
</svelte:head>

<div class="space-y-8">
	<!-- Header -->
	<h2 class="text-4xl font-bold">Projects List</h2>

	<!-- Filters and Search -->
	<div class="space-y-4">
		<div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
			<input
				type="text"
				placeholder="Search projects..."
				bind:value={searchTerm}
				class="rounded-lg border border-black px-4 py-2 focus:bg-white focus:outline-none"
			/>
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
		</div>

		<!-- Table Controls -->
		{#if handler}
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div class="flex items-center gap-4">
					<RowsPerPage {handler} />
					<RowCount {handler} />
				</div>
			</div>
		{/if}
	</div>

	<!-- Data Table -->
	{#if handler}
		<div class="overflow-x-auto">
			<Datatable {handler} class="w-full">
				<table class="w-full">
					<thead class="bg-white">
						<tr>
							<ThSort {handler} orderBy="title" class="px-4 py-3 text-left">
								<span class="font-semibold">Title</span>
							</ThSort>
							<ThSort {handler} orderBy="type" class="px-4 py-3 text-left">
								<span class="font-semibold">Type</span>
							</ThSort>
							<ThSort {handler} orderBy="location" class="px-4 py-3 text-left">
								<span class="font-semibold">Location</span>
							</ThSort>
							<ThSort {handler} orderBy="date" class="px-4 py-3 text-left">
								<span class="font-semibold">Date</span>
							</ThSort>
							<th class="px-4 py-3 text-left">
								<span class="font-semibold">Description</span>
							</th>
							<th class="px-4 py-3 text-left">
								<span class="font-semibold">Tags</span>
							</th>
							<th class="px-4 py-3 text-left">
								<span class="font-semibold">Actions</span>
							</th>
						</tr>
					</thead>
					<tbody>
						{#each $rows as project (project.slug)}
							<tr class="border-t border-neutral-200 hover:bg-white">
								<td class="px-4 py-3">
									<div class="font-medium">{project.title}</div>
								</td>
								<td class="px-4 py-3">
									<AkBadge>{project.type}</AkBadge>
								</td>
								<td class="px-4 py-3 text-sm text-black">
									{project.location || 'N/A'}
								</td>
								<td class="px-4 py-3 text-sm text-black">
									{formatDate(project.date)}
								</td>
								<td class="px-4 py-3 text-sm text-black">
									{truncateText(project.description)}
								</td>
								<td class="px-4 py-3">
									{#if project.tags}
										<div class="flex flex-wrap gap-1">
											{#each project.tags.slice(0, 3) as tag}
												<AkBadge small>#{tag}</AkBadge>
											{/each}
											{#if project.tags.length > 3}
												<AkBadge small>
													+{project.tags.length - 3}
												</AkBadge>
											{/if}
										</div>
									{/if}
								</td>
								<td class="px-4 py-3">
									<a
										href="{base}/projects/{project.slug}"
										class="flex h-8 w-8 items-center justify-center rounded border border-black bg-white hover:bg-black hover:text-white"
										title="View project"
									>
										<Icon icon="carbon:arrow-right" class="h-4 w-4" />
									</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</Datatable>
		</div>

		<!-- Pagination -->
		<div class="flex justify-center">
			<Pagination {handler} />
		</div>
	{:else}
		<div class="flex items-center justify-center py-8">
			<p class="text-neutral-500">Loading projects...</p>
		</div>
	{/if}
</div>
