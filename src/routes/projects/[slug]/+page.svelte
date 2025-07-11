<script>
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

<article class="mx-auto max-w-4xl">
	<!-- Header -->
	<header class="mb-8">
		<nav class="mb-4">
			<a href="/projects" class="text-sm text-gray-600 hover:text-black">← Back to Projects</a>
		</nav>

		<div class="space-y-4">
			<div class="flex items-center gap-4">
				<span class="inline-block rounded bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
					{project.type}
				</span>
				{#if project.featured}
					<span class="text-sm font-medium text-yellow-600">Featured</span>
				{/if}
			</div>

			<h1 class="text-4xl font-bold text-gray-900">{project.title}</h1>

			<div class="flex flex-wrap gap-4 text-sm text-gray-600">
				<span>{project.location}</span>
				<span>•</span>
				<span>{new Date(project.date).toLocaleDateString()}</span>
			</div>

			<p class="text-lg leading-relaxed text-gray-700">{project.description}</p>

			<!-- Authors -->
			{#if project.authors && project.authors.length > 0}
				<div class="space-y-2">
					<h3 class="text-sm font-medium text-gray-900">Team</h3>
					<div class="flex flex-wrap gap-4">
						{#each project.authors as author}
							<div class="text-sm">
								<span class="font-medium">{author.name}</span>
								<span class="text-gray-600">— {author.role}</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Tags -->
			{#if project.tags && project.tags.length > 0}
				<div class="flex flex-wrap gap-2">
					{#each project.tags as tag}
						<span class="rounded bg-gray-50 px-2 py-1 text-xs text-gray-600">
							{tag}
						</span>
					{/each}
				</div>
			{/if}
		</div>
	</header>

	<!-- Main thumbnail -->
	<div class="mb-8">
		<img
			src="/content/projects/{project.slug}/thumbnail.jpg"
			alt={project.title}
			class="w-full rounded-lg shadow-lg"
		/>
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
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each project.resources.images as image}
						<button
							type="button"
							onclick={() => openLightbox(image)}
							class="group block aspect-square overflow-hidden rounded-lg bg-gray-100 transition-shadow hover:shadow-md"
						>
							<img
								src={image.path}
								alt={image.name}
								class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
								<p class="text-sm text-gray-600">{video.name}</p>
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
							class="flex items-center gap-3 rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100"
						>
							<div class="flex-shrink-0">
								<svg
									class="h-6 w-6 text-gray-600"
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
								<p class="text-sm font-medium text-gray-900">{document.name}</p>
								<p class="text-xs text-gray-600">Click to download</p>
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
				class="absolute top-4 right-4 z-10 text-white hover:text-gray-300"
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
