<script>
	import { base } from '$app/paths';
	import { _ } from 'svelte-i18n';
	import { formatProjectDate } from '$lib/utils/date.js';
	import AkBadge from './AkBadge.svelte';
	import IconStarFilled from '$lib/icons/IconStarFilled.svelte';

	let { project, class: className = '' } = $props();

	const TAG_LIMIT = 3;
	const DESCRIPTION_LIMIT = 100;

	let description = $derived(
		project.description && project.description.length > DESCRIPTION_LIMIT
			? project.description.slice(0, DESCRIPTION_LIMIT) + '...'
			: project.description
	);
	// Joined here rather than in the markup: across two spans a wrap stranded the
	// separator at the start of a line, and inside an {#if} Svelte swallowed the
	// space before it. This also copes with either part being absent.
	let dateAndPlace = $derived(
		[formatProjectDate(project.date), project.location].filter(Boolean).join(' · ')
	);
	let visibleTags = $derived(project.tags?.slice(0, TAG_LIMIT) ?? []);
	let hiddenTagCount = $derived(Math.max(0, (project.tags?.length ?? 0) - TAG_LIMIT));
</script>

<!-- A text-first summary of a project, used where a thumbnail would get in the
     way: the map callout, and the list view below md. The grids keep
     AkProjectCard, which leads with its image. The whole block is the link, so
     the tap target is the card rather than the title alone — which is why the
     tags are plain text here, an anchor cannot contain other links. -->
<a
	href="{base}/projects/{project.slug}"
	class="bg-background hover:bg-box block p-4 transition-colors {className}"
>
	<h3 class="font-bold">{project.title}</h3>

	<div class="mt-2 flex flex-wrap items-center gap-2">
		<AkBadge>{project.type}</AkBadge>
		{#if project.featured}
			<IconStarFilled class="size-4" />
		{/if}
		<span class="text-primary text-sm">{dateAndPlace}</span>
	</div>

	{#if description}
		<p class="text-primary mt-2 text-sm">{description}</p>
	{/if}

	{#if visibleTags.length > 0}
		<p class="text-primary mt-2 text-xs">
			{visibleTags.join(', ')}{#if hiddenTagCount > 0}&nbsp;+{hiddenTagCount}{/if}
		</p>
	{/if}

	<span class="sr-only">{$_('ui.view_project')}</span>
</a>
