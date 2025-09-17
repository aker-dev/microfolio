<script>
	import { base } from '$app/paths';
	import AkBadge from '$lib/components/AkBadge.svelte';
	import Icon from '@iconify/svelte';

	let { data } = $props();
	let project = $derived(data.project);

	// Get server-loaded metadata
	let thumbnailMetadata = $derived(data.project.thumbnailMetadata);
	let imageMetadata = $derived(
		new Map(project.resources?.images?.map((img) => [img.path, img.metadata]) || [])
	);
	let metadataCount = $derived(imageMetadata.size);

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

	// No client-side metadata loading needed - data comes from server
</script>

<svelte:window on:keydown={handleKeydown} />

<svelte:head>
	<title>{project.title}</title>
	<meta name="description" content={project.description} />
</svelte:head>

<div class="grid grid-cols-1 lg:grid-cols-3 lg:gap-6">
	<!-- Main content -->
	<div class="col-span-2 mb-12 max-w-none">
		<!-- Title & Description -->
		<div>
			<h2 class="inline-block text-3xl font-bold">{project.title}</h2>
		</div>
		<p class="text-lg">{project.description}</p>

		<!-- Back to projects link -->
		<a href="{base}/projects" class="my-4 block text-sm hover:underline">← Back to Projects</a>

		<!-- Main thumbnail -->
		<img
			src="{base}/content/projects/{project.slug}/thumbnail.jpg"
			alt={project.title}
			class="w-full"
		/>
		<!-- Thumbnail metadata -->
		{#if thumbnailMetadata}
			<div class="text-primary mt-4 text-sm">
				{#if thumbnailMetadata.headline}
					<p class="font-medium">{thumbnailMetadata.headline}</p>
				{/if}
				{#if thumbnailMetadata.description}
					<p class="italic">{thumbnailMetadata.description}</p>
				{/if}
				{#if thumbnailMetadata.creditLine}
					<p class="mt-1 text-xs">Credit: {thumbnailMetadata.creditLine}</p>
				{/if}
			</div>
		{:else}
			<div class="text-primary mt-4 text-sm">
				<p class="font-medium">thumbnail.jpg</p>
			</div>
		{/if}

		<!-- Content -->
		<article class="prose prose-neutral text-primary mt-8">
			{@html project.content}
		</article>
	</div>

	<!-- Sidebar -->
	<aside class="bg-box mb-6 space-y-3 p-6 text-sm lg:sticky lg:top-40 lg:self-start">
		<div class="flex items-center justify-between">
			<AkBadge>{project.type}</AkBadge>

			{#if project.featured}
				<Icon icon="carbon:star-filled" class="inline-block size-6 pb-1" />
			{/if}
		</div>

		<!-- <h3 class="text-lg font-semibold text-balance">
			{project.title}
		</h3> -->
		<hr />
		<!-- Location & Date -->
		<div>
			<h3 class="text-base font-medium">Infos</h3>
			<span class="font-medium">Location & Date ›</span>
			<span>{project.location} / </span>
			<span>{new Date(project.date).toISOString().slice(0, 7)}</span>

			<!-- Status -->
			{#if project.status}
				<div>
					<span class="font-medium">Status › </span>
					<span class="capitalize">{project.status}</span>
				</div>
			{/if}

			<!-- Project Owner -->
			{#if project.owner}
				<div>
					<span class="font-medium">Project Owner › </span>
					<span>{project.owner}</span>
				</div>
			{/if}

			<!-- Surface Area -->
			{#if project.surface_area}
				<div>
					<span class="font-medium">Surface Area › </span>
					<span>{project.surface_area}</span>
				</div>
			{/if}

			<!-- Cost -->
			{#if project.cost}
				<div>
					<span class="font-medium">Cost ›</span>
					<span>{project.cost}</span>
				</div>
			{/if}
		</div>
		<!-- Authors -->
		{#if project.authors && project.authors.length > 0}
			<div class="mt-2">
				<h3 class="text-base font-medium">Team</h3>

				{#each project.authors as author}
					<div>
						<span class="font-medium">{author.name}</span>
						<span>› {author.role}</span>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Tags -->
		{#if project.tags && project.tags.length > 0}
			<div class="mt-2">
				<h3 class="mb-1 text-base font-medium">Tags</h3>

				<div class="flex flex-wrap gap-2">
					{#each project.tags as tag}
						<AkBadge small>#{tag}</AkBadge>
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
			<h2 class="mb-6 text-2xl font-bold">Gallery</h2>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each project.resources.images as image}
					<div class="group">
						<button
							type="button"
							onclick={() => openLightbox(image)}
							class="block aspect-[4/3] w-full cursor-pointer overflow-hidden"
						>
							<img
								src={image.path}
								alt={image.name}
								class="image-hover-effect h-full w-full object-cover"
								loading="lazy"
							/>
						</button>
						<!-- Image metadata -->
						{#if image.metadata}
							{@const metadata = image.metadata}
							<div class="text-primary mt-2 text-sm">
								{#if metadata.headline}
									<p class="font-medium">{metadata.headline}</p>
								{/if}
								{#if metadata.description}
									<p class="italic">{metadata.description}</p>
								{/if}
								{#if metadata.creditLine}
									<p class="mt-1 text-xs">Credit: {metadata.creditLine}</p>
								{/if}
							</div>
						{:else}
							<div class="text-primary mt-2 text-sm">
								<p class="font-medium">{image.name}</p>
							</div>
						{/if}
					</div>
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
					<div class="overflow-hidden">
						<video controls class="w-full" preload="metadata">
							<source src={video.path} type="video/mp4" />
							<track kind="captions" />
							Your browser does not support the video tag.
						</video>
						<p class="text-primary mt-2 text-sm font-medium">{video.name}</p>
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
						class="bg-box flex items-center gap-3 p-4"
					>
						<div class="flex-shrink-0">
							<Icon icon="carbon:document" class="text-primary h-6 w-6" />
						</div>
						<div class="flex-1">
							<p class="text-primary text-sm font-medium">{document.name}</p>
							<p class="text-primary text-xs">Click to download</p>
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
		class="fixed inset-0 z-10000 flex items-center justify-center bg-black/80 p-4"
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
				class="absolute top-4 right-4 z-30 cursor-pointer rounded-full bg-black p-2 text-white"
				aria-label="Close lightbox"
			>
				<Icon icon="carbon:close" class="h-6 w-6" />
			</button>

			<!-- Image counter -->
			{#if project.resources?.images && project.resources.images.length > 1}
				<div
					class="absolute -bottom-2 left-1/2 z-30 -translate-x-1/2 rounded-full bg-black px-3 py-1 text-sm text-white"
				>
					{currentImageIndex + 1} / {project.resources.images.length}
				</div>
			{/if}

			<div class="pointer-events-none flex h-full w-full items-center justify-center">
				<div class="flex max-h-[90vh] max-w-[95vw] flex-col items-center gap-6 lg:flex-row">
					<!-- Image -->
					<div class="flex-shrink-0">
						<img
							src={selectedImage.path}
							alt={selectedImage.name}
							class="max-h-[70vh] max-w-[90vw] object-contain shadow-2xl lg:max-w-[60vw]"
						/>
					</div>

					<!-- Metadata panel -->
					{#if selectedImage.metadata}
						{@const metadata = selectedImage.metadata}
						<div
							class="pointer-events-auto max-h-[70vh] max-w-[90vw] space-y-4 overflow-y-auto bg-white/95 p-6 text-sm text-black shadow-xl backdrop-blur-sm lg:max-w-[30vw]"
						>
							<h3 class="mb-4 text-lg font-bold">Image Information</h3>

							<!-- Basic info -->
							<div class="space-y-2">
								{#if metadata.headline}
									<div><strong>Headline:</strong> {metadata.headline}</div>
								{/if}
								{#if metadata.description}
									<div><strong>Description:</strong> {metadata.description}</div>
								{/if}
								<!-- Credit information -->
								{#if metadata.creditLine}
									<div><strong>Credit:</strong> {metadata.creditLine}</div>
								{/if}
							</div>

							<!-- Technical details -->
							{#if metadata.camera || metadata.lens || metadata.focalLength || metadata.aperture || metadata.shutterSpeed || metadata.iso}
								<div class="space-y-2 border-t pt-4">
									<h4 class="font-semibold">Technical Details</h4>
									{#if metadata.camera}
										<div><strong>Camera:</strong> {metadata.camera}</div>
									{/if}
									{#if metadata.lens}
										<div><strong>Lens:</strong> {metadata.lens}</div>
									{/if}
									{#if metadata.focalLength}
										<div><strong>Focal Length:</strong> {metadata.focalLength}</div>
									{/if}
									{#if metadata.aperture}
										<div><strong>Aperture:</strong> {metadata.aperture}</div>
									{/if}
									{#if metadata.shutterSpeed}
										<div><strong>Shutter Speed:</strong> {metadata.shutterSpeed}</div>
									{/if}
									{#if metadata.iso}
										<div><strong>ISO:</strong> {metadata.iso}</div>
									{/if}
								</div>
							{/if}

							<!-- Location and date -->
							{#if metadata.dateTime || metadata.city || metadata.state || metadata.country || metadata.location || metadata.gps}
								<div class="space-y-2 border-t pt-4">
									<h4 class="font-semibold">Location & Date</h4>
									{#if metadata.dateTime}
										<div><strong>Date:</strong> {new Date(metadata.dateTime).toLocaleString()}</div>
									{/if}
									{#if metadata.location}
										<div><strong>Location:</strong> {metadata.location}</div>
									{/if}
									{#if metadata.city || metadata.state || metadata.country}
										<div>
											<strong>Address:</strong>
											{[metadata.city, metadata.state, metadata.country].filter(Boolean).join(', ')}
										</div>
									{/if}
									{#if metadata.gps}
										<div>
											<strong>Coordinates:</strong>
											<a
												href="https://www.openstreetmap.org/?mlat={metadata.gps
													.latitude}&mlon={metadata.gps.longitude}&zoom=15"
												target="_blank"
												rel="noopener noreferrer"
												class="text-blue-600 underline hover:no-underline"
											>
												{metadata.gps.latitude.toFixed(6)}, {metadata.gps.longitude.toFixed(6)}
											</a>
										</div>
									{/if}
								</div>
							{/if}

							<!-- Keywords -->
							{#if metadata.keywords && metadata.keywords.length > 0}
								<div class="space-y-2 border-t pt-4">
									<h4 class="font-semibold">Keywords</h4>
									<div class="flex flex-wrap gap-1">
										{#each metadata.keywords as keyword}
											<span class="bg-gray-200 px-2 py-1 text-xs">{keyword}</span>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
