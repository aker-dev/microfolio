<script>
	import AkProjectCard from '$lib/components/AkProjectCard.svelte';
	import AkFilters from '$lib/components/AkFilters.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { siteConfig } from '$lib/config.js';
	import { _ } from 'svelte-i18n';

	let { data } = $props();
	let projects = $derived(data.projects);

	const ROWS_PER_PAGE = 20;

	let selectedType = $state('all');
	let searchTerm = $state('');
	// Seeded with the first page rather than every project, so the prerendered
	// HTML matches what the visitor sees once AkFilters takes over — otherwise the
	// grid rendered all 101 cards and then dropped to 20 on hydration.
	let filteredProjects = $state(data.projects.slice(0, ROWS_PER_PAGE));
	let handler = $state();
</script>

<svelte:head>
	<title>{siteConfig.title} • {$_('pages.projects.title')}</title>
	<meta name="description" content={$_('pages.projects.description')} />
</svelte:head>

<div class="space-y-8">
	<!-- Header -->
	<header>
		<h1 class="text-primary mb-2 text-3xl font-bold">{$_('pages.projects.title')}</h1>
		<h2 class="text-lg">{$_('pages.projects.description')}</h2>
	</header>
	<AkFilters
		{projects}
		bind:searchTerm
		bind:selectedType
		bind:filteredProjects
		bind:handler
		rowsPerPage={ROWS_PER_PAGE}
		showRowsPerPage={true}
		showSort={true}
		showResultsCount={true}
	/>

	<!-- Mosaic Grid -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
		{#each filteredProjects as project (project.slug)}
			<AkProjectCard {project} />
		{/each}
	</div>

	<!-- Empty state -->
	{#if filteredProjects.length === 0}
		<div class="py-12 text-center">
			<p class="">{$_('ui.no_projects_found')}</p>
		</div>
	{/if}

	<!-- Pagination -->
	{#if handler}
		<div class="flex justify-center">
			<Pagination {handler} />
		</div>
	{/if}
</div>
