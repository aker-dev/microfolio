<script>
	import { base } from '$app/paths';
	import AkBadge from './AkBadge.svelte';
	import AkOptimizedImage from './AkOptimizedImage.svelte';
	import IconStarFilled from '~icons/carbon/star-filled';

	let { project, class: className } = $props();
</script>

<a href="{base}/projects/{project.slug}" class="group bg-box block overflow-hidden {className}">
	<!-- Thumbnail -->
	<div class="aspect-[4/3] overflow-hidden">
		<AkOptimizedImage
			src={project.thumbnailSrc}
			alt={project.title}
			class="image-hover-effect h-full w-full bg-neutral-500 object-cover"
			hasWebP={project.hasWebP || false}
		/>
	</div>

	<!-- Content -->
	<div class="space-y-3 p-4">
		<div class="flex items-center justify-between">
			<AkBadge>{project.type}</AkBadge>

			{#if project.featured}
				<IconStarFilled class="inline-block size-6 pb-1" />
			{/if}
		</div>

		<h3 class="text-lg font-semibold text-balance">
			{project.title}
		</h3>

		<p class="line-clamp-2 text-sm">
			{project.description}…
		</p>

		<div class="flex items-center justify-between text-xs">
			<span>{project.location}</span>
			<span>{new Date(project.date).toISOString().slice(0, 7)}</span>
		</div>

		<!-- Tags -->
		<!-- {#if project.tags && project.tags.length > 0}
			<div class="flex flex-wrap gap-1">
				{#each project.tags.slice(0, 3) as tag}
					<span class="rounded bg-neutral-50 px-2 py-1 text-xs text-neutral-600">
						{tag}
					</span>
				{/each}
				{#if project.tags.length > 3}
					<span class="rounded bg-neutral-50 px-2 py-1 text-xs text-neutral-600">
						+{project.tags.length - 3}
					</span>
				{/if}
			</div>
		{/if} -->

		<!-- Authors -->
		<!-- {#if project.authors && project.authors.length > 0}
			<div class="text-xs text-neutral-500">
				By {project.authors.map((author) => author.name).join(', ')}
			</div>
		{/if} -->
	</div>
</a>
