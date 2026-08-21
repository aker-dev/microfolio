<script>
	import { base } from '$app/paths';
	import AkSeo from '$lib/components/AkSeo.svelte';
	import Datatable from '$lib/components/Datatable.svelte';
	import ThSort from '$lib/components/ThSort.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import AkFilters from '$lib/components/AkFilters.svelte';
	import AkBadge from '$lib/components/AkBadge.svelte';
	import IconArrowRight from '~icons/carbon/arrow-right';
	import IconStarFilled from '~icons/carbon/star-filled';
	import { _ } from 'svelte-i18n';
	import { formatProjectDate } from '$lib/utils/date.js';
	import AkProjectSummary from '$lib/components/AkProjectSummary.svelte';

	let { data } = $props();
	let projects = $derived(data.projects);

	let selectedType = $state('all');
	let searchTerm = $state('');
	let filteredProjects = $state([]);
	let handler = $state();
	let sortBy = $state('date');
	let sortOrder = $state('desc');

	// Truncate text function
	function truncateText(text, maxLength = 60) {
		if (!text) return '';
		return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
	}
</script>

<AkSeo title={$_('pages.list.title')} description={$_('pages.list.description')} path="/list/" />

<div class="space-y-8">
	<!-- Header -->
	<header>
		<h1 class="text-primary mb-2 text-3xl font-bold">{$_('pages.list.title')}</h1>
		<h2 class="text-lg">{$_('pages.list.description')}</h2>
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

	<!-- Below md the table needed 840px in 311px, hiding five of its seven columns
	     behind a horizontal scroll with nothing to say so. Each row becomes a card
	     instead; the table itself takes over from md. The cards sit flush and are
	     parted by a hairline, echoing the rule between the table's rows: with a gap
	     between them the rule lands on a card edge and reads as an underline. -->
	<ul class="divide-primary divide-y md:hidden" data-testid="project-cards">
		{#each handler.rows as project (project.slug)}
			<li><AkProjectSummary {project} /></li>
		{/each}
	</ul>

	<!-- Data Table. No `{#if handler}` gate: AkFilters builds its table handler
	     eagerly, so the rows are in the prerendered HTML. -->
	<div class="hidden overflow-x-auto md:block">
		<Datatable {handler} class="w-full">
			<table class="w-full">
				<thead class="bg-box">
					<tr>
						<ThSort
							{handler}
							orderBy="title"
							class="px-4 py-3 text-start"
							bind:sortBy
							bind:sortOrder
						>
							<span class="font-bold">{$_('ui.table.title')}</span>
						</ThSort>
						<ThSort
							{handler}
							orderBy="type"
							class="px-4 py-3 text-start"
							bind:sortBy
							bind:sortOrder
						>
							<span class="font-bold">{$_('ui.table.type')}</span>
						</ThSort>
						<ThSort
							{handler}
							orderBy="location"
							class="px-4 py-3 text-start"
							bind:sortBy
							bind:sortOrder
						>
							<span class="font-bold">{$_('ui.table.location')}</span>
						</ThSort>
						<ThSort
							{handler}
							orderBy="date"
							class="px-4 py-3 text-start"
							bind:sortBy
							bind:sortOrder
						>
							<span class="font-bold">{$_('ui.table.date')}</span>
						</ThSort>
						<th class="px-4 py-3 text-start">
							<span class="font-bold">{$_('ui.table.description')}</span>
						</th>
						<th class="px-4 py-3 text-start">
							<span class="font-bold">{$_('ui.table.tags')}</span>
						</th>
						<th class="px-4 py-3 text-start">
							<span class="font-bold">{$_('ui.table.actions')}</span>
						</th>
					</tr>
				</thead>
				<tbody>
					{#each handler.rows as project (project.slug)}
						<tr class="border-primary hover:bg-box border-t">
							<td class="px-4 py-3">
								<h3 class="font-bold">
									<a href="{base}/projects/{project.slug}" class="hover:underline"
										>{project.title}</a
									>
								</h3>
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
								{project.location ?? ''}
							</td>
							<td class="text-primary px-4 py-3 text-sm">
								{formatProjectDate(project.date)}
							</td>
							<td class="text-primary px-4 py-3 text-sm">
								{truncateText(project.description)}
							</td>
							<td class="px-4 py-3">
								{#if project.tags}
									<div class="flex flex-wrap gap-1">
										{#each project.tags.slice(0, 3) as tag, i (i)}
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
									class="group bg-box text-primary border-primary inline-block cursor-pointer rounded-full border p-2"
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
</div>
