<script>
	import { base } from '$app/paths';
	import { formatProjectDate } from '$lib/utils/date.js';
	import { _ } from 'svelte-i18n';
	import AkBadge from './AkBadge.svelte';
	import AkOptimizedImage from './AkOptimizedImage.svelte';
	import IconStarFilled from '$lib/icons/IconStarFilled.svelte';
	import IconImage from '$lib/icons/IconImage.svelte';

	// Set on the first card of a grid: its thumbnail is what the browser measures
	// as the largest contentful paint, so it should not be queued behind the rest.
	let { project, class: className, priority = false } = $props();
</script>

<a href="{base}/projects/{project.slug}" class="group bg-box block overflow-hidden {className}">
	<!-- Thumbnail -->
	<div class="aspect-4/3 overflow-hidden">
		{#if project.hasThumbnail === false}
			<div
				class="flex h-full w-full items-center justify-center bg-neutral-500"
				role="img"
				aria-label={$_('ui.project.no_thumbnail')}
			>
				<IconImage class="size-10 opacity-60" />
			</div>
		{:else}
			<AkOptimizedImage
				src={project.thumbnailSrc}
				alt={project.title}
				class="image-hover-effect h-full w-full bg-neutral-500 object-cover"
				hasWebP={project.hasWebP || false}
				{priority}
			/>
		{/if}
	</div>

	<!-- Content -->
	<div class="space-y-3 p-4">
		<div class="flex items-center justify-between">
			<AkBadge>{project.type}</AkBadge>

			{#if project.featured}
				<IconStarFilled class="inline-block size-6 pb-1" />
			{/if}
		</div>

		<h3 class="text-lg font-bold text-balance">
			{project.title}
		</h3>

		<p class="line-clamp-2 text-sm">
			{project.description}…
		</p>

		<div class="flex items-center justify-between text-xs">
			<!-- Empty rather than absent when there is no location, so the date
			     keeps its place on the right -->
			<span>{project.location ?? ''}</span>
			<span>{formatProjectDate(project.date)}</span>
		</div>

		<!-- Tags -->
		{#if project.tags && project.tags.length > 0}
			<div class="flex flex-wrap gap-1">
				{#each project.tags.slice(0, 3) as tag, i (i)}
					<AkBadge small>
						{tag}
					</AkBadge>
				{/each}
				{#if project.tags.length > 3}
					<AkBadge small>
						+{project.tags.length - 3}
					</AkBadge>
				{/if}
			</div>
		{/if}
	</div>
</a>
