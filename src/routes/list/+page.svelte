<script>
	import { base } from '$app/paths';
	import Datatable from '$lib/components/Datatable.svelte';
	import ThSort from '$lib/components/ThSort.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import AkFilters from '$lib/components/AkFilters.svelte';
	import AkBadge from '$lib/components/AkBadge.svelte';
	import IconArrowRight from '~icons/carbon/arrow-right';
	import IconStarFilled from '~icons/carbon/star-filled';
	import { siteConfig } from '$lib/config.js';
	import { _ } from 'svelte-i18n';

	let { data } = $props();
	let projects = $derived(data.projects);

	let selectedType = $state('all');
	let searchTerm = $state('');
	let filteredProjects = $state([]);
	let handler = $state();
	let sortBy = $state('date');
	let sortOrder = $state('desc');

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
</script>

<svelte:head>
	<title>{siteConfig.title} • {$_('pages.list.title')}</title>
	<meta name="description" content={$_('pages.list.description')} />
</svelte:head>

<div class="space-y-8">
	<!-- Header -->
	<header>
		<h1 class="text-primary mb-2 text-3xl font-bold">{$_('pages.list.title')}</h1>
		<p class="text-lg">{$_('pages.list.description')}</p>
	</header>

	<!-- Filters -->
	<AkFilters
		{projects}
		bind:searchTerm
		bind:selectedType
		bind:filteredProjects
		bind:handler
		bind:sortBy
		bind:sortOrder
		rowsPerPage={20}
		showRowsPerPage={true}
		showSort={true}
		showResultsCount={true}
	/>

	<!-- Data Table -->
	{#if handler}
		<div class="overflow-x-auto">
			<Datatable {handler} class="w-full">
				<table class="w-full">
					<thead class="bg-box">
						<tr>
							<ThSort {handler} orderBy="title" class="px-4 py-3 text-start" bind:sortBy bind:sortOrder>
								<span class="font-semibold">{$_('ui.table.title')}</span>
							</ThSort>
							<ThSort {handler} orderBy="type" class="px-4 py-3 text-start" bind:sortBy bind:sortOrder>
								<span class="font-semibold">{$_('ui.table.type')}</span>
							</ThSort>
							<ThSort {handler} orderBy="location" class="px-4 py-3 text-start" bind:sortBy bind:sortOrder>
								<span class="font-semibold">{$_('ui.table.location')}</span>
							</ThSort>
							<ThSort {handler} orderBy="date" class="px-4 py-3 text-start" bind:sortBy bind:sortOrder>
								<span class="font-semibold">{$_('ui.table.date')}</span>
							</ThSort>
							<th class="px-4 py-3 text-start">
								<span class="font-semibold">{$_('ui.table.description')}</span>
							</th>
							<th class="px-4 py-3 text-start">
								<span class="font-semibold">{$_('ui.table.tags')}</span>
							</th>
							<th class="px-4 py-3 text-start">
								<span class="font-semibold">{$_('ui.table.actions')}</span>
							</th>
						</tr>
					</thead>
					<tbody>
						{#each handler.rows as project (project.slug)}
							<tr class="border-primary hover:bg-box border-t">
								<td class="px-4 py-3">
									<div class="font-medium">{project.title}</div>
								</td>
								<td class="px-4 py-3">
									<div class="flex items-center gap-2">
										<AkBadge>{project.type}</AkBadge>
										{#if project.featured}
											<IconStarFilled class="size-4" />
										{/if}
									</div>
								</td>
								<td class="text-primary px-4 py-3 text-sm">
									{project.location || $_('ui.not_available')}
								</td>
								<td class="text-primary px-4 py-3 text-sm">
									{formatDate(project.date)}
								</td>
								<td class="text-primary px-4 py-3 text-sm">
									{truncateText(project.description)}
								</td>
								<td class="px-4 py-3">
									{#if project.tags}
										<div class="flex flex-wrap gap-1">
											{#each project.tags.slice(0, 3) as tag}
												<AkBadge small>{tag}</AkBadge>
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
										class="group bg-box text-primary border-primary inline-block cursor-pointer rounded-full border-1 p-2"
										aria-label={$_('ui.view_project')}
									>
										<IconArrowRight class="pointer-events-none size-4 group-hover:scale-120" />
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
			<p class="text-neutral-500">{$_('ui.loading_projects')}</p>
		</div>
	{/if}
</div>
