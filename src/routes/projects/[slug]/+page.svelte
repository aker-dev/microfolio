<script>
	import { base } from '$app/paths';
	import { formatProjectDate } from '$lib/utils/date.js';
	import { afterNavigate } from '$app/navigation';
	import { siteConfig } from '$lib/config.js';
	import { _ } from 'svelte-i18n';
	import AkBadge from '$lib/components/AkBadge.svelte';
	import AkLightbox from '$lib/components/AkLightbox.svelte';
	import AkOptimizedImage from '$lib/components/AkOptimizedImage.svelte';
	import IconStarFilled from '~icons/carbon/star-filled';
	import IconDocument from '~icons/carbon/document';

	let { data } = $props();
	let project = $derived(data.project);

	// `from` is null when the visitor landed here directly — a shared link, a
	// refresh, a search result — in which case there is nothing to go back to
	// and the link falls back to the projects index rather than leaving the site.
	let previousUrl = $state(null);
	afterNavigate(({ from }) => {
		previousUrl = from?.url ? from.url.pathname + from.url.search : null;
	});

	function goBack(event) {
		// Let the browser handle "open in a new tab" and friends
		if (!previousUrl || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

		// history.back() rather than following the href: it restores the scroll
		// position too, and does not grow the history stack
		event.preventDefault();
		history.back();
	}

	// Get server-loaded metadata
	let thumbnailMetadata = $derived(data.project.thumbnailMetadata);

	// Image gallery: AkLightbox owns everything else, including keyboard handling
	let galleryImages = $derived(project.resources?.images ?? []);
	let showLightbox = $state(false);
	let currentImageIndex = $state(0);

	function openLightbox(image) {
		currentImageIndex = galleryImages.findIndex((img) => img.path === image.path);
		showLightbox = true;
	}

	// No client-side metadata loading needed - data comes from server
</script>

<svelte:head>
	<title>{siteConfig.title} • {project.title}</title>
	<meta name="description" content={project.description} />

	<!-- OG metadata -->
	<meta property="og:title" content={project.title} />
	<meta property="og:description" content={project.description} />
	{#if project.hasThumbnail}
		<meta property="og:image" content="{base}/content/projects/{project.slug}/thumbnail.jpg" />
	{/if}
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={siteConfig.title} />
</svelte:head>

<div class="grid grid-cols-1 lg:grid-cols-3 lg:gap-6">
	<!-- Main content -->
	<div class="col-span-2 mb-12 max-w-none">
		<!-- Title & Description -->
		<div>
			<h1 class="text-primary mb-2 text-3xl font-bold">{project.title}</h1>
		</div>
		<h2 class="text-lg">{project.description}</h2>

		<!-- Back link: the previous page when there is one, the index otherwise -->
		<a
			href={previousUrl ?? `${base}/projects`}
			onclick={goBack}
			class="my-4 block text-sm hover:underline">← {$_('ui.back')}</a
		>

		<!-- Main thumbnail -->
		{#if project.hasThumbnail}
			<img
				src="{base}/content/projects/{project.slug}/thumbnail.jpg"
				alt={thumbnailMetadata?.description || project.title}
				class="w-full"
			/>

			<!-- Thumbnail metadata -->
			<div class="text-primary mt-4 text-sm">
				{#if thumbnailMetadata?.headline}
					<p class="font-bold">{thumbnailMetadata.headline}</p>
				{:else}
					<p class="font-bold">thumbnail.jpg</p>
				{/if}
				{#if thumbnailMetadata?.description}
					<p class="italic">{thumbnailMetadata.description}</p>
				{/if}
				{#if thumbnailMetadata?.creditLine}
					<p class="mt-1 text-xs">{$_('ui.credit')} › {thumbnailMetadata.creditLine}</p>
				{/if}
			</div>
		{/if}

		<!-- Content -->
		<article class="prose prose-neutral text-primary mt-8">
			<!-- Markdown authored in the project's index.md and converted at build time, not user input -->
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html project.content}
		</article>
	</div>

	<!-- Sidebar -->
	<aside class="bg-box mb-6 space-y-3 p-6 text-sm lg:sticky lg:top-40 lg:self-start">
		<div class="flex items-center justify-between">
			<AkBadge href="{base}/projects/?type={encodeURIComponent(project.type)}">
				{project.type}
			</AkBadge>

			{#if project.featured}
				<IconStarFilled class="inline-block size-6 pb-1" />
			{/if}
		</div>

		<hr />
		<!-- Location & Date -->
		<div>
			<h3 class="text-base font-bold">{$_('ui.project.infos')}</h3>
			<span class="font-bold">{$_('ui.project.location_date')} ›</span>
			<span>{project.location} / </span>
			<span>{formatProjectDate(project.date)}</span>

			<!-- Status -->
			{#if project.status}
				<div>
					<span class="font-bold">{$_('ui.project.status')} › </span>
					<span class="capitalize">{project.status}</span>
				</div>
			{/if}

			<!-- Project Owner -->
			{#if project.owner}
				<div>
					<span class="font-bold">{$_('ui.project.owner')} ›</span>
					<span>{project.owner}</span>
				</div>
			{/if}

			<!-- Surface Area -->
			{#if project.surface_area}
				<div>
					<span class="font-bold">{$_('ui.project.surface_area')} › </span>
					<span>{project.surface_area}</span>
				</div>
			{/if}

			<!-- Cost -->
			{#if project.cost}
				<div>
					<span class="font-bold">{$_('ui.project.cost')} ›</span>
					<span>{project.cost}</span>
				</div>
			{/if}
		</div>
		<!-- Authors -->
		{#if project.authors && project.authors.length > 0}
			<div class="mt-2">
				<h3 class="text-base font-bold">{$_('ui.project.team')}</h3>

				{#each project.authors as author, i (i)}
					<div>
						<span class="font-bold">{author.name}</span>
						{#if author.role}
							<span> › {author.role}</span>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		<!-- Tags -->
		{#if project.tags && project.tags.length > 0}
			<div class="mt-2">
				<h3 class="mb-1 text-base font-bold">{$_('ui.project.tags')}</h3>

				<div class="flex flex-wrap gap-2">
					{#each project.tags as tag, i (i)}
						<AkBadge small href="{base}/projects/?tags={encodeURIComponent(tag)}">
							{tag}
						</AkBadge>
					{/each}
				</div>
			</div>
		{/if}
	</aside>
</div>

<!-- Resources -->
{#if project.resources}
	<!-- Images Gallery -->
	{#if project.resources.images && project.resources.images.length > 0}
		<section class="mb-12">
			<h2 class="mb-6 text-2xl font-bold">{$_('ui.project.gallery')}</h2>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each project.resources.images as image (image.path)}
					<div class="group">
						<button
							type="button"
							onclick={() => openLightbox(image)}
							class="block aspect-4/3 w-full cursor-pointer overflow-hidden"
						>
							<AkOptimizedImage
								src={image.path}
								alt={image.metadata?.description || image.name}
								class="image-hover-effect h-full w-full object-cover"
								hasWebP={image.hasWebP || false}
							/>
						</button>
						<!-- Image metadata -->
						<div class="text-primary mt-2 text-sm">
							{#if image.metadata?.headline}
								<p class="font-bold">{image.metadata.headline}</p>
							{:else}
								<p class="font-bold">{image.name}</p>
							{/if}
							{#if image.metadata?.description}
								<p class="italic">{image.metadata.description}</p>
							{/if}
							{#if image.metadata?.creditLine}
								<p class="mt-1 text-xs">{$_('ui.credit')} › {image.metadata.creditLine}</p>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Videos -->
	{#if project.resources.videos && project.resources.videos.length > 0}
		<section class="mb-12">
			<h2 class="mb-6 text-2xl font-bold">{$_('ui.project.videos')}</h2>
			<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
				{#each project.resources.videos as video (video.path)}
					<div class="overflow-hidden">
						<video controls class="w-full" preload="metadata">
							<source src={video.path} type="video/mp4" />
							<track kind="captions" />
							{$_('ui.video_not_supported')}
						</video>
						<p class="text-primary mt-2 text-sm font-bold">{video.name}</p>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Documents -->
	{#if project.resources.documents && project.resources.documents.length > 0}
		<section class="mb-12">
			<h2 class="mb-6 text-2xl font-bold">{$_('ui.project.documents')}</h2>
			<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
				{#each project.resources.documents as document (document.path)}
					<a
						href={document.path}
						target="_blank"
						rel="noopener noreferrer"
						class="bg-box flex items-center gap-3 p-4"
					>
						<div class="shrink-0">
							<IconDocument class="text-primary pointer-events-none h-6 w-6" />
						</div>
						<div class="flex-1">
							<p class="text-primary text-sm font-bold">{document.name}</p>
							<p class="text-primary text-xs">{$_('ui.click_to_download')}</p>
						</div>
					</a>
				{/each}
			</div>
		</section>
	{/if}
{/if}

<AkLightbox images={galleryImages} bind:open={showLightbox} bind:index={currentImageIndex} />
