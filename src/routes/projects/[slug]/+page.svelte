<script>
	import AkBadge from '$lib/components/AkBadge.svelte';
	import Icon from '@iconify/svelte';

	let { data } = $props();
	let project = $derived(data.project);

	// Image gallery state
	let selectedImage = $state(null);
	let showLightbox = $state(false);
	let currentImageIndex = $state(0);

	function openLightbox(image) {
		selectedImage = image;
		showLightbox = true;
		// Find the index of the selected image
		if (project.resources?.images) {
			currentImageIndex = project.resources.images.findIndex((img) => img.path === image.path);
		}
	}

	function closeLightbox() {
		showLightbox = false;
		selectedImage = null;
		currentImageIndex = 0;
	}

	function navigateToImage(index) {
		if (project.resources?.images && index >= 0 && index < project.resources.images.length) {
			currentImageIndex = index;
			selectedImage = project.resources.images[index];
		}
	}

	function nextImage() {
		if (project.resources?.images) {
			const nextIndex = (currentImageIndex + 1) % project.resources.images.length;
			navigateToImage(nextIndex);
		}
	}

	function previousImage() {
		if (project.resources?.images) {
			const prevIndex =
				currentImageIndex === 0 ? project.resources.images.length - 1 : currentImageIndex - 1;
			navigateToImage(prevIndex);
		}
	}

	// Handle keyboard navigation
	function handleKeydown(event) {
		if (!showLightbox) return;

		if (event.key === 'Escape') {
			closeLightbox();
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			nextImage();
		} else if (event.key === 'ArrowLeft') {
			event.preventDefault();
			previousImage();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="order-last grid grid-cols-1 lg:order-first lg:grid-cols-3 lg:gap-6">
	<!-- Main content -->
	<article class="prose prose-neutral col-span-2 mb-12 max-w-none text-black">
		<!-- Main thumbnail -->
		<img
			src="/content/projects/{project.slug}/thumbnail.jpg"
			alt={project.title}
			class="w-full bg-neutral-500"
		/>

		<!-- Content -->

		{@html project.content}
	</article>

	<!-- Header -->
	<header class="order-first mb-6 bg-white p-6 lg:sticky lg:top-40 lg:order-last lg:self-start">
		<a href="/projects" class="mb-4 block text-sm hover:underline">← Back to Projects</a>

		<AkBadge class="mb-2">{project.type}</AkBadge>

		<h2 class="mb-2 text-3xl font-bold text-balance text-black">
			{project.title}
			{#if project.featured}
				<Icon icon="carbon:star-filled" class="inline-block size-8 pb-2" />
			{/if}
		</h2>

		<p class="text-lg leading-relaxed text-black">{project.description}</p>

		<!-- Location & Date -->
		<h3 class="mt-2 mb-1 font-medium text-black">Location & Date</h3>
		<div class="text-sm">
			<span>{project.location} › </span>
			<span>{new Date(project.date).toISOString().slice(0, 7)}</span>
		</div>

		<!-- Authors -->
		{#if project.authors && project.authors.length > 0}
			<h3 class="mt-2 mb-1 font-medium text-black">Team</h3>

			{#each project.authors as author}
				<div class="text-sm">
					<span class="font-medium">{author.name}</span>
					<span class="text-black">› {author.role}</span>
				</div>
			{/each}
		{/if}

		<!-- Tags -->

		{#if project.tags && project.tags.length > 0}
			<h3 class="mt-2 mb-1 font-medium text-black">Tags</h3>

			<div class="flex flex-wrap gap-2">
				{#each project.tags as tag}
					<AkBadge small>#{tag}</AkBadge>
				{/each}
			</div>
		{/if}
	</header>
</div>

<!-- Resources -->
{#if project.resources}
	<!-- Images Gallery -->
	{#if project.resources.images && project.resources.images.length > 0}
		<section class="mb-12">
			<h2 class="mb-6 text-2xl font-bold">Gallery</h2>
			<div class="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
				{#each project.resources.images as image}
					<button
						type="button"
						onclick={() => openLightbox(image)}
						class="group block aspect-square cursor-pointer overflow-hidden"
					>
						<img
							src={image.path}
							alt={image.name}
							class="h-full w-full bg-neutral-500 object-cover grayscale transition-all hover:grayscale-0"
							loading="lazy"
						/>
					</button>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Videos -->
	{#if project.resources.videos && project.resources.videos.length > 0}
		<section class="mb-12">
			<h2 class="mb-6 text-2xl font-bold">Videos</h2>
			<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
				{#each project.resources.videos as video}
					<div class="overflow-hidden bg-neutral-500">
						<video controls class="w-full" preload="metadata">
							<source src={video.path} type="video/mp4" />
							Your browser does not support the video tag.
						</video>
						<div class="p-3">
							<p class="text-sm text-black">{video.name}</p>
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Documents -->
	{#if project.resources.documents && project.resources.documents.length > 0}
		<section class="mb-12">
			<h2 class="mb-6 text-2xl font-bold">Documents</h2>
			<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
				{#each project.resources.documents as document}
					<a
						href={document.path}
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center gap-3 bg-white p-4"
					>
						<div class="flex-shrink-0">
							<Icon icon="carbon:document" class="h-6 w-6 text-black" />
						</div>
						<div class="flex-1">
							<p class="text-sm font-medium text-black">{document.name}</p>
							<p class="text-xs text-black">Click to download</p>
						</div>
					</a>
				{/each}
			</div>
		</section>
	{/if}
{/if}

<!-- Lightbox -->
{#if showLightbox && selectedImage}
	<div
		role="dialog"
		aria-modal="true"
		aria-label="Image lightbox"
		tabindex="-1"
		class="fixed inset-0 z-1000 flex items-center justify-center bg-black/80 p-4"
		onclick={closeLightbox}
		onkeydown={handleKeydown}
	>
		<div class="relative flex h-full w-full items-center justify-center">
			<!-- Previous image click area -->
			{#if project.resources?.images && project.resources.images.length > 1}
				<button
					type="button"
					onclick={(e) => {
						e.stopPropagation();
						previousImage();
					}}
					class="absolute top-0 left-0 z-20 h-full w-1/4 cursor-pointer"
					aria-label="Previous image"
				></button>
			{/if}

			<!-- Next image click area -->
			{#if project.resources?.images && project.resources.images.length > 1}
				<button
					type="button"
					onclick={(e) => {
						e.stopPropagation();
						nextImage();
					}}
					class="absolute top-0 right-0 z-20 h-full w-1/4 cursor-pointer"
					aria-label="Next image"
				></button>
			{/if}

			<!-- Close button -->
			<button
				type="button"
				onclick={(e) => {
					e.stopPropagation();
					closeLightbox();
				}}
				class="absolute top-4 right-4 z-30 cursor-pointer rounded-full bg-black/50 p-2 text-white backdrop-blur-md transition-all hover:bg-black/70"
				aria-label="Close lightbox"
			>
				<Icon icon="carbon:close" class="h-6 w-6" />
			</button>

			<!-- Image counter -->
			{#if project.resources?.images && project.resources.images.length > 1}
				<div
					class="absolute -bottom-2 left-1/2 z-30 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white"
				>
					{currentImageIndex + 1} / {project.resources.images.length}
				</div>
			{/if}

			<div class="pointer-events-none">
				<img
					src={selectedImage.path}
					alt={selectedImage.name}
					class="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl"
				/>
			</div>
		</div>
	</div>
{/if}
