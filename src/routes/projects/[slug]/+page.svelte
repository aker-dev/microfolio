<script>
	import AkBadge from '$lib/components/AkBadge.svelte';

	let { data } = $props();
	let project = $derived(data.project);

	// Image gallery state
	let selectedImage = $state(null);
	let showLightbox = $state(false);

	function openLightbox(image) {
		selectedImage = image;
		showLightbox = true;
	}

	function closeLightbox() {
		showLightbox = false;
		selectedImage = null;
	}

	// Handle keyboard navigation
	function handleKeydown(event) {
		if (event.key === 'Escape') {
			closeLightbox();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<article class="">
	<!-- Header -->
	<header class="mb-8">
		<nav class="my-4">
			<a href="/projects" class="text-sm hover:underline">← Back to Projects</a>
		</nav>

		<div class="mb-2 flex items-center gap-4">
			<AkBadge>{project.type}</AkBadge>
			{#if project.featured}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="size-5"
				>
					<path
						fill-rule="evenodd"
						d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
						clip-rule="evenodd"
					/>
				</svg>
			{/if}
		</div>

		<h2 class="mb-2 text-4xl font-bold text-black">{project.title}</h2>

		<div class="space-y-4">
			<p class="text-lg leading-relaxed text-black">{project.description}</p>

			<!-- Authors -->
			{#if project.authors && project.authors.length > 0}
				<div class="space-y-2">
					<h3 class="text-lg font-medium text-black">Team</h3>

					{#each project.authors as author}
						<div class="text-sm">
							<span class="font-medium">{author.name}</span>
							<span class="text-black">› {author.role}</span>
						</div>
					{/each}
				</div>
			{/if}

			<h3 class="text-lg font-medium text-black">Location & Date</h3>
			<div class="text-sm">
				<span>{project.location} — </span>
				<span>{new Date(project.date).toISOString().slice(0, 7)}</span>
			</div>

			<!-- Tags -->
			<h3 class="text-lg font-medium text-black">Tags</h3>

			{#if project.tags && project.tags.length > 0}
				<div class="flex flex-wrap gap-2">
					{#each project.tags as tag}
						<AkBadge small>#{tag}</AkBadge>
					{/each}
				</div>
			{/if}
		</div>
	</header>

	<!-- Main thumbnail -->
	<div class="mb-8">
		<img src="/content/projects/{project.slug}/thumbnail.jpg" alt={project.title} class="w-full" />
	</div>

	<!-- Content -->
	<div class="prose prose-lg mb-12 max-w-none">
		{@html project.content}
	</div>

	<!-- Resources -->
	{#if project.resources}
		<!-- Images Gallery -->
		{#if project.resources.images && project.resources.images.length > 0}
			<section class="mb-12">
				<h2 class="mb-6 text-2xl font-bold">Gallery</h2>
				<div class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
					{#each project.resources.images as image}
						<button
							type="button"
							onclick={() => openLightbox(image)}
							class="group block aspect-square cursor-pointer overflow-hidden"
						>
							<img
								src={image.path}
								alt={image.name}
								class="h-full w-full object-cover"
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
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					{#each project.resources.videos as video}
						<div class="overflow-hidden rounded-lg bg-gray-100">
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
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					{#each project.resources.documents as document}
						<a
							href={document.path}
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-3 bg-white p-4"
						>
							<div class="flex-shrink-0">
								<svg
									class="h-6 w-6 text-black"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									></path>
								</svg>
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
</article>

<!-- Lightbox -->
{#if showLightbox && selectedImage}
	<div
		class="fixed inset-0 z-1000 flex items-center justify-center bg-black/80"
		onclick={closeLightbox}
	>
		<div class="relative max-h-[90vh] max-w-4xl p-4">
			<button
				type="button"
				onclick={closeLightbox}
				class="absolute top-4 right-4 z-10 text-white hover:text-black"
			>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					></path>
				</svg>
			</button>
			<img
				src={selectedImage.path}
				alt={selectedImage.name}
				class="max-h-full max-w-full object-contain"
				onclick={(e) => e.stopPropagation()}
			/>
		</div>
	</div>
{/if}
