<script>
	import { base } from '$app/paths';
	import AkBadge from '$lib/components/AkBadge.svelte';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import {
		extractImageMetadata,
		formatCreditLine,
		formatCopyrightNotice,
		getLicenseInfo
	} from '$lib/utils/imageMetadata.js';

	let { data } = $props();
	let project = $derived(data.project);

	// Store metadata for each image
	let imageMetadata = $state(new Map());

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

	// Load metadata for all images
	onMount(async () => {
		if (project.resources?.images) {
			for (const image of project.resources.images) {
				try {
					const metadata = await extractImageMetadata(image.path);
					if (metadata) {
						imageMetadata.set(image.path, metadata);
						// Trigger reactivity
						imageMetadata = imageMetadata;
					}
				} catch (error) {
					console.warn('Failed to load metadata for image:', image.path, error);
				}
			}
		}

		// Also load metadata for thumbnail
		if (project.slug) {
			try {
				const thumbnailPath = `${base}/content/projects/${project.slug}/thumbnail.jpg`;
				const thumbnailMetadata = await extractImageMetadata(thumbnailPath);
				if (thumbnailMetadata) {
					imageMetadata.set(thumbnailPath, thumbnailMetadata);
					// Trigger reactivity
					imageMetadata = imageMetadata;
				}
			} catch (error) {
				console.warn('Failed to load metadata for thumbnail:', error);
			}
		}
	});
</script>

<svelte:window on:keydown={handleKeydown} />

<svelte:head>
	<title>{project.title}</title>
	<meta name="description" content={project.description} />
</svelte:head>

<div class="order-last grid grid-cols-1 lg:order-first lg:grid-cols-3 lg:gap-6">
	<!-- Main content -->
	<article class="prose prose-neutral text-primary col-span-2 mb-12 max-w-none">
		<!-- Main thumbnail -->
		<div class="mb-4">
			<img
				src="{base}/content/projects/{project.slug}/thumbnail.jpg"
				alt={project.title}
				class="w-full bg-neutral-500"
			/>
			<!-- Thumbnail metadata -->
			{#if imageMetadata.has(`${base}/content/projects/${project.slug}/thumbnail.jpg`)}
				{@const metadata = imageMetadata.get(
					`${base}/content/projects/${project.slug}/thumbnail.jpg`
				)}
				{@const creditLine = formatCreditLine(metadata)}
				{@const copyrightNotice = formatCopyrightNotice(metadata)}
				{@const licenseInfo = getLicenseInfo(metadata)}

				{#if creditLine || copyrightNotice || licenseInfo}
					<div class="mt-2 space-y-1 text-xs text-neutral-600">
						{#if creditLine}
							<div>Photo: {creditLine}</div>
						{/if}
						{#if copyrightNotice}
							<div>© {copyrightNotice}</div>
						{/if}
						{#if licenseInfo}
							<div>
								License:
								{#if licenseInfo.url}
									<a
										href={licenseInfo.url}
										target="_blank"
										rel="noopener noreferrer"
										class="underline hover:no-underline"
									>
										{licenseInfo.text || 'View License'}
									</a>
								{:else}
									{licenseInfo.text}
								{/if}
							</div>
						{/if}
					</div>
				{/if}
			{/if}
		</div>

		<!-- Content -->

		{@html project.content}
	</article>

	<!-- Header -->
	<header class="bg-box order-first mb-6 p-6 lg:sticky lg:top-40 lg:order-last lg:self-start">
		<a href="{base}/projects" class="mb-4 block text-sm hover:underline">← Back to Projects</a>

		<AkBadge class="mb-2">{project.type}</AkBadge>

		<h2 class="text-primary mb-2 text-3xl font-bold text-balance">
			{project.title}
			{#if project.featured}
				<Icon icon="carbon:star-filled" class="inline-block size-8 pb-2" />
			{/if}
		</h2>

		<p class="text-primary text-lg leading-relaxed">{project.description}</p>

		<!-- Location & Date -->
		<h3 class="text-primary mt-2 mb-1 font-medium">Location & Date</h3>
		<div class="text-sm">
			<span>{project.location} › </span>
			<span>{new Date(project.date).toISOString().slice(0, 7)}</span>
		</div>

		<!-- Authors -->
		{#if project.authors && project.authors.length > 0}
			<h3 class="text-primary mt-2 mb-1 font-medium">Team</h3>

			{#each project.authors as author}
				<div class="text-sm">
					<span class="font-medium">{author.name}</span>
					<span class="text-primary">› {author.role}</span>
				</div>
			{/each}
		{/if}

		<!-- Project Owner -->
		{#if project.owner}
			<h3 class="text-primary mt-2 mb-1 font-medium">Project Owner</h3>
			<div class="text-sm">
				{project.owner}
			</div>
		{/if}

		<!-- Status -->
		{#if project.status}
			<h3 class="text-primary mt-2 mb-1 font-medium">Status</h3>
			<div class="text-sm capitalize">
				{project.status}
			</div>
		{/if}

		<!-- Surface Area -->
		{#if project.surface_area}
			<h3 class="text-primary mt-2 mb-1 font-medium">Surface Area</h3>
			<div class="text-sm">
				{project.surface_area}
			</div>
		{/if}

		<!-- Cost -->
		{#if project.cost}
			<h3 class="text-primary mt-2 mb-1 font-medium">Cost</h3>
			<div class="text-sm">
				{project.cost}
			</div>
		{/if}

		<!-- Tags -->
		{#if project.tags && project.tags.length > 0}
			<h3 class="text-primary mt-2 mb-1 font-medium">Tags</h3>

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
								class="image-hover-effect h-full w-full bg-neutral-500 object-cover"
								loading="lazy"
							/>
						</button>

						<!-- Image metadata -->
						{#if imageMetadata.has(image.path)}
							{@const metadata = imageMetadata.get(image.path)}
							{@const creditLine = formatCreditLine(metadata)}
							{@const copyrightNotice = formatCopyrightNotice(metadata)}
							{@const licenseInfo = getLicenseInfo(metadata)}

							{#if creditLine || copyrightNotice || licenseInfo}
								<div class="mt-2 space-y-1 text-xs text-neutral-600">
									{#if creditLine}
										<div>Photo: {creditLine}</div>
									{/if}
									{#if copyrightNotice}
										<div>© {copyrightNotice}</div>
									{/if}
									{#if licenseInfo}
										<div>
											License:
											{#if licenseInfo.url}
												<a
													href={licenseInfo.url}
													target="_blank"
													rel="noopener noreferrer"
													class="underline hover:no-underline"
												>
													{licenseInfo.text || 'View License'}
												</a>
											{:else}
												{licenseInfo.text}
											{/if}
										</div>
									{/if}
								</div>
							{/if}
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
					<div class="overflow-hidden bg-neutral-500">
						<video controls class="w-full" preload="metadata">
							<source src={video.path} type="video/mp4" />
							<track kind="captions" />
							Your browser does not support the video tag.
						</video>
						<div class="p-3">
							<p class="text-primary text-sm">{video.name}</p>
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
					{#if imageMetadata.has(selectedImage.path)}
						{@const metadata = imageMetadata.get(selectedImage.path)}
						<div
							class="pointer-events-auto max-h-[70vh] max-w-[90vw] space-y-4 overflow-y-auto bg-white/95 p-6 text-sm text-black shadow-xl backdrop-blur-sm lg:max-w-[30vw]"
						>
							<h3 class="mb-4 text-lg font-bold">Image Information</h3>

							<!-- Basic info -->
							<div class="space-y-2">
								<div><strong>Filename:</strong> {selectedImage.name}</div>
								{#if metadata.description}
									<div><strong>Description:</strong> {metadata.description}</div>
								{/if}
								{#if metadata.headline}
									<div><strong>Headline:</strong> {metadata.headline}</div>
								{/if}
							</div>

							<!-- Credit information -->
							{#if formatCreditLine(metadata) || formatCopyrightNotice(metadata) || getLicenseInfo(metadata)}
								{@const creditLine = formatCreditLine(metadata)}
								{@const copyrightNotice = formatCopyrightNotice(metadata)}
								{@const licenseInfo = getLicenseInfo(metadata)}
								<div class="space-y-2 border-t pt-4">
									<h4 class="font-semibold">Credits & Rights</h4>
									{#if creditLine}
										<div><strong>Credit:</strong> {creditLine}</div>
									{/if}
									{#if copyrightNotice}
										<div><strong>Copyright:</strong> © {copyrightNotice}</div>
									{/if}
									{#if licenseInfo}
										<div>
											<strong>License:</strong>
											{#if licenseInfo.url}
												<a
													href={licenseInfo.url}
													target="_blank"
													rel="noopener noreferrer"
													class="text-blue-600 underline hover:no-underline"
												>
													{licenseInfo.text || 'View License'}
												</a>
											{:else}
												{licenseInfo.text}
											{/if}
										</div>
									{/if}
								</div>
							{/if}

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
												href="https://maps.google.com/?q={metadata.gps.latitude},{metadata.gps
													.longitude}"
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
